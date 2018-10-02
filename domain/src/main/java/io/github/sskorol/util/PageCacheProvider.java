package io.github.sskorol.util;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.sskorol.pages.Page;
import org.testng.IInvokedMethod;
import org.testng.IInvokedMethodListener;
import org.testng.ITestResult;

import java.util.Optional;

public class PageCacheProvider implements IInvokedMethodListener {

    private static final ThreadLocal<Cache<Class<? extends Page>, Page>> PAGE_CACHE = new ThreadLocal<>();

    public static Optional<Cache<Class<? extends Page>, Page>> getPageCache() {
        return Optional.ofNullable(PAGE_CACHE.get());
    }

    @Override
    public void beforeInvocation(final IInvokedMethod method, final ITestResult testResult) {
        if (method.isTestMethod()) {
            createPageCache();
        }
    }

    @Override
    public void afterInvocation(final IInvokedMethod method, final ITestResult testResult) {
        if (method.isTestMethod()) {
            cleanupPageCache();
        }
    }

    private void createPageCache() {
        PAGE_CACHE.set(Caffeine.newBuilder().build());
    }

    private void cleanupPageCache() {
        getPageCache().ifPresent(Cache::invalidateAll);
        PAGE_CACHE.remove();
    }
}
