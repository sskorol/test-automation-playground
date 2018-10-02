package io.github.sskorol.components;

import java.util.function.BiPredicate;

public interface Operator<T> {

    String getValue();

    BiPredicate<T, T> getFilter();
}
