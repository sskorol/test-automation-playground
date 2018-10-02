package io.github.sskorol.util;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SortOrder {
    ASC("▲"),
    DESC("▼"),
    NONE("");

    private final String value;
}
