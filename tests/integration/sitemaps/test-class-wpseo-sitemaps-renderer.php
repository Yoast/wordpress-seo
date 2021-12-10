<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Sitemaps_Renderer_Test.
 *
 * @group sitemaps
 */
class WPSEO_Sitemaps_Renderer_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Sitemaps_Renderer
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 */
	public function set_up() {
		parent::set_up();

		self::$class_instance = new WPSEO_Sitemaps_Renderer();
	}

	/**
	 * Tests retrieval of a sitemap index.
	 *
	 * @covers WPSEO_Sitemaps_Renderer::get_index
	 */
	public function test_get_index() {

		$loc     = 'http://example.com/';
		$lastmod = date( 'c' );
		$links   = [
			[
				'loc'     => $loc,
				'lastmod' => $lastmod,
			],
		];

		$index = self::$class_instance->get_index( $links );
		$this->assertStringContainsString( "<loc>{$loc}</loc>", $index );
		$this->assertStringContainsString( "<lastmod>{$lastmod}</lastmod>", $index );
	}

	/**
	 * Tests retrieval of a sitemap.
	 *
	 * @covers WPSEO_Sitemaps_Renderer::get_sitemap
	 */
	public function test_get_sitemap() {

		$loc   = 'http://example.com/';
		$mod   = date( 'c' );
		$src   = 'http://example.com/image.jpg';
		$title = 'Image title.';
		$alt   = 'Image alt.';
		$links = [
			[
				'loc'    => $loc,
				'mod'    => $mod,
				'chf'    => 'daily',
				'pri'    => 1,
				'images' => [
					[
						'src'   => $src,
						'title' => $title,
						'alt'   => $alt,
					],
				],
			],
		];

		$index = self::$class_instance->get_sitemap( $links, 'post', 0 );
		$this->assertStringContainsString( "<loc>{$loc}</loc>", $index );
		$this->assertStringContainsString( "<lastmod>{$mod}</lastmod>", $index );
		$this->assertStringContainsString( "<image:loc>{$src}</image:loc>", $index );
		$this->assertStringContainsString( "<image:title><![CDATA[{$title}]]></image:title>", $index );
		$this->assertStringContainsString( "<image:caption><![CDATA[{$alt}]]></image:caption>", $index );
	/**
	 * Tests correctly encoding URLs.
	 *
	 * @covers WPSEO_Sitemaps_Renderer::encode_url_rfc3986
	 *
	 * @dataProvider data_encode_url_rfc3986
	 *
	 * @param string $loc      Page URL.
	 * @param string $expected Expected URL as used in the XML sitemap output.
	 */
	public function test_encode_url_rfc3986( $loc, $expected ) {
		$links = [ [ 'loc' => $loc ] ];
		$index = self::$class_instance->get_sitemap( $links, 'post', 0 );

		$this->assertStringContainsString( '<loc>' . $expected . '</loc>', $index );
	}

	/**
	 * Data provider.
	 *
	 * Note: the "expected" values should include any potential output escaping as per the `encode_and_escape()` method.
	 *
	 * @return array
	 */
	public function data_encode_url_rfc3986() {
		return [
			'Full URL which will validate with the filter - contains plain &' => [
				'loc'      => 'http://example.com/page-name?s=keyword&p=2#anchor',
				'expected' => 'http://example.com/page-name?s=keyword&amp;p=2#anchor',
			],
			'Full URL which will validate with the filter - contains &amp;' => [
				'loc'      => 'http://example.com/page-name?s=keyword&amp;p=2#anchor',
				'expected' => 'http://example.com/page-name?s=keyword&amp;p=2#anchor',
			],
			'Full URL which will validate with the filter - contains &#038;' => [
				'loc'      => 'http://example.com/page-name?s=keyword&#038;p=2#anchor',
				'expected' => 'http://example.com/page-name?s=keyword&amp;p=2#anchor',
			],

			/*
			 * All the below URLs will not validate with `FILTER_VALIDATE_URL` and will therefore
			 * fall through to the real logic in the function.
			 */
			'URL: no scheme, no path, no trailing slash either' => [
				'loc'      => 'example.com',
				'expected' => 'http://example.com',
			],
			'URL: no scheme, no path, with trailing slash' => [
				'loc'      => '//example.com/',
				'expected' => 'http://example.com/',
			],
			'URL: no scheme, has path, no encoding needed' => [
				'loc'      => '//example.com/my-category/my-page/',
				'expected' => 'http://example.com/my-category/my-page/',
			],
			'URL: no scheme, has path, encoding needed, not pre-encoded' => [
				'loc'      => '//example.com/my category/my=page*without"enco@ding/',
				'expected' => 'http://example.com/my%20category/my%3Dpage%2Awithout%22enco%40ding/',
			],
			'URL: no scheme, has path, encoding needed, pre-encoded' => [
				'loc'      => '//example.com/my%20category/my%3Dpage%2Awithout%22enco%40ding/',
				'expected' => 'http://example.com/my%20category/my%3Dpage%2Awithout%22enco%40ding/',
			],
			'URL: no scheme, no path, has query' => [
				'loc'      => '//example.com/?s=keyword&p=2',
				'expected' => 'http://example.com/?s=keyword&amp;p=2',
			],
			'URL: no scheme, has path, has query' => [
				'loc'      => '//example.com/page-name?s=keyword&p=2',
				'expected' => 'http://example.com/page-name?s=keyword&amp;p=2',
			],
			'URL: no scheme, has path, has query, path needs encoding' => [
				'loc'      => '//example.com/my category?s=keyword&p=2',
				'expected' => 'http://example.com/my%20category?s=keyword&amp;p=2',
			],
		];
	}

	/**
	 * Helper function to set plugin url to a different domain.
	 *
	 * @return string
	 */
	public function change_plugin_url() {
		return 'http://test.com/wp-content/plugins';
	}

	/**
	 * Tests getting the fallback url if the plugin is loaded from a different domain.
	 *
	 * @covers WPSEO_Sitemaps_Renderer_Double::get_xsl_url
	 */
	public function test_is_home_url_returned_correctly() {
		$class_instance = new WPSEO_Sitemaps_Renderer_Double();

		add_filter( 'plugins_url', [ $this, 'change_plugin_url' ] );
		$this->assertEquals( 'http://example.org/main-sitemap.xsl', $class_instance->get_xsl_url() );
		remove_filter( 'plugins_url', [ $this, 'change_plugin_url' ] );
	}
}
