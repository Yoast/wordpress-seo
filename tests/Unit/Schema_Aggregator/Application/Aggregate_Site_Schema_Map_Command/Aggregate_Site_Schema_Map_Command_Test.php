<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command;

use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Aggregate_Site_Schema_Map_Command class.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command::__construct
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command::get_post_types
 */
final class Aggregate_Site_Schema_Map_Command_Test extends TestCase {

	/**
	 * Tests constructor stores post types correctly.
	 *
	 * @return void
	 */
	public function test_constructor_stores_post_types() {
		$post_types = [ 'post', 'page' ];
		$command    = new Aggregate_Site_Schema_Map_Command( $post_types );

		$result = $command->get_post_types();

		$this->assertSame( $post_types, $result );
	}

	/**
	 * Tests get_post_types returns array.
	 *
	 * @return void
	 */
	public function test_get_post_types_returns_array() {
		$command = new Aggregate_Site_Schema_Map_Command( [ 'post' ] );

		$result = $command->get_post_types();

		$this->assertIsArray( $result );
	}

	/**
	 * Tests constructor with empty array.
	 *
	 * @return void
	 */
	public function test_constructor_with_empty_array() {
		$command = new Aggregate_Site_Schema_Map_Command( [] );

		$result = $command->get_post_types();

		$this->assertSame( [], $result );
	}

	/**
	 * Tests constructor with various post types.
	 *
	 * @dataProvider post_types_data_provider
	 *
	 * @param array<string> $post_types The post types.
	 *
	 * @return void
	 */
	public function test_constructor_with_various_post_types( array $post_types ) {
		$command = new Aggregate_Site_Schema_Map_Command( $post_types );

		$result = $command->get_post_types();

		$this->assertSame( $post_types, $result );
	}

	/**
	 * Data provider for post types tests.
	 *
	 * @return \Generator
	 */
	public static function post_types_data_provider() {
		yield 'Single post type' => [
			'post_types' => [ 'post' ],
		];

		yield 'Multiple post types' => [
			'post_types' => [ 'post', 'page', 'product' ],
		];

		yield 'Custom post types' => [
			'post_types' => [ 'custom_type_1', 'custom_type_2' ],
		];

		yield 'Empty array' => [
			'post_types' => [],
		];
	}
}
