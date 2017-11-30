## Todo

## Tests
Add tests
- Watchers
    - post
    - term
    - user
- Services
    - indexable

## Terms
- wpseo_sitemap_include
- focus keyword(s)
- internal link count
- incoming link count

## Posts
- focus keyword(s)


### prefix modules
* j4mie/paris
* j4mie/idiorm


* pimple/pimple
* davedevelopment/phpmig
  * "symfony/console"
  * "symfony/config"

**Possible solutions to avoid having to rewrite:**

Create own dependency container to replace `pimple` - Fairly simple

Use another php database migration method instead of `phpmig` - Need an alternative.

The current migration script is decoupled from the actual classes, using some other framework or method is very feasible.

**Hacks implemented to make things work:**
- [Fake_Input](https://github.com/Yoast/wordpress-seo/blob/yoast-meta/src/Fake_Input.php#L9) to pretend we are executing a console command to migrate
- [MigrateCommand](https://github.com/Yoast/wordpress-seo/blob/yoast-meta/src/MigrateCommand.php#L9) to load the ORM database configuration directly instead of via `phpmig.php` configuration file
- [Yoast_Model](https://github.com/Yoast/wordpress-seo/blob/yoast-meta/src/Yoast_Model.php#L7) to inject WordPress database table prefix the table names


- Final todo: Remove this file from the repository.
