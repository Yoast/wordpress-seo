<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Elements_Context_Map_Repository;

/**
 * Tests for the Elements_Context_Map_Repository::get_map method.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Elements_Context_Map_Repository::get_map
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Map_Test extends Abstract_Elements_Context_Map_Repository_Test {

	/**
	 * Tests that get_map loads the map from the loader on first call.
	 *
	 * @return void
	 */
	public function test_get_map_loads_from_loader() {
		$expected_map = [
			[
				'element' => 'WebPage',
				'context' => 'ItemPage',
			],
			[
				'element' => 'Product',
				'context' => 'Product',
			],
		];

		$this->map_loader
			->expects( 'load' )
			->once()
			->andReturn( $expected_map );

		$result = $this->instance->get_map();

		$this->assertSame( $expected_map, $result );
	}

	/**
	 * Tests that get_map caches the result and does not call the loader again.
	 *
	 * @return void
	 */
	public function test_get_map_caches_result() {
		$expected_map = [
			[
				'element' => 'WebPage',
				'context' => 'ItemPage',
			],
		];

		$this->map_loader
			->expects( 'load' )
			->once()
			->andReturn( $expected_map );

		$first_call  = $this->instance->get_map();
		$second_call = $this->instance->get_map();

		$this->assertSame( $expected_map, $first_call );
		$this->assertSame( $expected_map, $second_call );
	}

	/**
	 * Tests that get_map returns an empty array when the loader returns one.
	 *
	 * @return void
	 */
	public function test_get_map_returns_empty_array() {
		$this->map_loader
			->expects( 'load' )
			->once()
			->andReturn( [] );

		$result = $this->instance->get_map();

		$this->assertSame( [], $result );
	}
}
