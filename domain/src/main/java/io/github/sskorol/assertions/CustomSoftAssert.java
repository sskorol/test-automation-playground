package io.github.sskorol.assertions;

import org.assertj.core.api.AbstractAssert;
import org.assertj.core.api.SoftAssertions;

public class CustomSoftAssert extends SoftAssertions {

    @SuppressWarnings("unchecked")
    public <T, R extends AbstractAssert<R, T>> R assertThat(final T actual, final Class<R> assertClass) {
        return proxy(assertClass, (Class<T>) actual.getClass(), actual);
    }
}
