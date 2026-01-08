<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Cache\WooCommerce_Product_Type_Change_Listener_Integration;

use Generator;
use Mockery;

/**
 * Test class for the reset_cache method.
 *
 * @group WooCommerce_Product_Type_Change_Listener_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache\WooCommerce_Product_Type_Change_Listener_Integration::reset_cache
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class WooCommerce_Product_Type_Change_Listener_Integration_Reset_Cache_Test extends Abstract_WooCommerce_Product_Type_Change_Listener_Integration_TestCase {

	/**
	 * Data provider for product ID is empty scenarios.
	 *
	 * @return Generator
	 */
	public function product_id_is_empty_provider() {
		yield 'product ID is 0' => [
			'product_id' => 0,
		];

		yield 'product ID is null' => [
			'product_id' => null,
		];

		yield 'product ID is false' => [
			'product_id' => false,
		];
	}

	/**
	 * Tests that reset_cache returns false when product ID is empty.
	 *
	 * @dataProvider product_id_is_empty_provider
	 *
	 * @param mixed $product_id The product ID.
	 *
	 * @return void
	 */
	public function test_reset_cache_returns_false_when_product_id_is_empty( $product_id ) {
		$product = Mockery::mock( 'WC_Product' );
		$product->shouldReceive( 'get_id' )
			->once()
			->andReturn( $product_id );

		$this->indexable_repository->shouldNotReceive( 'find_by_id_and_type' );
		$this->manager->shouldNotReceive( 'invalidate_all' );
		$this->manager->shouldNotReceive( 'invalidate' );
		$this->xml_manager->shouldNotReceive( 'invalidate' );

		$result = $this->instance->reset_cache( $product );

		$this->assertFalse( $result );
	}

	/**
	 * Tests that reset_cache invalidates all when indexable is not found.
	 *
	 * @return void
	 */
	public function test_reset_cache_invalidates_all_when_indexable_not_found() {
		$product = Mockery::mock( 'WC_Product' );
		$product->shouldReceive( 'get_id' )
			->once()
			->andReturn( 123 );

		$this->indexable_repository->shouldReceive( 'find_by_id_and_type' )
			->with( 123, 'post' )
			->once()
			->andReturn( null );

		$this->manager->shouldReceive( 'invalidate_all' )->once();
		$this->xml_manager->shouldReceive( 'invalidate' )->once();

		$result = $this->instance->reset_cache( $product );

		$this->assertFalse( $result );
	}

	/**
	 * Data provider for indexable found scenarios.
	 *
	 * @return Generator
	 */
	public function indexable_found_provider() {
		yield 'first page' => [
			'product_id'    => 123,
			'count_before'  => 5,
			'per_page'      => 10,
			'expected_page' => 1,
		];

		yield 'second page' => [
			'product_id'    => 456,
			'count_before'  => 15,
			'per_page'      => 10,
			'expected_page' => 2,
		];

		yield 'third page with custom per_page' => [
			'product_id'    => 789,
			'count_before'  => 40,
			'per_page'      => 20,
			'expected_page' => 3,
		];
	}

	/**
	 * Tests that reset_cache invalidates specific cache when indexable is found.
	 *
	 * @dataProvider indexable_found_provider
	 *
	 * @param int $product_id    The product ID.
	 * @param int $count_before  The count of items before this product.
	 * @param int $per_page      Items per page.
	 * @param int $expected_page The expected page number.
	 *
	 * @return void
	 */
	public function test_reset_cache_invalidates_specific_when_indexable_found( $product_id, $count_before, $per_page, $expected_page ) {
		$product = Mockery::mock( 'WC_Product' );
		$product->shouldReceive( 'get_id' )
			->once()
			->andReturn( $product_id );

		$indexable = (object) [
			'id'              => $product_id,
			'object_sub_type' => 'product',
		];

		$this->indexable_repository->shouldReceive( 'find_by_id_and_type' )
			->with( $product_id, 'post' )
			->once()
			->andReturn( $indexable );

		// Mock the repository query chain for get_page_number.
		$query_mock = Mockery::mock();
		$query_mock->shouldReceive( 'where_raw' )
			->with( '( is_public IS NULL OR is_public = 1 )' )
			->once()
			->andReturnSelf();
		$query_mock->shouldReceive( 'where' )
			->with( 'object_sub_type', 'product' )
			->once()
			->andReturnSelf();
		$query_mock->shouldReceive( 'where' )
			->with( 'post_status', 'publish' )
			->once()
			->andReturnSelf();
		$query_mock->shouldReceive( 'where_lt' )
			->with( 'id', $product_id )
			->once()
			->andReturnSelf();
		$query_mock->shouldReceive( 'count' )
			->once()
			->andReturn( $count_before );

		$this->indexable_repository->shouldReceive( 'query' )
			->once()
			->andReturn( $query_mock );

		$this->config->shouldReceive( 'get_per_page' )
			->with( 'product' )
			->once()
			->andReturn( $per_page );

		$this->manager->shouldReceive( 'invalidate' )
			->with( 'product', $expected_page )
			->once();
		$this->xml_manager->shouldReceive( 'invalidate' )->once();

		$result = $this->instance->reset_cache( $product );

		$this->assertTrue( $result );
	}
}
