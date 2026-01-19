<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces\Woo_Schema_Piece_Repository;

use Brain\Monkey\Functions;

/**
 * Test class for the collect method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Woo_Schema_Piece_Repository::collect
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Woo_Schema_Piece_Repository_Collect_Test extends Abstract_Woo_Schema_Piece_Repository_Test {

	/**
	 * Tests that collect returns empty array when WooCommerce is not active.
	 *
	 * @return void
	 */
	public function test_collect_returns_empty_array_when_woocommerce_not_active() {
		$this->woocommerce_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( false );

		$result = $this->instance->collect( 123 );

		$this->assertSame( [], $result );
	}

	/**
	 * Tests that collect returns empty array when product is not found.
	 *
	 * @return void
	 */
	public function test_collect_returns_empty_array_when_product_not_found() {
		$this->woocommerce_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		Functions\expect( 'wc_get_product' )
			->once()
			->with( 123 )
			->andReturn( false );

		$result = $this->instance->collect( 123 );

		$this->assertSame( [], $result );
	}

	/**
	 * Tests that collect returns empty array when product is null.
	 *
	 * @return void
	 */
	public function test_collect_returns_empty_array_when_product_is_null() {
		$this->woocommerce_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		Functions\expect( 'wc_get_product' )
			->once()
			->with( 123 )
			->andReturn( null );

		$result = $this->instance->collect( 123 );

		$this->assertSame( [], $result );
	}
}
