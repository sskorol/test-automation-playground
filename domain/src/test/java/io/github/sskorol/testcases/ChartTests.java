package io.github.sskorol.testcases;

import io.github.sskorol.model.User;
import io.github.sskorol.pages.ChartPage;
import io.github.sskorol.pages.LoginPage;
import org.testng.annotations.Test;

import static io.github.sskorol.assertions.AssertEntryPoint.verifyThat;
import static io.github.sskorol.util.PageFactory.at;
import static io.github.sskorol.util.PageFactory.open;

public class ChartTests {

    @Test
    public void chartPointsShouldMatchDateAndColorRules() {
        open(LoginPage.class)
            .loginWith(User.dummy())
            .select(ChartPage.class)
            .scan();

        verifyThat(at(ChartPage.class))
            .tooltipColorsMatchEODPriceDiffRules()
            .tooltipDatesAreInChronologicalOrder();
    }
}
