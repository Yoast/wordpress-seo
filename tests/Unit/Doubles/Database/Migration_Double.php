<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Database;

use Exception;
use Yoast\WP\Lib\Migrations\Migration;

/**
 * Class Migration_Double.
 */
final class Migration_Double extends Migration {

	/**
	 * Whether or not this migration was run.
	 *
	 * @var bool
	 */
	public static $was_run = false;

	/**
	 * Whether or not this migration should give an error.
	 *
	 * @var bool
	 */
	public static $should_error = false;

	/**
	 * Migration up.
	 *
	 * @return void
	 *
	 * @throws Exception A migration error.
	 */
	public function up() {
		if ( self::$should_error ) {
			throw new Exception( 'Migration error' );
		}

		self::$was_run = true;
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		// Nothing to do.
	}
}
