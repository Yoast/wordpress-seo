<?php

namespace Yoast\YoastSEO\Services;

use ORM;
use Model;
use Yoast\WordPress\Integration;

class Idiorm_Database implements Integration {

	/** @var Migration Migration Service */
	protected $migration;

	public function __construct( Migration $migration ) {
		$this->migration = $migration;
	}

	/**
	 * Registers all hooks to WordPress.
	 * @throws \Exception
	 */
	public function register_hooks() {
		ORM::configure( 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME );
		ORM::configure( 'username', DB_USER );
		ORM::configure( 'password', DB_PASSWORD );

		Model::$auto_prefix_models = '\\Yoast\\YoastSEO\\Models\\';

		$this->migration->migrate();
	}
}
