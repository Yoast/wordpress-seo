<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Sitemaps_Renderer_Test.
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
	public function setUp() {
		parent::setUp();

		self::$class_instance = new WPSEO_Sitemaps_Renderer();
	}

	/**
	 * @covers WPSEO_Sitemaps_Renderer::get_index
	 */
	public function test_get_index() {

		$loc     = 'http://example.com/';
		$lastmod = date( 'c' );
		$links   = array(
			array(
				'loc'     => $loc,
				'lastmod' => $lastmod,
			),
		);

		$index = self::$class_instance->get_index( $links );
		$this->assertContains( "<loc>{$loc}</loc>", $index );
		$this->assertContains( "<lastmod>{$lastmod}</lastmod>", $index );
	}

	/**
	 * @covers WPSEO_Sitemaps_Renderer::get_sitemap
	 */
	public function test_get_sitemap() {

		$loc   = 'http://example.com/';
		$mod   = date( 'c' );
		$src   = 'http://example.com/image.jpg';
		$title = 'Image title.';
		$alt   = 'Image alt.';
		$links = array(
			array(
				'loc'    => $loc,
				'mod'    => $mod,
				'chf'    => 'daily',
				'pri'    => 1,
				'images' => array(
					array(
						'src'   => $src,
						'title' => $title,
						'alt'   => $alt,
					),
				),
			),
		);

		$index = self::$class_instance->get_sitemap( $links, 'post', 0 );
		$this->assertContains( "<loc>{$loc}</loc>", $index );
		$this->assertContains( "<lastmod>{$mod}</lastmod>", $index );
		$this->assertContains( "<image:loc>{$src}</image:loc>", $index );
		$this->assertContains( "<image:title><![CDATA[{$title}]]></image:title>", $index );
		$this->assertContains( "<image:caption><![CDATA[{$alt}]]></image:caption>", $index );
	}

	/**
	 * Helper function to set plugin url to a different domain.
	 */
	public function change_plugin_url() {
		return 'http://test.com/wp-content/plugins';
	}

	/**
	 * Tests getting the fallback url if the plugin is loaded from a different domain.
	 *
	 * @covers WPSEO_Sitemaps_Renderer_Double::get_xsl_url()
	 */
	public function test_is_home_url_returned_correctly() {
		$class_instance = new WPSEO_Sitemaps_Renderer_Double();

		add_filter( 'plugins_url', array( $this, 'change_plugin_url' ) );
		$this->assertEquals( 'http://example.org/main-sitemap.xsl', $class_instance->get_xsl_url() );
		remove_filter( 'plugins_url', array( $this, 'change_plugin_url' ) );
	}
}
