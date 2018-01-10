Configuration
=============

Setup
~~~~~

Paris requires `Idiorm`_. Install Idiorm and Paris somewhere in your
project directory, and ``require`` both.

.. code-block:: php

    <?php
    require_once 'your/path/to/idiorm.php';
    require_once 'your/path/to/paris.php';

Then, you need to tell Idiorm how to connect to your database. **For
full details of how to do this, see `Idiorm's documentation`_.**

Briefly, you need to pass a *Data Source Name* connection string to the
``configure`` method of the ORM class.

.. code-block:: php

    <?php
    ORM::configure('sqlite:./example.db');

You may also need to pass a username and password to your database
driver, using the ``username`` and ``password`` configuration options.
For example, if you are using MySQL:

.. code-block:: php

    <?php
    ORM::configure('mysql:host=localhost;dbname=my_database');
    ORM::configure('username', 'database_user');
    ORM::configure('password', 'top_secret');

Model prefixing
~~~~~~~~~~~~~~~

Setting: ``Model::$auto_prefix_models``

To save having type out model class name prefixes whenever code utilises ``Model::for_table()``
it is possible to specify a prefix that will be prepended onto the class name.

The model prefix is treated the same way as any other class name when Paris
attempts to convert it to a table name. This is documented in the :doc:`Models`
section of the documentation.

Here is a namespaced example to make it clearer:

.. code-block:: php

    <?php
    Model::$auto_prefix_models = '\\Tests\\';
    Model::factory('Simple')->find_many(); // SQL executed: SELECT * FROM `tests_simple`
    Model::factory('SimpleUser')->find_many(); // SQL executed: SELECT * FROM `tests_simple_user`

Model prefixes are only compatible with the ``Model::factory()`` methods described above.
Where the shorter ``SimpleUser::find_many()`` style syntax is used, the addition of a
Model prefix will cause ``Class not found`` errors.

.. note::

    Model class property ``$_table`` sets an explicit table name, ignoring the
    ``$auto_prefix_models`` property in your individual model classes. See documentation in
    the :doc:`Models` section of the documentation.

Model prefixing
~~~~~~~~~~~~~~~

Setting: ``Model::$short_table_names``

Set as ``true`` to disregard namespace information when computing table names
from class names.

By default the class ``\Models\CarTyre`` expects the table name ``models_car_tyre``.
With ``Model::$short_table_names = true`` the class ``\Models\CarTyre`` expects the
table name ``car_tyre``.

.. code-block:: php

    <?php

    Model::$short_table_names = true;
    Model::factory('CarTyre')->find_many(); // SQL executed: SELECT * FROM `car_tyre`

    namespace Models {
        class CarTyre extends Model {

        }
    }

Further Configuration
~~~~~~~~~~~~~~~~~~~~~

The only other configuration options provided by Paris itself are the
``$_table`` and ``$_id_column`` static properties on model classes. To
configure the database connection, you should use Idiorm’s configuration
system via the ``ORM::configure`` method.

If you are using multiple connections, the optional `$_connection_key` static property may also be used to provide a default string key indicating which database connection in `ORM` should be used.

**See `Idiorm's documentation`_ for full details.**

Query logging
~~~~~~~~~~~~~

Idiorm can log all queries it executes. To enable query logging, set the
``logging`` option to ``true`` (it is ``false`` by default).

.. code-block:: php

    <?php
    ORM::configure('logging', true);

When query logging is enabled, you can use two static methods to access
the log. ``ORM::get_last_query()`` returns the most recent query
executed. ``ORM::get_query_log()`` returns an array of all queries
executed.

.. _Idiorm's documentation: http://github.com/j4mie/idiorm/
.. _Idiorm: http://github.com/j4mie/idiorm/
