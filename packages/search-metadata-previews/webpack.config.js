const nodeExternals = require('webpack-node-externals');
const path = require( "path" );
module.exports = {
  target: 'web',
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'index.js',
    library: 'SearchMetadataPreview',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  },
  optimization: {
    usedExports: true,
  },
  externals: [nodeExternals({
    modulesDir: "node_modules",
    additionalModuleDirs: [
      "../../node_modules"
    ],
    allowlist: [
      "@yoast/replacement-variable-editor",
      "yoastseo",
      "@yoast/components",
    ],
  })], // in order to ignore all modules in node_modules folder
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options:{
            presets: ["@babel/preset-env", "@babel/preset-react"],
          }
        }
      },
    ]
  }
}
