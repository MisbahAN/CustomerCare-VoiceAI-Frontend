const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add node_modules to the list of allowed directories
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src')
      ];
      
      // Ensure react-refresh is properly resolved
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'react-refresh/runtime': path.resolve(__dirname, 'node_modules/react-refresh/runtime.js')
      };

      // Add react-refresh plugin in development
      if (process.env.NODE_ENV === 'development') {
        webpackConfig.plugins.push(
          new ReactRefreshWebpackPlugin()
        );
      }
      
      return webpackConfig;
    }
  },
  babel: {
    plugins: [
      ...(process.env.NODE_ENV === 'development' ? ['react-refresh/babel'] : [])
    ]
  }
}; 