---
name: deprecate-php
description: "Deprecate PHP methods, classes, filters, and actions in the Yoast wordpress-seo repository following the official deprecation guide. Handles finding usages, adding _deprecated_function() calls, PHPDoc annotations, moving files to src/deprecated/, updating the DI container deprecated-classes list, and deprecating hooks with do_action_deprecated/apply_filters_deprecated."
---

# Deprecate PHP

Follow this process to deprecate a PHP method, class, filter, or action in Yoast SEO.

## Step 1 — Find usages

Before making any changes, locate all existing usages:

1. **Code:** Search the codebase for the method/class/hook name. Also search for the name as a string (it may be used as a hook callback that static analysis won't catch).
2. **Docs:** Search the developer docs for mentions; note any that need updating or a deprecation notice.
3. **Third parties:** Check [Veloria (formerly WPDirectory)](https://https://veloria.dev/) and GitHub for external plugins/themes using the symbol. If an actively supported plugin depends on it, consider notifying the maintainer before the RC1 cut.

If no usages are found, it is safe to proceed. If usages exist, decide whether an alternative should be provided and note it for the deprecation call.

## Step 2 — Is there an alternative?

If the functionality is being moved (e.g. util → helper), move the implementation to the new location first, then have the old method delegate to it. Do **not** duplicate logic.

## Deprecating a method

1. Add the `_deprecated_function()` call as the **first line of the method body**:

```php
\_deprecated_function( __METHOD__, 'Yoast SEO X.Y', 'Alternative_Class::method_name' );
```

- First arg: `__METHOD__` (the called method).
- Second arg: `'Yoast SEO X.Y'` — always prefix with `'Yoast SEO '` so the version is identifiable in error logs.
- Third arg: the alternative method (omit if there is none).

2. If an alternative exists, call it with the correct arguments and return its result.

3. Update the PHPDoc block — add **before** `@param`:

```php
 * @deprecated X.Y
 * @codeCoverageIgnore
```

**Full example** (method moved to a helper):

```php
/**
 * Formats a name.
 *
 * @deprecated 20.0
 * @codeCoverageIgnore
 *
 * @param string $name The name to format.
 *
 * @return string The formatted name.
 */
public function format_name( $name ) {
    \_deprecated_function( __METHOD__, 'Yoast SEO 20.0', 'Formatter::format_name' );
    return YoastSEO()->helpers->formatter->format_name( $name );
}
```

## Deprecating a class

1. Add `_deprecated_function( __METHOD__, 'Yoast SEO X.Y' )` to `__construct` — this is the single point that fires the notice for any caller that instantiates the class. Child classes that call `parent::__construct()` inherit the notice automatically.
2. Add `@deprecated X.Y` and `@codeCoverageIgnore` to the **class-level PHPDoc block** and to `__construct`'s PHPDoc block.
3. Add `@deprecated X.Y` and `@codeCoverageIgnore` to the PHPDoc of every public method, and add a `_deprecated_function()` call as the **first line** of each deprecated public method body (this matches existing deprecated classes under `src/deprecated/src/`).
4. If an individual public method is independently callable (e.g. used as a hook callback or called statically), ensure it has its own `_deprecated_function()` call even if the class also emits a notice elsewhere.
5. Internal helper functions/methods that are only ever called by already-deprecated public API do **not** need a `_deprecated_function()` call — the public entry point already fires the notice. Add `@deprecated X.Y` and `@codeCoverageIgnore` to their PHPDoc for clarity.
6. Move the file to `src/deprecated/` — especially when it is (or was) wired into the DI container or exposed on the surface API. Only skip this move if there is a specific technical reason.
7. If the class is registered in the DI container, add it to `config/dependency-injection/deprecated-classes.php`.

**Full example:**

```php
/**
 * @deprecated 20.0
 * @codeCoverageIgnore
 */
class WPSEO_Utils {

    /**
     * Class constructor.
     *
     * @deprecated 20.0
     * @codeCoverageIgnore
     */
    public function __construct() {
        \_deprecated_function( __METHOD__, 'Yoast SEO 20.0' );
    }

    /**
     * Formats a name.
     *
     * @deprecated 20.0
     * @codeCoverageIgnore
     *
     * @param string $name The name to format.
     *
     * @return string The formatted name.
     */
    public function format_name( $name ) {
        \_deprecated_function( __METHOD__, 'Yoast SEO 20.0', 'Formatter::format_name' );
        return YoastSEO()->helpers->formatter->format_name( $name );
    }
}
```

## Deprecating a filter or action

Use WordPress's built-in deprecated-hook wrappers in place of the original call:

```php
// Action:
\do_action_deprecated( 'wpseo_action', [ $arg1, $arg2 ], 'Yoast SEO 20.0', 'wpseo_new_action' );

// Filter:
\apply_filters_deprecated( 'wpseo_filter', [ $value, $extra_arg ], 'Yoast SEO 20.0', 'wpseo_new_filter' );
```

Replace the existing `do_action` / `apply_filters` call with the deprecated variant; do not add a second call.

## DI container — deprecated classes

When the deprecated class was wired into the Symfony DI container, open `config/dependency-injection/deprecated-classes.php` and add an entry for it. Run `composer compile-di` afterwards (or let the post-autoload-dump hook do it on the next `composer install`).

## Yearly deprecation cleanup

Once a year, all deprecated functionality older than one year is removed. To find the cutoff:

1. Identify the plugin version released ~12 months ago.
2. Remove everything deprecated before that version.
3. In most cases no changelog entry is needed. Add one only when the removal is notable — especially for constants/methods/classes whose deprecation was not well communicated — e.g.:

> * Removes the `WEBPAGE_HASH` constant that had been deprecated in Yoast SEO 19.3 (July 2022).

## Checklist

- [ ] Searched codebase (including string searches for hook callbacks).
- [ ] Checked docs for mentions.
- [ ] Checked WPdirectory / GitHub for third-party usage.
- [ ] Checked [veloria.dev](https://veloria.dev/) for third-party usage of the class/method/hook.
- [ ] Alternative method identified (or confirmed none exists).
- [ ] `_deprecated_function()` call added with `'Yoast SEO X.Y'` prefix.
- [ ] `@deprecated X.Y` and `@codeCoverageIgnore` added to PHPDoc (method **and** class if deprecating the whole class).
- [ ] File moved to `src/deprecated/` (for DI-registered or surface-exposed classes).
- [ ] `config/dependency-injection/deprecated-classes.php` updated if applicable.
- [ ] `composer compile-di` run if DI config changed.
- [ ] `composer check-branch-cs` passes.
- [ ] `composer test` passes.
