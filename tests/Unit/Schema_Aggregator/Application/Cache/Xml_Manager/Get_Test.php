<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Cache\Xml_Manager;

use Brain\Monkey;
use Generator;

/**
 * Tests the Xml_Manager get method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager::get
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager::get_cache_key
 */
final class Get_Test extends Abstract_Xml_Manager_Test {

	/**
	 * Tests get() returns null when cache is disabled.
	 *
	 * @return void
	 */
	public function test_get_returns_null_when_cache_disabled() {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( false );

		$result = $this->instance->get();

		$this->assertNull( $result );
	}

	/**
	 * Tests get() returns null when transient returns false (cache miss).
	 *
	 * @return void
	 */
	public function test_get_returns_null_on_cache_miss() {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( true );

		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( 'yoast_schema_aggregator_xml_sitemap_v1' )
			->andReturn( false );

		$result = $this->instance->get();

		$this->assertNull( $result );
	}

	/**
	 * Tests get() returns null and deletes transient when data is not a string.
	 *
	 * @param mixed $corrupted_data The non-string data to test.
	 *
	 * @dataProvider corrupted_data_provider
	 *
	 * @return void
	 */
	public function test_get_returns_null_and_deletes_corrupted_cache( $corrupted_data ) {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( true );

		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( 'yoast_schema_aggregator_xml_sitemap_v1' )
			->andReturn( $corrupted_data );

		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( 'yoast_schema_aggregator_xml_sitemap_v1' )
			->andReturn( true );

		$result = $this->instance->get();

		$this->assertNull( $result );
	}

	/**
	 * Data provider for corrupted (non-string) data.
	 *
	 * @return Generator
	 */
	public static function corrupted_data_provider() {
		yield 'Integer data' => [
			'corrupted_data' => 123,
		];
		yield 'Array data' => [
			'corrupted_data' => [ 'xml' => 'data' ],
		];
		yield 'Boolean data' => [
			'corrupted_data' => true,
		];
		yield 'Object data' => [
			'corrupted_data' => (object) [ 'xml' => 'data' ],
		];
	}

	/**
	 * Tests get() returns cached string data successfully.
	 *
	 * @return void
	 */
	public function test_get_returns_cached_data() {
		$cached_data = '<?xml version="1.0"?><root><item>test</item></root>';

		$this->config->expects( 'cache_enabled' )->once()->andReturn( true );

		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( 'yoast_schema_aggregator_xml_sitemap_v1' )
			->andReturn( $cached_data );

		$result = $this->instance->get();

		$this->assertSame( $cached_data, $result );
	}

	/**
	 * Tests get() returns cached data with various XML strings.
	 *
	 * @param string $xml_data The XML data to test.
	 *
	 * @dataProvider xml_data_provider
	 *
	 * @return void
	 */
	public function test_get_with_various_xml_data( $xml_data ) {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( true );

		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( 'yoast_schema_aggregator_xml_sitemap_v1' )
			->andReturn( $xml_data );

		$result = $this->instance->get();

		$this->assertSame( $xml_data, $result );
	}

	/**
	 * Data provider for various XML data strings.
	 *
	 * @return Generator
	 */
	public static function xml_data_provider() {
		yield 'Simple XML' => [
			'xml_data' => '<xml>test</xml>',
		];
		yield 'XML with attributes' => [
			'xml_data' => '<root attr="value"><item id="1">data</item></root>',
		];
		yield 'Empty XML' => [
			'xml_data' => '',
		];
		yield 'Large XML' => [
			'xml_data' => \str_repeat( '<item>content</item>', 100 ),
		];
	}
}
