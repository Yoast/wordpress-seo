<?php

namespace Yoast;

use ORM;
use Phpmig\Adapter;
use Phpmig\Console\Command\MigrateCommand;
use Pimple\Container;

class Migrate_Command extends MigrateCommand {
	/**
	 * @param string $filename
	 *
	 * @return array|string
	 */
	protected function findBootstrapFile( $filename ) {
		return '';
	}

	/**
	 * @return Container
	 */
	protected function bootstrapContainer() {
		global $wpdb;

		$container = new Container();

		$container['db'] = function() {
			return ORM::get_db();
		};

		$container['db.charset'] = $wpdb->get_charset_collate();

		$container['phpmig.adapter'] = function() use ( $container, $wpdb ) {
			return new Adapter\PDO\Sql( $container['db'], $wpdb->prefix . 'yoast_migrations' );
		};

		$container['phpmig.migrations_path'] = implode( DIRECTORY_SEPARATOR, array( WPSEO_PATH, 'migrations' ) );

		return $container;
	}
}
