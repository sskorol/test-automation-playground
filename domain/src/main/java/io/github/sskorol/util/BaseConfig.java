package io.github.sskorol.util;

import org.aeonbits.owner.Config;
import org.aeonbits.owner.ConfigCache;

@Config.LoadPolicy(Config.LoadType.MERGE)
public interface BaseConfig extends Config {

    BaseConfig CONFIG = ConfigCache.getOrCreate(BaseConfig.class, System.getenv(), System.getProperties());

    @DefaultValue("http://${appHost}:${appPort}")
    String url();

    @DefaultValue("4")
    int movementStep();
}
