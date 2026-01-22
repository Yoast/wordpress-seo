# Change Log
All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.
We follow [Semantic Versioning](http://semver.org/).

## 0.3.0
### Other:
* Bumps `@yoast/ui-library` to version `4.4.0` from `4.3.0` and `@yoast/tailwindcss-preset` to version `2.5.0` from `2.4.0`. [#22862](https://github.com/Yoast/wordpress-seo/pull/22862)

## 0.2.0
### Enhancements:
* Fixes the translations for the countries in the country selector, fixes the auto complete in the selector and updated the docs. [#21810](https://github.com/Yoast/wordpress-seo/pull/21810)
* Adds the package for related keyphrase suggestion with table, intent badge, table button, difficulty bullet , and country selector. [#21798](https://github.com/Yoast/wordpress-seo/pull/21798)
* Improves related keyphrase suggestions tooltips accessibility. [#21894](https://github.com/Yoast/wordpress-seo/pull/21894)

### Bugfixes:
* Fixes a bug where the CountrySelector would have invalid default values. [#22265](https://github.com/Yoast/wordpress-seo/pull/22265)
* Fixes a bug where styles on buttons, intent badge and modal links would not adjust the direction when on RTL view. [#21869](https://github.com/Yoast/wordpress-seo/pull/21869)
* Fixes a bug where the UserMessage would always result in a message, while the usages did were not made for that. [#22412](https://github.com/Yoast/wordpress-seo/pull/22412)

### Other:
* Upgrades TailwindCSS to v3.4.16. [#21909](https://github.com/Yoast/wordpress-seo/pull/21909)
* Upgrades WP packages to minimum supported WP version 6.7. [#22466](https://github.com/Yoast/wordpress-seo/pull/22466)

### Non user facing:
* Split the translation for the "Add keyphrase" header cell into 2 lines and align it to the end of the cell. [#21917](https://github.com/Yoast/wordpress-seo/pull/21917)
* Fixes a bug where the storybook would no longer build. [#22259](https://github.com/Yoast/wordpress-seo/pull/22259)
* Bumps `@yoast/eslint-config` to version `8.1.0` from `8.0.0`. [#22256](https://github.com/Yoast/wordpress-seo/pull/22256)
* Adds isLoading prop to related keyphrase table. [#21812](https://github.com/Yoast/wordpress-seo/pull/21812)
* Refactors the `defaultProps` to be `defaultArguments` instead. [#22265](https://github.com/Yoast/wordpress-seo/pull/22265)

## 0.1.0
Adds the components for the related keyphrases suggestions table, the table itself and the country selector.
