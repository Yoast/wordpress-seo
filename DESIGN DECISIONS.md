# Design decisions

The purpose of this document is to document why certain choices have been made.

## Technology choices

### Lodash templates

To improve the readability and maintainability of our HTML, we've chosen to use lodash templates. These can be found in the [templates folder](templates).

The templates are precompiled using [lodash-cli][lodash-cli], this means the HTML is compiled into javascript. To see this in action look at the [compiled template.js file](js/templates.js).

Other options for the template language were [underscore templates][underscore-templates], [mustache][mustache] or [handlebars][handlebars]. We decided against using mustache because it's options were limited for dynamic templating. We decided on using lodash because it is comparable to the other options and we were already planning on using lodash for other parts of our library.

### Browserify

To provide a minified javascript file that can be included as is we use browserify to inline all the required dependencies. Browserify looks at the `require` calls and adds these dependencies in the concatenated file.

## External links

* [Modifications API](https://yoast.com/dev-blog/yoastseo-js-design-decisions/)

[lodash-cli]: https://lodash.com/custom-builds
[underscore-templates]: http://underscorejs.org/#template
[mustache]: https://mustache.github.io
[handlebars]: http://handlebarsjs.com