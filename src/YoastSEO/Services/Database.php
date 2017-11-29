<?php

namespace Yoast\YoastSEO\Services;

use Model;
use ORM;
use Symfony\Component\Console\Output\NullOutput;
use Yoast\WordPress\Integration;
use Yoast\YoastSEO\Fake_Input;
use Yoast\YoastSEO\MigrateCommand;

class Database implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 * @throws \Exception
	 */
	public function register_hooks() {
		ORM::configure( 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME );
		ORM::configure( 'username', DB_USER );
		ORM::configure( 'password', DB_PASSWORD );

		Model::$auto_prefix_models = '\\Yoast\\YoastSEO\\Models\\';

		$this->migrate();
	}

	/**
	 * Executes pending migrations.
	 */
	protected function migrate() {
		try {
			$input = new Fake_Input();
			$input->setArgument( 'command', 'migrate' );

			$migrate = new MigrateCommand();
			$migrate->run( $input, new NullOutput() );
		} catch ( \Exception $exception ) {
//			 @todo: Handle exception.
		}
	}
}
