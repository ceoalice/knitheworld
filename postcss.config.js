var postCSSConfig = [
  /* autoprefix for different browser vendors */
  require('autoprefixer'),
  /* enable css @imports like Sass/Less */
  require('postcss-import'),
  /* require global variables */
  require('postcss-simple-vars')
  ]
  
  // Export the PostCSS Config for usage in webpack
  module.exports = postCSSConfig;