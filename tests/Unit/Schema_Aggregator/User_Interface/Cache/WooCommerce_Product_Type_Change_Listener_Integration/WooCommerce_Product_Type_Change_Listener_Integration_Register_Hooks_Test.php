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
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class WooCommerce_Product_Type_Change_Listener_Integration_Register_Hooks_Test extends Abstract_WooCommerce_Product_Type_Change_Listener_Integration_TestCase {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			Monkey\Actions\has( 'woocommerce_product_type_changed', [ $this->instance, 'reset_cache' ] )
		);
	}
}
