/**
 * Default options for the html-webpack-plugin HTML renderer
 *
 * See https://github.com/ampedandwired/html-webpack-plugin#configuration
 * for possible options. Any other options will be available to the template
 * under `htmlWebpackPlugin.options`
 */

 module.exports = {
  // html-webpack-plugin options
  template: './public/template.ejs',
  favicon: "./public/knitheworld-favicon.ico",

  // KnitheWorld Metadata
  title: 'KnitheWorld ',
  description:'A New Way To Knit!',
  url: "https://knitheworld-bb33d.web.app/",

  // override if mobile-friendly
  viewportWidth: 'device-width',

  // Open graph
  og_image: "https://knitheworld-bb33d.web.app/static/icons/knitheworld-icon.png",
  og_image_type: 'image/png',

  // Analytics & Monitoring
};