<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Renderer;

use DOMDocument;

/**
 * Tests the Schema_Map_Xml_Renderer render method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Renderer::render
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Render_Test extends Abstract_Schema_Map_Xml_Renderer_Test {

	/**
	 * Tests rendering a schema map with a single entry.
	 *
	 * @return void
	 */
	public function test_render_single_entry() {
		$this->config
			->expects( 'get_changefreq' )
			->once()
			->andReturn( 'daily' );

		$this->config
			->expects( 'get_priority' )
			->once()
			->andReturn( '0.8' );

		$schema_map = [
			[
				'url'     => 'https://example.com/wp-json/yoast/v1/schema-aggregator/get-schema/post',
				'lastmod' => '2025-01-01T00:00:00Z',
			],
		];

		$result = $this->instance->render( $schema_map );

		$dom = new DOMDocument();
		$dom->loadXML( $result );

		$url_set = $dom->getElementsByTagName( 'urlset' );
		$this->assertSame( 1, $url_set->length );
		$this->assertSame( 'http://www.sitemaps.org/schemas/sitemap/0.9', $url_set->item( 0 )->getAttribute( 'xmlns' ) );

		$urls = $dom->getElementsByTagName( 'url' );
		$this->assertSame( 1, $urls->length );
		$this->assertSame( 'structuredData/schema.org', $urls->item( 0 )->getAttribute( 'contentType' ) );

		$this->assertSame( 'https://example.com/wp-json/yoast/v1/schema-aggregator/get-schema/post', $dom->getElementsByTagName( 'loc' )->item( 0 )->textContent );
		$this->assertSame( '2025-01-01T00:00:00Z', $dom->getElementsByTagName( 'lastmod' )->item( 0 )->textContent );
		$this->assertSame( 'daily', $dom->getElementsByTagName( 'changefreq' )->item( 0 )->textContent );
		$this->assertSame( '0.8', $dom->getElementsByTagName( 'priority' )->item( 0 )->textContent );
	}

	/**
	 * Tests rendering a schema map with multiple entries.
	 *
	 * @return void
	 */
	public function test_render_multiple_entries() {
		$this->config
			->expects( 'get_changefreq' )
			->once()
			->andReturn( 'weekly' );

		$this->config
			->expects( 'get_priority' )
			->once()
			->andReturn( '0.5' );

		$schema_map = [
			[
				'url'     => 'https://example.com/wp-json/yoast/v1/schema-aggregator/get-schema/post',
				'lastmod' => '2025-01-01T00:00:00Z',
			],
			[
				'url'     => 'https://example.com/wp-json/yoast/v1/schema-aggregator/get-schema/page',
				'lastmod' => '2025-02-01T00:00:00Z',
			],
		];

		$result = $this->instance->render( $schema_map );

		$dom = new DOMDocument();
		$dom->loadXML( $result );

		$urls = $dom->getElementsByTagName( 'url' );
		$this->assertSame( 2, $urls->length );

		$locs = $dom->getElementsByTagName( 'loc' );
		$this->assertSame( 'https://example.com/wp-json/yoast/v1/schema-aggregator/get-schema/post', $locs->item( 0 )->textContent );
		$this->assertSame( 'https://example.com/wp-json/yoast/v1/schema-aggregator/get-schema/page', $locs->item( 1 )->textContent );
	}

	/**
	 * Tests rendering skips entries missing the url key.
	 *
	 * @return void
	 */
	public function test_render_skips_entry_missing_url() {
		$this->config
			->expects( 'get_changefreq' )
			->once()
			->andReturn( 'daily' );

		$this->config
			->expects( 'get_priority' )
			->once()
			->andReturn( '0.8' );

		$schema_map = [
			[
				'lastmod' => '2025-01-01T00:00:00Z',
			],
		];

		$result = $this->instance->render( $schema_map );

		$dom = new DOMDocument();
		$dom->loadXML( $result );

		$urls = $dom->getElementsByTagName( 'url' );
		$this->assertSame( 0, $urls->length );
	}

	/**
	 * Tests rendering skips entries missing the lastmod key.
	 *
	 * @return void
	 */
	public function test_render_skips_entry_missing_lastmod() {
		$this->config
			->expects( 'get_changefreq' )
			->once()
			->andReturn( 'daily' );

		$this->config
			->expects( 'get_priority' )
			->once()
			->andReturn( '0.8' );

		$schema_map = [
			[
				'url' => 'https://example.com/wp-json/yoast/v1/schema-aggregator/get-schema/post',
			],
		];

		$result = $this->instance->render( $schema_map );

		$dom = new DOMDocument();
		$dom->loadXML( $result );

		$urls = $dom->getElementsByTagName( 'url' );
		$this->assertSame( 0, $urls->length );
	}

	/**
	 * Tests rendering an empty schema map returns XML with just the urlset root.
	 *
	 * @return void
	 */
	public function test_render_empty_schema_map() {
		$this->config
			->expects( 'get_changefreq' )
			->once()
			->andReturn( 'daily' );

		$this->config
			->expects( 'get_priority' )
			->once()
			->andReturn( '0.8' );

		$result = $this->instance->render( [] );

		$dom = new DOMDocument();
		$dom->loadXML( $result );

		$url_set = $dom->getElementsByTagName( 'urlset' );
		$this->assertSame( 1, $url_set->length );

		$urls = $dom->getElementsByTagName( 'url' );
		$this->assertSame( 0, $urls->length );
	}
}
