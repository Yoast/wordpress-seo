<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Cache\Indexables_Update_Listener_Integration;

use Brain\Monkey;

/**
 * Test class for the register_hooks method.
 *
 * @group Indexables_Update_Listener_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache\Indexables_Update_Listener_Integration::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Indexables_Update_Listener_Integration_Register_Hooks_Test extends Abstract_Indexables_Update_Listener_Integration_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			Monkey\Actions\has( 'wpseo_save_indexable', [ $this->instance, 'reset_cache' ] )
		);
	}
}
