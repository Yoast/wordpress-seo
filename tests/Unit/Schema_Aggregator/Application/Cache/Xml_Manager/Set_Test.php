<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Cache\Xml_Manager;

use Brain\Monkey;
use Exception;
use Generator;

/**
 * Tests the Xml_Manager set method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager::set
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager::get_cache_key
 */
final class Set_Test extends Abstract_Xml_Manager_Test {

	/**
	 * Tests set() caches data successfully.
	 *
	 * @return void
	 */
	public function test_set_caches_data_successfully() {
		$data       = '<?xml version="1.0"?><root><item>test</item></root>';
		$expiration = 3600;

		$this->config->expects( 'get_expiration' )
			->once()
			->with( [ $data ] )
			->andReturn( $expiration );

		Monkey\Functions\expect( 'set_transient' )
			->once()
			->with( 'yoast_schema_aggregator_xml_sitemap_v1', $data, $expiration )
			->andReturn( true );

		$result = $this->instance->set( $data );

		$this->assertTrue( $result );
	}

	/**
	 * Tests set() returns false when set_transient fails.
	 *
	 * @return void
	 */
	public function test_set_returns_false_when_transient_fails() {
		$data       = '<xml>test</xml>';
		$expiration = 3600;

		$this->config->expects( 'get_expiration' )
			->once()
			->with( [ $data ] )
			->andReturn( $expiration );

		Monkey\Functions\expect( 'set_transient' )
			->once()
			->with( 'yoast_schema_aggregator_xml_sitemap_v1', $data, $expiration )
			->andReturn( false );

		$result = $this->instance->set( $data );

		$this->assertFalse( $result );
	}

	/**
	 * Tests set() with various XML data and expiration times.
	 *
	 * @param string $data       The XML data to cache.
	 * @param int    $expiration The expiration time in seconds.
	 * @param bool   $expected   The expected return value.
	 *
	 * @dataProvider set_data_provider
	 *
	 * @return void
	 */
	public function test_set_with_various_data( $data, $expiration, $expected ) {
		$this->config->expects( 'get_expiration' )
			->once()
			->with( [ $data ] )
			->andReturn( $expiration );

		Monkey\Functions\expect( 'set_transient' )
			->once()
			->with( 'yoast_schema_aggregator_xml_sitemap_v1', $data, $expiration )
			->andReturn( $expected );

		$result = $this->instance->set( $data );

		$this->assertSame( $expected, $result );
	}

	/**
	 * Data provider for set() with various data and parameters.
	 *
	 * @return Generator
	 */
	public static function set_data_provider() {
		yield 'Small XML, short expiration' => [
			'data'       => '<xml>test</xml>',
			'expiration' => 1800,
			'expected'   => true,
		];
		yield 'Large XML, long expiration' => [
			'data'       => \str_repeat( '<item>large content here</item>', 500 ),
			'expiration' => 21600,
			'expected'   => true,
		];
		yield 'Empty string' => [
			'data'       => '',
			'expiration' => 3600,
			'expected'   => true,
		];
		yield 'XML with special characters' => [
			'data'       => '<root><item attr="value &amp; more">Data &lt; &gt;</item></root>',
			'expiration' => 3600,
			'expected'   => true,
		];
	}

	/**
	 * Tests set() handles exceptions gracefully.
	 *
	 * @return void
	 */
	public function test_set_handles_exception_gracefully() {
		$data = '<xml>test</xml>';

		$this->config->expects( 'get_expiration' )
			->once()
			->with( [ $data ] )
			->andThrow( new Exception( 'Test exception' ) );

		$result = $this->instance->set( $data );

		$this->assertFalse( $result );
	}
}
