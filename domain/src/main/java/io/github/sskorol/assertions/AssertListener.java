package io.github.sskorol.assertions;

import org.testng.IInvokedMethod;
import org.testng.IInvokedMethodListener;
import org.testng.ITestResult;

import static io.github.sskorol.assertions.AssertWrapper.assertAll;
import static io.github.sskorol.assertions.AssertWrapper.disableSoftAssertions;
import static io.github.sskorol.assertions.AssertWrapper.enableSoftAssertions;

public class AssertListener implements IInvokedMethodListener {

    @Override
    public void beforeInvocation(final IInvokedMethod method, final ITestResult testResult) {
        if (method.isTestMethod()) {
            enableSoftAssertions();
        }
    }

    @Override
    public void afterInvocation(final IInvokedMethod method, final ITestResult testResult) {
        if (method.isTestMethod()) {
            assertAndUpdateResult(method, testResult);
            disableSoftAssertions();
        }
    }

    private void assertAndUpdateResult(final IInvokedMethod method, final ITestResult testResult) {
        try {
            assertAll();
        } catch (AssertionError ex) {
            testResult.getTestContext().getPassedTests().removeResult(testResult);
            testResult.setStatus(ITestResult.FAILURE);
            testResult.setThrowable(ex);
            testResult.getTestContext().getFailedTests().addResult(testResult, method.getTestMethod());
        }
    }
}
