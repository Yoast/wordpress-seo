<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Framework
 */

use Yoast\WP\SEO\Initializers\Migration_Runner;
use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * TestCase base class for convenience methods.
 */
abstract class WPSEO_UnitTestCase extends TestCase {

	use Yoast_SEO_ReflectionToString_Deprecation_Handler;

	/**
	 * Make sure to do migrations before WP_UnitTestCase starts messing with the DB.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Run migrations.
		$migration_runner = YoastSEO()->classes->get( Migration_Runner::class );
		$migration_runner->run_migrations( 'free' );
	}
}
