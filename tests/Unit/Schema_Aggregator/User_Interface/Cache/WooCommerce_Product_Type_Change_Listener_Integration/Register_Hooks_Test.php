<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Cache\WooCommerce_Product_Type_Change_Listener_Integration;

use Brain\Monkey;

/**
 * Test class for the register_hooks method.
 *
 * @group schema-aggregator
 * @group WooCommerce_Product_Type_Change_Listener_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache\WooCommerce_Product_Type_Change_Listener_Integration::register_hooks
 */
final class Register_Hooks_Test extends Abstract_TestCase {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			Monkey\Actions\has( 'woocommerce_product_type_changed', [ $this->instance, 'reset_cache' ] ),
		);
	}
}
