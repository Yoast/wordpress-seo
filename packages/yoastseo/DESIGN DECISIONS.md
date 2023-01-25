# Design decisions

The purpose of this document is to document why certain choices have been made.

## Technology choices

### Lodash templates

To improve the readability and maintainability of our HTML, we've chosen to use lodash templates. These can be found in the [templates folder](templates).

Other options for the template language were [underscore templates][underscore-templates], [mustache][mustache] or [handlebars][handlebars]. We decided against using mustache because it's options were limited for dynamic templating. We decided on using lodash because it is comparable to the other options and we were already planning on using lodash for other parts of our library.

### Modules

We considered different module styles when introducing modules: [AMD][amd], [node style][node-style] and [ES6 style][es6-style]. We decided against using `AMD` because we don't need any asynchronous operations. [ES6 style][es6-style] modules are still very much in their infancy so for now we use [node style][node-style] modules until we think we can switch.

## External links

* [Modifications API](https://yoast.com/dev-blog/yoastseo-js-design-decisions/)

[lodash-cli]: https://lodash.com/custom-builds
[underscore-templates]: http://underscorejs.org/#template
[mustache]: https://mustache.github.io
[handlebars]: http://handlebarsjs.com
[amd]: https://github.com/amdjs/amdjs-api/wiki/AMD
[node-style]: https://nodejs.org/api/modules.html
[es6-style]: http://www.2ality.com/2014/09/es6-modules-final.html
