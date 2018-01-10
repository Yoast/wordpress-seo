<?php

\date_default_timezone_set('UTC');
//----------------------------
// DATABASE CONFIGURATION
//----------------------------
/*
Valid types (adapters) are Postgres & MySQL:
'type' must be one of: 'pgsql' or 'mysql' or 'sqlite'
*/
return array('db' => array('development' => array('type' => 'mysql', 'host' => 'localhost', 'port' => 3306, 'database' => 'ruckusing_migrations', 'user' => 'root', 'password' => ''), 'pg_test' => array('type' => 'pgsql', 'host' => 'localhost', 'port' => 5432, 'database' => 'ruckusing_migrations_test', 'user' => 'postgres', 'password' => ''), 'mysql_test' => array('type' => 'mysql', 'host' => 'localhost', 'port' => 3306, 'database' => 'ruckusing_migrations_test', 'user' => 'root', 'password' => ''), 'sqlite_test' => array('type' => 'sqlite', 'database' => \YOASTSEO_VENDOR__RUCKUSING_WORKING_BASE . '/test.sqlite3', 'host' => 'localhost', 'port' => '', 'user' => '', 'password' => '')), 'migrations_dir' => array('default' => \YOASTSEO_VENDOR__RUCKUSING_WORKING_BASE . '/migrations'), 'db_dir' => \YOASTSEO_VENDOR__RUCKUSING_WORKING_BASE . \DIRECTORY_SEPARATOR . 'db', 'log_dir' => \YOASTSEO_VENDOR__RUCKUSING_WORKING_BASE . \DIRECTORY_SEPARATOR . 'logs', 'ruckusing_base' => \dirname(__FILE__) . \DIRECTORY_SEPARATOR . '..');
