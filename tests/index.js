// Skip execution in Node
if (module.hot) {
  const context = require.context(
    'mocha-loader!./', // use mocha loader
    false, // no recursive processing
    /\.test.js$/ // only match ending in test.js
  );

  // execute each test suite
  context.keys().forEach(context);
}