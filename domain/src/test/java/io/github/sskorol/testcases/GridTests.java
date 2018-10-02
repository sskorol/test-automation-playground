package io.github.sskorol.testcases;

import io.github.sskorol.components.Operator;
import io.github.sskorol.core.DataSupplier;
import io.github.sskorol.model.User;
import io.github.sskorol.pages.GridPage;
import io.github.sskorol.pages.LoginPage;
import io.github.sskorol.util.Column;
import one.util.streamex.StreamEx;
import org.testng.annotations.Test;

import static io.github.sskorol.assertions.AssertEntryPoint.verifyThat;
import static io.github.sskorol.components.DoubleOperator.GREATER_OR_EQUAL;
import static io.github.sskorol.pages.GridPage.GridColumn.AGE;
import static io.github.sskorol.pages.GridPage.GridColumn.SALARY;
import static io.github.sskorol.util.PageFactory.at;
import static io.github.sskorol.util.PageFactory.open;
import static io.github.sskorol.util.SortOrder.ASC;
import static io.github.sskorol.util.SortOrder.DESC;

public class GridTests {

    @Test(dataProvider = "sortingData")
    public void recordsShouldBeSortable(final Column column) {
        open(LoginPage.class)
            .loginWith(User.dummy())
            .sort(column, ASC);

        verifyThat(at(GridPage.class)).recordsAreSorted(column, ASC);

        at(GridPage.class)
            .sort(column, DESC);

        verifyThat(at(GridPage.class)).recordsAreSorted(column, DESC);
    }

    @Test(dataProvider = "filteringData")
    public <T> void recordsShouldBeFiltered(final Column column, final Operator<T> operator, final T value) {
        open(LoginPage.class)
            .loginWith(User.dummy())
            .adjustColumn(column)
            .expandFilter()
            .filterBy(operator, value);

        verifyThat(at(GridPage.class))
            .recordsMatchCondition(column, operator, value);
    }

    @DataSupplier
    public StreamEx sortingData() {
        return StreamEx.of(AGE, SALARY);
    }

    @DataSupplier(transpose = true)
    public StreamEx filteringData() {
        return StreamEx.of(SALARY, GREATER_OR_EQUAL, 874.71);
    }
}
