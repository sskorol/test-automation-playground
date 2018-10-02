package io.github.sskorol.pages;

import com.codeborne.selenide.Selenide;
import io.qameta.allure.Step;

import static com.codeborne.selenide.WebDriverRunner.setWebDriver;
import static io.github.sskorol.listeners.BaseListener.getDriverMetaData;
import static io.github.sskorol.util.BaseConfig.CONFIG;

public interface Page {

    default Page open() {
        return open(url());
    }

    @Step("Open {url}")
    default Page open(final String url) {
        setWebDriver(getDriverMetaData()._1);
        Selenide.open(url);
        return this;
    }

    default String url() {
        return CONFIG.url();
    }
}
