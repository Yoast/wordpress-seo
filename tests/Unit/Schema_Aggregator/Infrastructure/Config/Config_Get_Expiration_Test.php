<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Config;

use Brain\Monkey\Functions;
use Generator;
use Mockery;

/**
 * Test class for the get_expiration method.
 *
 * @group Config
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config::get_expiration
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Config_Get_Expiration_Test extends Abstract_Config_Test {

	/**
	 * Tests getting cache expiration based on data size.
	 *
	 * @dataProvider get_expiration_data
	 *
	 * @param array<string> $data         The data to cache.
	 * @param mixed         $filtered_ttl The value returned by the filter.
	 * @param int           $expected     The expected result.
	 *
	 * @return void
	 */
	public function test_get_expiration( $data, $filtered_ttl, $expected ) {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_schema_aggregator_cache_ttl', Mockery::type( 'int' ) )
			->andReturn( $filtered_ttl );

		$this->assertEquals( $expected, $this->instance->get_expiration( $data ) );
	}

	/**
	 * Data provider for the get_expiration test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_expiration_data() {
		yield 'Small data (< 100KB) - shorter cache' => [
			'data'         => self::generate_array_of_size( 50000 ),
			'filtered_ttl' => 1800,
			'expected'     => 1800,
		];

		yield 'Medium data (100KB - 1MB) - default cache' => [
			'data'         => self::generate_array_of_size( 500000 ),
			'filtered_ttl' => 3600,
			'expected'     => 3600,
		];

		yield 'Large data (> 1MB) - longer cache' => [
			'data'         => self::generate_array_of_size( 1100000 ),
			'filtered_ttl' => 21600,
			'expected'     => 21600,
		];

		yield 'Filter returns invalid (zero) - falls back to default' => [
			'data'         => self::generate_array_of_size( 500000 ),
			'filtered_ttl' => 0,
			'expected'     => 3600,
		];

		yield 'Filter returns invalid (negative) - falls back to default' => [
			'data'         => self::generate_array_of_size( 500000 ),
			'filtered_ttl' => -100,
			'expected'     => 3600,
		];

		yield 'Filter returns non-integer (string) - falls back to default' => [
			'data'         => self::generate_array_of_size( 500000 ),
			'filtered_ttl' => 'invalid',
			'expected'     => 3600,
		];

		yield 'Filter returns valid positive integer' => [
			'data'         => self::generate_array_of_size( 50000 ),
			'filtered_ttl' => 7200,
			'expected'     => 7200,
		];

		yield 'Empty array - small data cache' => [
			'data'         => [],
			'filtered_ttl' => 1800,
			'expected'     => 1800,
		];

		yield 'Data just below small boundary' => [
			'data'         => self::generate_array_of_size( 102399 ),
			'filtered_ttl' => 1800,
			'expected'     => 1800,
		];

		yield 'Data at small boundary (102400 bytes) - uses default' => [
			'data'         => self::generate_array_of_size( 102400 ),
			'filtered_ttl' => 3600,
			'expected'     => 3600,
		];

		yield 'Data just above small boundary' => [
			'data'         => self::generate_array_of_size( 102401 ),
			'filtered_ttl' => 3600,
			'expected'     => 3600,
		];

		yield 'Data just below large boundary' => [
			'data'         => self::generate_array_of_size( 1048575 ),
			'filtered_ttl' => 3600,
			'expected'     => 3600,
		];

		yield 'Data just above large boundary (1048577 bytes) - uses large cache' => [
			'data'         => self::generate_array_of_size( 1048577 ),
			'filtered_ttl' => 21600,
			'expected'     => 21600,
		];
	}

	/**
	 * Helper method to generate an array of approximately the specified serialized size.
	 *
	 * @param int $target_bytes The target size in bytes.
	 *
	 * @return array<string> An array with approximately the specified serialized size.
	 */
	private static function generate_array_of_size( $target_bytes ) {
		$data = [];
		$key  = 0;
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize -- This is just a test.
		$length = \strlen( \serialize( $data ) );
		while ( $length < $target_bytes ) {
			$data[ 'key_' . $key ] = \str_repeat( 'x', 100 );
			++$key;
		}

		return $data;
	}
}
