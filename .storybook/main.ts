import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';
import { NormalModuleReplacementPlugin } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (webpackConfig) => {
    // Alias react-native → react-native-web
    webpackConfig.resolve!.alias = {
      ...webpackConfig.resolve!.alias,
      // Modules internes RN non disponibles dans react-native-web (doit être avant l'alias react-native)
      'react-native/Libraries/Utilities/codegenNativeComponent': path.resolve(
        __dirname,
        'mocks/codegenNativeComponent.js',
      ),
      // Packages natifs incompatibles avec le web
      '@expo/vector-icons': path.resolve(__dirname, 'mocks/vectorIcons.js'),
      '@expo/vector-icons/MaterialCommunityIcons': path.resolve(
        __dirname,
        'mocks/vectorIcons.js',
      ),
      'react-native-vector-icons/MaterialCommunityIcons': path.resolve(
        __dirname,
        'mocks/vectorIcons.js',
      ),
      '@react-native-vector-icons/material-design-icons': path.resolve(
        __dirname,
        'mocks/vectorIcons.js',
      ),
      // React Native → React Native Web
      'react-native': 'react-native-web',
      '@': path.resolve(__dirname, '../src'),
    };

    // Exclure les .svg de la règle file-loader par défaut
    const rules = webpackConfig.module!.rules as any[];
    const fileLoaderRule = rules.find(
      (rule) => rule?.test && rule.test.toString().includes('svg'),
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    // Traiter les .svg avec @svgr/webpack (composants React web-natifs)
    rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Transpiler TS/TSX avec Babel
    rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              { targets: { browsers: ['last 2 versions'] } },
            ],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
          ],
        },
      },
    });

    // Rediriger tous les imports de sous-chemins @expo/vector-icons vers le mock
    webpackConfig.plugins!.push(
      new NormalModuleReplacementPlugin(
        /@expo\/vector-icons/,
        path.resolve(__dirname, 'mocks/vectorIcons.js'),
      ),
    );

    webpackConfig.resolve!.extensions = [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      ...(webpackConfig.resolve!.extensions ?? []),
    ];

    return webpackConfig;
  },
};

export default config;
