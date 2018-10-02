package io.github.sskorol.pages;

import io.qameta.allure.Step;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import one.util.streamex.StreamEx;

import static com.codeborne.selenide.Selenide.$;
import static io.github.sskorol.util.PageFactory.at;

public class Menu implements Page {

    @Getter
    @RequiredArgsConstructor
    public enum Item {
        CHART(ChartPage.class),
        GRID(GridPage.class);

        private final Class<? extends Page> pageClass;

        public static <T extends Page> String getItem(final Class<T> pageClass) {
            return StreamEx.of(values())
                .findFirst(item -> item.getPageClass() == pageClass)
                .map(item -> item.name().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Unable to find a menu item mapped with " + pageClass));
        }
    }

    public <T extends Page> T select(final Class<T> pageClass) {
        $("[data-qa='profile-menu']").click();
        $("[data-qa='" + wrapMenuItem(Item.getItem(pageClass)) + "']").click();
        return at(pageClass);
    }

    @Step("Select \"{item}\" menu item.")
    private String wrapMenuItem(final String item) {
        return item;
    }
}
