<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Config;

use Brain\Monkey\Functions;
use Generator;
use stdClass;

/**
 * Test class for the cache_enabled method.
 *
 * @group schema-aggregator
 * @group Config
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config::cache_enabled
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Config_Cache_Enabled_Test extends Abstract_Config_Test {

	/**
	 * Tests checking if caching is enabled.
	 *
	 * @dataProvider cache_enabled_data
	 *
	 * @param mixed $filtered_value The value returned by the filter.
	 * @param bool  $expected       The expected result.
	 *
	 * @return void
	 */
	public function test_cache_enabled( $filtered_value, $expected ) {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_schema_aggregator_cache_enabled', true )
			->andReturn( $filtered_value );

		$this->assertEquals( $expected, $this->instance->cache_enabled() );
	}

	/**
	 * Data provider for the cache_enabled test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function cache_enabled_data() {
		yield 'Default true - cache enabled' => [
			'filtered_value' => true,
			'expected'       => true,
		];

		yield 'Filter returns false - cache disabled' => [
			'filtered_value' => false,
			'expected'       => false,
		];

		yield 'Filter returns non-boolean string - defaults to true' => [
			'filtered_value' => 'yes',
			'expected'       => true,
		];

		yield 'Filter returns non-boolean integer - defaults to true' => [
			'filtered_value' => 1,
			'expected'       => true,
		];

		yield 'Filter returns null - defaults to true' => [
			'filtered_value' => null,
			'expected'       => true,
		];

		yield 'Filter returns array - defaults to true' => [
			'filtered_value' => [],
			'expected'       => true,
		];

		yield 'Filter returns object - defaults to true' => [
			'filtered_value' => new stdClass(),
			'expected'       => true,
		];
	}
}
