<?php

namespace Yoast\WP\SEO\Tests\WP;

use Yoast\WP\SEO\Initializers\Migration_Runner;
use Yoast\WPTestUtils\WPIntegration\TestCase as WPTestUtils_TestCase;

/**
 * TestCase base class for convenience methods.
 */
abstract class TestCase extends WPTestUtils_TestCase {

	/**
	 * Make sure to do migrations before WP_UnitTestCase starts messing with the DB.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Run migrations.
		$migration_runner = \YoastSEO()->classes->get( Migration_Runner::class );
		$migration_runner->run_migrations( 'free' );
	}
}
