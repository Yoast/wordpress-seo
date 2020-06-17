<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Mocks
 */

namespace Yoast\WP\SEO\Tests\Doubles\Database;

use Exception;
use Yoast\WP\Lib\Migrations\Migration;

/**
 * Class Meta_Tags_Context_Mock
 */
class Migration_Double extends Migration {

	/**
	 * Whether or not this migration was run.
	 *
	 * @var boolean
	 */
	public static $was_run = false;

	/**
	 * Whether or not this migration should give an error.
	 *
	 * @var boolean
	 */
	public static $should_error = false;

	/**
	 * Migration up.
	 */
	public function up() {
		if ( self::$should_error ) {
			throw new Exception( 'Migration error' );
		}

		self::$was_run = true;
	}

	/**
	 * Migration down.
	 */
	public function down() {
		// Nothing to do.
	}
}
