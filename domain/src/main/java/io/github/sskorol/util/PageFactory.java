package io.github.sskorol.util;

import io.github.sskorol.pages.Page;
import lombok.experimental.UtilityClass;

import static io.github.sskorol.util.PageCacheProvider.getPageCache;
import static org.joor.Reflect.on;

@UtilityClass
public class PageFactory {

    @SuppressWarnings("unchecked")
    public static <T extends Page> T open(final Class<T> pageClass) {
        return (T) at(pageClass).open();
    }

    public static <T extends Page, V> T use(final Class<T> pageClass, final V... values) {
        return at(pageClass, values);
    }

    @SuppressWarnings("unchecked")
    public static <T extends Page, V> T at(final Class<T> pageClass, final V... values) {
        return (T) getPageCache()
            .map(cache -> cache.get(pageClass, page -> on(page).create(values).get()))
            .orElseThrow(() -> new IllegalStateException("Unable to cache " + pageClass));
    }
}
