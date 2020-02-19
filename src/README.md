# The `/src` directory

Is where all our namespaced code lives. This is where we develop the future backend of the Yoast SEO plugin. The code in here adheres to the following characteristics:
- Uses PHP 5.6 as its minimum PHP version.
- Uses namespaces.
- Uses dependency injection via Symphony Dependency Injection container.
- Is organized in concepts, creating a clearer separation of concerns.
- Is better isolated from WordPress and other dependencies and therefore easy to test.

## Directory structure

The directory structure splits the code up into different concepts. Here's a global overview:

```
src
├── builders            Builders create Indexables from legacy post metadata 
├── commands            Yoast WP-CLI commands.
├── conditionals        Conditionals determine whether an Integration should load.
├── config              Config objects for our tooling.
├── exceptions          Custom Exception objects.
├── helpers             Helpers are simple utility services which can be used across our code.
├── initializers        Initializers bootstrap the Yoast plugin / ORM.
├── integrations        Any piece of code that hooks into WordPress.
│    ├── front-end      Integrations that load only on the frontend.
│    └── watchers       Integrations that watch data mutations and do something.
├── loaders             LEGACY: loaders load dependencies. @todo load using Dependency injection.
├── loggers             PSR-3 Loggers, see https://www.php-fig.org/psr/psr-3/
├── models              Idiorm ORM models.
├── oauth               Contains an oauth client. @todo move to a separate lib or to /clients concept.
├── orm                 Contains a wrapper of Idiorm. @todo move to a separate lib or to /wrappers concept.
├── presentations       Presentations lazily and polymorphically generate data for presenters to output.
├── presenters          Presenters output Presentations. In MVVM, our presenters resemble views, where presentations resemle view models.
│    ├── debug          Debug marker Presenters
│    ├── open-graph     Open Graph Presenters.
│    └── twitter        Twitter Presenters.
├── repositories        Repositories are injectable services from which I can request ORM Model instances
├── wordpress           Contains a WordPress wrapper. @todo move to /wrappers concept.
└── wrappers            Wrappers wrap external dependencies for use within our objects.
```
