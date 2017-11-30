<?php

namespace Yoast\YoastSEO\Database\Config;

use Model;
use ORM;
use Yoast\WordPress\Integration;

class Database implements Integration {
	/**
	 * Registers all hooks to WordPress.
	 * @throws \Exception
	 */
	public function initialize() {
		ORM::configure( 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME );
		ORM::configure( 'username', DB_USER );
		ORM::configure( 'password', DB_PASSWORD );

		Model::$auto_prefix_models = '\\Yoast\\YoastSEO\\Database\\Models\\';
	}
}
