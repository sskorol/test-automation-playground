const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const rewireMobX = require('react-app-rewire-mobx');
const rewireEslint = require('react-app-rewire-eslint');

module.exports = function override(config, env) {
    config = rewireEslint(config, env);
    config = rewireMobX(config, env);
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess.withLoaderOptions({
        javascriptEnabled: true,
        modifyVars: {
            '@layout-body-background': '#FFFFFF',
            '@layout-header-background': '#FFFFFF',
            '@layout-footer-background': '#FFFFFF'
        }
    })(config, env);
    return config;
};
