package io.github.sskorol.assertions;

import io.github.sskorol.model.TooltipContent;
import io.github.sskorol.pages.ChartPage;
import io.qameta.allure.Step;
import lombok.val;
import one.util.streamex.StreamEx;
import org.assertj.core.api.AbstractAssert;
import org.assertj.core.internal.Iterables;
import org.assertj.core.presentation.PredicateDescription;

import java.time.LocalDate;

import static io.github.sskorol.model.StrokeColor.BLUE;
import static io.github.sskorol.model.StrokeColor.RED;

public class ChartAssert extends AbstractAssert<ChartAssert, ChartPage> {

    public ChartAssert(final ChartPage chartPage) {
        super(chartPage, ChartAssert.class);
    }

    @Step("Verify that tooltip dates are in chronological order.")
    public ChartAssert tooltipDatesAreInChronologicalOrder() {
        isNotNull();
        val actualDates = StreamEx.of(actual.getTooltipContentList())
            .map(TooltipContent::getDate)
            .toList();
        val expectedDates = StreamEx.of(actualDates)
            .sorted(LocalDate::compareTo)
            .toArray(LocalDate.class);
        Iterables.instance().assertContainsExactly(info, actualDates, expectedDates);
        return this;
    }

    @Step("Verify that tooltip colors match EOD price diff rules.")
    public ChartAssert tooltipColorsMatchEODPriceDiffRules() {
        isNotNull();
        Iterables.instance().assertAllMatch(info, actual.getTooltipContentList(),
            tooltip -> tooltip.hasPositiveEODValue() ? tooltip.hasColor(BLUE) : tooltip.hasColor(RED),
            new PredicateDescription("Tooltip colors match EOD price diff"));
        return this;
    }
}
