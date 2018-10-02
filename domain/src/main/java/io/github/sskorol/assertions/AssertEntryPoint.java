package io.github.sskorol.assertions;

import io.github.sskorol.pages.ChartPage;
import io.github.sskorol.pages.GridPage;
import lombok.experimental.UtilityClass;

import static io.github.sskorol.assertions.AssertWrapper.assertThat;

@UtilityClass
public class AssertEntryPoint {

    public static ChartAssert verifyThat(final ChartPage chartPage) {
        return assertThat(chartPage, ChartAssert.class);
    }

    public static GridAssert verifyThat(final GridPage gridPage) {
        return assertThat(gridPage, GridAssert.class);
    }
}
