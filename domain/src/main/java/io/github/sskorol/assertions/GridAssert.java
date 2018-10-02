package io.github.sskorol.assertions;

import io.github.sskorol.components.Operator;
import io.github.sskorol.pages.GridPage;
import io.github.sskorol.util.Column;
import io.github.sskorol.util.PageFactory;
import io.github.sskorol.util.SortOrder;
import io.qameta.allure.Step;
import io.vavr.API;
import lombok.val;
import one.util.streamex.StreamEx;
import org.assertj.core.api.AbstractAssert;
import org.assertj.core.internal.Iterables;

import java.util.List;

import static io.github.sskorol.util.SortOrder.DESC;
import static io.vavr.API.$;
import static io.vavr.API.Case;
import static io.vavr.API.Match;

public class GridAssert extends AbstractAssert<GridAssert, GridPage> {

    public GridAssert(final GridPage gridPage) {
        super(gridPage, GridAssert.class);
    }

    @Step("Verify that {column} column values are sorted {order}.")
    public GridAssert recordsAreSorted(final Column column, final SortOrder order) {
        isNotNull();

        val actualValues = actual.getColumnValues(column);
        Iterables.instance().assertContainsExactly(info, actualValues, sort(actualValues, order).toArray());

        return this;
    }

    @SuppressWarnings("unchecked")
    @Step("Verify that {column.name} column values {operator.value} {value}.")
    public <T> GridAssert recordsMatchCondition(final Column column, final Operator<T> operator, final T value) {
        isNotNull();

        val columnValues = PageFactory.at(GridPage.class).getColumnValues(column);
        if (!(hasBoundaries(column, value) && columnValues.contains(value))
            || !matchCondition((List<T>) columnValues, operator, value)) {
            failWithMessage("\nExpected Salary values %s to be %s %s,\nbut weren't.\n",
                columnValues,
                operator.getValue(),
                value);
        }

        return this;
    }

    private <T> StreamEx<T> sort(final List<T> actualValues, final SortOrder order) {
        return Match(order).of(
            Case(API.$(DESC), () -> StreamEx.of(actualValues).reverseSorted()),
            Case($(), () -> StreamEx.of(actualValues).sorted())
        );
    }

    private <T> boolean matchCondition(final List<T> columnValues, final Operator<T> operator, final T value) {
        return StreamEx.of(columnValues).allMatch(currentValue ->
            operator.getFilter().test(currentValue, value));
    }

    private <T> boolean hasBoundaries(final Column column, final T value) {
        return actual.getRawColumnValues().get(column).contains(value);
    }
}
