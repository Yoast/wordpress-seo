<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Cache\Indexables_Update_Listener_Integration;

use Generator;
use Mockery;

/**
 * Test class for the reset_cache method.
 *
 * @group Indexables_Update_Listener_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache\Indexables_Update_Listener_Integration::reset_cache
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Indexables_Update_Listener_Integration_Reset_Cache_Test extends Abstract_Indexables_Update_Listener_Integration_Test {

	/**
	 * Data provider for permalink is null scenarios.
	 *
	 * @return Generator
	 */
	public function permalink_is_null_provider() {
		$indexable_before = (object) [
			'permalink'       => null,
			'object_sub_type' => null,
		];
		$indexable        = (object) [
			'permalink'       => 'https://example.com/test',
			'object_sub_type' => null,
		];

		yield 'permalink is null with no object_sub_type' => [
			'indexable'        => $indexable,
			'indexable_before' => $indexable_before,
		];

		$indexable_before2 = (object) [
			'permalink'       => null,
			'object_sub_type' => 'post',
		];
		$indexable2        = (object) [
			'permalink'       => 'https://example.com/post',
			'object_sub_type' => 'post',
		];

		yield 'permalink is null with object_sub_type' => [
			'indexable'        => $indexable2,
			'indexable_before' => $indexable_before2,
		];
	}

	/**
	 * Tests that reset_cache invalidates all caches when permalink is null.
	 *
	 * @dataProvider permalink_is_null_provider
	 *
	 * @param object $indexable        The indexable object.
	 * @param object $indexable_before The indexable before the update.
	 *
	 * @return void
	 */
	public function test_reset_cache_invalidates_all_when_permalink_is_null( $indexable, $indexable_before ) {
		$this->manager->shouldReceive( 'invalidate_all' )->once();
		$this->xml_manager->shouldReceive( 'invalidate' )->once();

		$result = $this->instance->reset_cache( $indexable, $indexable_before );

		$this->assertFalse( $result );
	}

	/**
	 * Data provider for object_sub_type is not null scenarios.
	 *
	 * @return Generator
	 */
	public function object_sub_type_provider() {
		yield 'post type' => [
			'object_sub_type' => 'post',
			'indexable_id'    => 123,
			'count_before'    => 5,
			'per_page'        => 10,
			'expected_page'   => 1,
		];

		yield 'page type' => [
			'object_sub_type' => 'page',
			'indexable_id'    => 456,
			'count_before'    => 15,
			'per_page'        => 10,
			'expected_page'   => 2,
		];

		yield 'custom post type' => [
			'object_sub_type' => 'product',
			'indexable_id'    => 789,
			'count_before'    => 25,
			'per_page'        => 20,
			'expected_page'   => 2,
		];
	}

	/**
	 * Tests that reset_cache invalidates specific cache when object_sub_type is not null.
	 *
	 * @dataProvider object_sub_type_provider
	 *
	 * @param string $object_sub_type The object sub type.
	 * @param int    $indexable_id    The indexable ID.
	 * @param int    $count_before    The count of items before this indexable.
	 * @param int    $per_page        Items per page.
	 * @param int    $expected_page   The expected page number.
	 *
	 * @return void
	 */
	public function test_reset_cache_invalidates_specific_when_object_sub_type_is_not_null( $object_sub_type, $indexable_id, $count_before, $per_page, $expected_page ) {
		$indexable_before = (object) [
			'permalink'       => 'https://example.com/test',
			'object_sub_type' => $object_sub_type,
		];
		$indexable        = (object) [
			'permalink'       => 'https://example.com/test',
			'object_sub_type' => $object_sub_type,
			'id'              => $indexable_id,
		];

		// Mock the repository query chain for get_page_number.
		$query_mock = Mockery::mock();
		$query_mock->shouldReceive( 'where_raw' )
			->with( '( is_public IS NULL OR is_public = 1 )' )
			->once()
			->andReturnSelf();
		$query_mock->shouldReceive( 'where' )
			->with( 'object_sub_type', $object_sub_type )
			->once()
			->andReturnSelf();
		$query_mock->shouldReceive( 'where' )
			->with( 'post_status', 'publish' )
			->once()
			->andReturnSelf();
		$query_mock->shouldReceive( 'where_lt' )
			->with( 'id', $indexable_id )
			->once()
			->andReturnSelf();
		$query_mock->shouldReceive( 'count' )
			->once()
			->andReturn( $count_before );

		$this->indexable_repository->shouldReceive( 'query' )
			->once()
			->andReturn( $query_mock );

		$this->config->shouldReceive( 'get_per_page' )
			->with( $object_sub_type )
			->once()
			->andReturn( $per_page );

		$this->manager->shouldReceive( 'invalidate' )
			->with( $object_sub_type, $expected_page )
			->once();
		$this->xml_manager->shouldReceive( 'invalidate' )->once();

		$result = $this->instance->reset_cache( $indexable, $indexable_before );

		$this->assertTrue( $result );
	}

	/**
	 * Tests that reset_cache returns true when no conditions are met.
	 *
	 * @return void
	 */
	public function test_reset_cache_returns_true_when_no_conditions_met() {
		$indexable_before = (object) [
			'permalink'       => 'https://example.com/test',
			'object_sub_type' => null,
		];
		$indexable        = (object) [
			'permalink'       => 'https://example.com/test',
			'object_sub_type' => null,
		];

		$this->manager->shouldNotReceive( 'invalidate_all' );
		$this->manager->shouldNotReceive( 'invalidate' );
		$this->xml_manager->shouldNotReceive( 'invalidate' );

		$result = $this->instance->reset_cache( $indexable, $indexable_before );

		$this->assertTrue( $result );
	}
}
