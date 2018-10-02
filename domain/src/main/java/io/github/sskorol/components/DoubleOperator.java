package io.github.sskorol.components;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.function.BiPredicate;

@Getter
@RequiredArgsConstructor
public enum DoubleOperator implements Operator<Double> {
    EQUAL("", Double::equals),
    GREATER(">", (ob1, ob2) -> ob1.compareTo(ob2) > 0),
    LESS("<", (ob1, ob2) -> ob1.compareTo(ob2) < 0),
    GREATER_OR_EQUAL(">=", (ob1, ob2) -> ob1.compareTo(ob2) >= 0),
    LESS_OR_EQUAL("<=", (ob1, ob2) -> ob1.compareTo(ob2) <= 0);

    private final String value;
    private final BiPredicate<Double, Double> filter;
}
