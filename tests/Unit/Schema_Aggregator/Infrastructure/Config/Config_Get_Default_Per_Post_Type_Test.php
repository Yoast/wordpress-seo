<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Config;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class for the get_default_per_post_type method.
 *
 * @group Config
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config::get_default_per_post_type
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Config_Get_Default_Per_Post_Type_Test extends Abstract_Config_Test {

	/**
	 * Tests getting per page count for default post types.
	 *
	 * @dataProvider get_default_per_post_type_data
	 *
	 * @param mixed $filtered_value The value returned by the filter.
	 * @param int   $expected       The expected result.
	 *
	 * @return void
	 */
	public function test_get_default_per_post_type( $filtered_value, $expected ) {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_schema_aggregator_per_page', 1000 )
			->andReturn( $filtered_value );

		$this->assertEquals( $expected, $this->instance->get_default_per_post_type() );
	}

	/**
	 * Data provider for the get_default_per_post_type test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_default_per_post_type_data() {
		yield 'Default value 1000' => [
			'filtered_value' => 1000,
			'expected'       => 1000,
		];

		yield 'Filter returns valid positive integer' => [
			'filtered_value' => 500,
			'expected'       => 500,
		];

		yield 'Filter returns larger valid integer' => [
			'filtered_value' => 1500,
			'expected'       => 1500,
		];

		yield 'Filter returns zero - falls back to default' => [
			'filtered_value' => 0,
			'expected'       => 1000,
		];

		yield 'Filter returns negative - falls back to default' => [
			'filtered_value' => -100,
			'expected'       => 1000,
		];

		yield 'Filter returns string number - casts to int' => [
			'filtered_value' => '750',
			'expected'       => 750,
		];

		yield 'Filter returns non-numeric string - casts to zero, falls back to default' => [
			'filtered_value' => 'invalid',
			'expected'       => 1000,
		];

		yield 'Filter returns float - casts to int' => [
			'filtered_value' => 999.9,
			'expected'       => 999,
		];

		yield 'Filter returns 1 - minimum valid value' => [
			'filtered_value' => 1,
			'expected'       => 1,
		];

		yield 'Filter returns large number over max - not capped here' => [
			'filtered_value' => 5000,
			'expected'       => 5000,
		];
	}
}
