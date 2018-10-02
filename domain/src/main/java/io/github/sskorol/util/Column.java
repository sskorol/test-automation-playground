package io.github.sskorol.util;

import io.github.sskorol.components.Filterable;

import java.util.function.Function;

public interface Column {

    Function<String, String> REFORMAT = str -> str.replace(",", "");
    Function<String, Integer> TO_INT = REFORMAT.andThen(Integer::parseInt);
    Function<String, Double> TO_DOUBLE = REFORMAT.andThen(Double::parseDouble);

    String getName();

    <T> Function<String, T> getValueMapper();

    <T extends Filterable> T getFilter();
}
