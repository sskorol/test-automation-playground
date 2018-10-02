package io.github.sskorol.pages;

import com.codeborne.selenide.SelenideElement;
import io.github.sskorol.model.TooltipContent;
import io.qameta.allure.Step;
import lombok.Getter;
import lombok.val;
import one.util.streamex.StreamEx;

import java.util.ArrayList;
import java.util.List;

import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.actions;
import static io.github.sskorol.util.BaseConfig.CONFIG;
import static java.lang.Double.parseDouble;
import static java.lang.Integer.parseInt;
import static java.time.LocalDate.parse;
import static java.time.format.DateTimeFormatter.ofPattern;

public class ChartPage extends Menu {

    @Getter
    private final List<TooltipContent> tooltipContentList = new ArrayList<>();

    @Step("Scan chart and retrieve tooltips info.")
    public ChartPage scan() {
        val chart = $("rect.react-stockcharts-crosshair-cursor");
        val width = parseInt(chart.getAttribute("width"));
        val height = parseInt(chart.getAttribute("height")) / 2;

        StreamEx.iterate(0, x -> x + CONFIG.movementStep())
            .takeWhile(x -> x <= width)
            .forEach(x -> moveTo(chart, x, height).readTooltipContent());

        return this;
    }

    private ChartPage moveTo(final SelenideElement element, final int x, final int y) {
        actions().moveToElement(element.getWrappedElement(), x, y).perform();
        return this;
    }

    private ChartPage readTooltipContent() {
        val date = parse($("tspan[data-qa=time]").text(), ofPattern("yyyy-MM-dd"));
        val open = parseDouble($("tspan[data-qa=open]").text());
        val high = parseDouble($("tspan[data-qa=high]").text());
        val low = parseDouble($("tspan[data-qa=low]").text());
        val close = parseDouble($("tspan[data-qa=close]").text());
        val color = $("g.react-stockcharts-tooltip-content>rect").getAttribute("stroke");

        tooltipContentList.add(new TooltipContent(date, open, high, low, close, color));

        return this;
    }
}
