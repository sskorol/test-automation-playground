package io.github.sskorol.pages;

import io.github.sskorol.components.Filterable;
import io.github.sskorol.components.NumericFilter;
import io.github.sskorol.util.Column;
import io.github.sskorol.util.SortOrder;
import io.github.sskorol.util.Sortable;
import io.qameta.allure.Step;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.val;
import one.util.streamex.StreamEx;
import org.openqa.selenium.By;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static com.codeborne.selenide.CollectionCondition.sizeGreaterThan;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.$$;
import static io.github.sskorol.util.PageFactory.use;
import static io.github.sskorol.util.SortOrder.ASC;
import static io.github.sskorol.util.SortOrder.DESC;
import static io.github.sskorol.util.SortOrder.NONE;

public class GridPage extends Menu implements Page, Sortable<GridPage> {

    @Getter
    private final Map<Column, List<?>> rawColumnValues = new HashMap<>();

    public List<?> getColumnValues(final Column column) {
        return StreamEx.of($$("[data-qa=cell-" + column.getName() + "]")
            .shouldHave(sizeGreaterThan(0))
            .texts())
            .map(column.getValueMapper())
            .toList();
    }

    @Step("Adjust {column.name} column:")
    public <T extends Filterable> T adjustColumn(final Column column) {
        return column.getFilter();
    }

    @Override
    public GridPage clickHeader(final Column column) {
        $("[data-qa=" + column.getName() + "]").click();
        return this;
    }

    @Override
    public SortOrder getCurrentOrder(final Column column) {
        val arrow = $(By.xpath("//div[@data-qa='" + column.getName() + "']/preceding-sibling::span"));
        return !arrow.isDisplayed() ? NONE : arrow.text().equals(ASC.getValue()) ? ASC : DESC;
    }

    public GridPage adjustRawColumnData(final Column column) {
        rawColumnValues.put(column, getColumnValues(column));
        return this;
    }

    @Getter
    @RequiredArgsConstructor
    public enum GridColumn implements Column {
        AGE(Column.TO_INT, NumericFilter.class),
        SALARY(Column.TO_DOUBLE, NumericFilter.class);

        private final Function<String, ?> valueMapper;
        private final Class<? extends Filterable> filter;

        @SuppressWarnings("unchecked")
        public <T extends Filterable> T getFilter() {
            return (T) use(filter, this);
        }

        public String getName() {
            return name().toLowerCase();
        }
    }
}
