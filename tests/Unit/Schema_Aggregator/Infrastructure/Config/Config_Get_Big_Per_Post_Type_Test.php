<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Config;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class for the get_big_per_post_type method.
 *
 * @group schema-aggregator
 * @group Config
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config::get_big_per_post_type
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Config_Get_Big_Per_Post_Type_Test extends Abstract_Config_Test {

	/**
	 * Tests getting per page count for post types with lots of schema.
	 *
	 * @dataProvider get_big_per_post_type_data
	 *
	 * @param mixed $filtered_value The value returned by the filter.
	 * @param int   $expected       The expected result.
	 *
	 * @return void
	 */
	public function test_get_big_per_post_type( $filtered_value, $expected ) {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_schema_aggregator_per_page_big', 100 )
			->andReturn( $filtered_value );

		$this->assertEquals( $expected, $this->instance->get_big_per_post_type() );
	}

	/**
	 * Data provider for the get_big_per_post_type test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_big_per_post_type_data() {
		yield 'Default value 100' => [
			'filtered_value' => 100,
			'expected'       => 100,
		];

		yield 'Filter returns valid positive integer' => [
			'filtered_value' => 50,
			'expected'       => 50,
		];

		yield 'Filter returns larger valid integer' => [
			'filtered_value' => 200,
			'expected'       => 200,
		];

		yield 'Filter returns zero - falls back to default' => [
			'filtered_value' => 0,
			'expected'       => 100,
		];

		yield 'Filter returns negative - falls back to default' => [
			'filtered_value' => -50,
			'expected'       => 100,
		];

		yield 'Filter returns string number - casts to int' => [
			'filtered_value' => '150',
			'expected'       => 150,
		];

		yield 'Filter returns non-numeric string - casts to zero, falls back to default' => [
			'filtered_value' => 'invalid',
			'expected'       => 100,
		];

		yield 'Filter returns float - casts to int' => [
			'filtered_value' => 75.5,
			'expected'       => 75,
		];

		yield 'Filter returns 1 - minimum valid value' => [
			'filtered_value' => 1,
			'expected'       => 1,
		];

		yield 'Filter returns large number over max - not capped here' => [
			'filtered_value' => 2000,
			'expected'       => 2000,
		];
	}
}
