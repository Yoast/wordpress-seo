<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Cache\WooCommerce_Product_Type_Change_Listener_Integration;

use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

/**
 * Test class for the get_conditionals method.
 *
 * @group schema-aggregator
 * @group WooCommerce_Product_Type_Change_Listener_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache\WooCommerce_Product_Type_Change_Listener_Integration::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class WooCommerce_Product_Type_Change_Listener_Integration_Get_Conditionals_Test extends Abstract_WooCommerce_Product_Type_Change_Listener_Integration_TestCase {

	/**
	 * Tests that get_conditionals returns the expected conditionals.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$actual = $this->instance->get_conditionals();

		$this->assertIsArray( $actual );
		$this->assertContains( Schema_Aggregator_Conditional::class, $actual );
		$this->assertContains( WooCommerce_Conditional::class, $actual );
	}
}
