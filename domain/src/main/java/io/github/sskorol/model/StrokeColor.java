package io.github.sskorol.model;

import lombok.RequiredArgsConstructor;
import org.openqa.selenium.support.Color;

@RequiredArgsConstructor
public enum StrokeColor {
    RED("#EE3647"),
    BLUE("#2F76EB");

    private final String value;

    public Color getValue() {
        return Color.fromString(value);
    }
}
