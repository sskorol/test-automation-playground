package io.github.sskorol.assertions;

import lombok.experimental.UtilityClass;
import org.assertj.core.api.AbstractAssert;
import org.assertj.core.api.SoftAssertions;

import static java.util.Optional.ofNullable;

@UtilityClass
public class AssertWrapper {

    private static final ThreadLocal<CustomSoftAssert> ASSERTIONS_CONTAINER = new ThreadLocal<>();

    public static void enableSoftAssertions() {
        ASSERTIONS_CONTAINER.set(new CustomSoftAssert());
    }

    public static void disableSoftAssertions() {
        ASSERTIONS_CONTAINER.remove();
    }

    public static void assertAll() {
        ofNullable(getSoftAssertions()).ifPresent(SoftAssertions::assertAll);
    }

    public static <T, R extends AbstractAssert<R, T>> R assertThat(final T object, final Class<R> assertClass) {
        return getSoftAssertions().assertThat(object, assertClass);
    }

    private static CustomSoftAssert getSoftAssertions() {
        return ASSERTIONS_CONTAINER.get();
    }
}
