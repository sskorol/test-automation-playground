package io.github.sskorol.model;

import lombok.Data;
import org.openqa.selenium.support.Color;

import java.time.LocalDate;

@Data
public class TooltipContent {

    private final LocalDate date;
    private final double open;
    private final double high;
    private final double low;
    private final double close;
    private final String color;

    public boolean hasColor(final StrokeColor color) {
        return Color.fromString(this.color).equals(color.getValue());
    }

    public boolean hasPositiveEODValue() {
        return open - close >= 0.0;
    }
}
