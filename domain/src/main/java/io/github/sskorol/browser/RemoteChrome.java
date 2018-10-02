package io.github.sskorol.browser;

import io.github.sskorol.config.XmlConfig;
import io.github.sskorol.core.Browser;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.chrome.ChromeOptions;

public class RemoteChrome implements Browser {

    public Name name() {
        return Name.Chrome;
    }

    public boolean isRemote() {
        return true;
    }

    public Capabilities configuration(final XmlConfig config) {
        final ChromeOptions options = new ChromeOptions();
        options.setCapability("enableVNC", true);
        options.setCapability("name", config.getTestName());
        options.setCapability("screenResolution", "1920x1080x24");
        return merge(config, options);
    }
}
