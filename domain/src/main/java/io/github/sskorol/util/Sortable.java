package io.github.sskorol.util;

import io.github.sskorol.pages.Page;
import io.qameta.allure.Step;
import lombok.val;

import static io.github.sskorol.util.SortOrder.ASC;
import static io.github.sskorol.util.SortOrder.DESC;
import static io.github.sskorol.util.SortOrder.NONE;

public interface Sortable<T extends Page> {

    @Step("Sort {column.name} column {expectedOrder}")
    default Sortable<T> sort(final Column column, final SortOrder expectedOrder) {
        val currentSortOrder = getCurrentOrder(column);

        if (currentSortOrder == ASC && expectedOrder == NONE
            || currentSortOrder == DESC && expectedOrder == ASC
            || currentSortOrder == NONE && expectedOrder == DESC) {
            return clickHeader(column).clickHeader(column);
        } else if (currentSortOrder == DESC && expectedOrder == NONE
            || currentSortOrder == NONE && expectedOrder == ASC
            || currentSortOrder == ASC && expectedOrder == DESC) {
            return clickHeader(column);
        }

        return this;
    }

    Sortable<T> clickHeader(Column column);

    SortOrder getCurrentOrder(Column column);
}
