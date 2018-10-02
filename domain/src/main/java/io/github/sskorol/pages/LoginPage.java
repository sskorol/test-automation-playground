package io.github.sskorol.pages;

import io.github.sskorol.model.User;
import io.qameta.allure.Step;

import static com.codeborne.selenide.Selenide.$;
import static io.github.sskorol.util.PageFactory.at;

public class LoginPage implements Page {

    @Step("Login with {user.username} / {user.password}.")
    public GridPage loginWith(final User user) {
        $("[data-qa=usernameOrEmail]").setValue(user.getUsername());
        $("[data-qa=password]").setValue(user.getPassword());
        $("[data-qa=login-button]").click();
        return at(GridPage.class);
    }
}
