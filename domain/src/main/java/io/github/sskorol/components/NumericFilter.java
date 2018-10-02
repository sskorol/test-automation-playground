package io.github.sskorol.components;

import io.github.sskorol.pages.GridPage;
import io.github.sskorol.util.Column;
import io.qameta.allure.Step;
import lombok.RequiredArgsConstructor;

import static com.codeborne.selenide.Selenide.$;
import static io.github.sskorol.util.PageFactory.at;
import static org.openqa.selenium.Keys.ENTER;

@RequiredArgsConstructor
public class NumericFilter implements Filterable {

    private final Column column;

    @SuppressWarnings("unchecked")
    @Step("Expand filter.")
    public <T extends Filterable> T expandFilter() {
        $(".react-grid-Toolbar button").click();
        return (T) this;
    }

    @SuppressWarnings("unchecked")
    @Step("Filter values by the following condition: {operator.value} {value}.")
    public final <T extends Filterable, R> T filterBy(final Operator<R> operator, final R value) {
        at(GridPage.class).adjustRawColumnData(column);
        $("input[data-qa=header-filter-" + column.getName() + "]")
            .sendKeys(operator.getValue() + value + ENTER);
        return (T) this;
    }
}
