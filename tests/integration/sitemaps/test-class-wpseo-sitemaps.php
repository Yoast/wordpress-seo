<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Sitemaps_Test.
 *
 * @group sitemaps
 */
class WPSEO_Sitemaps_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Sitemaps_Double
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 */
	public function set_up() {
		parent::set_up();

		self::$class_instance = new WPSEO_Sitemaps_Double();
	}

	/**
	 * Test the nested sitemap generation.
	 *
	 * @dataProvider data_post_sitemap
	 *
	 * @covers WPSEO_Sitemaps::redirect
	 *
	 * @param string $expected_output Substring expected to be found in the actual output.
	 */
	public function test_post_sitemap( $expected_output ) {
		self::$class_instance->reset();

		set_query_var( 'sitemap', 'post' );

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( $expected_output );
	}

	/**
	 * Data provider for the `test_post_sitemap()` test.
	 *
	 * @return array
	 */
	public function data_post_sitemap() {
		return [
			[ '<?xml' ],
			[ '<urlset ' ],
		];
	}

	/**
	 * Tests the main sitemap and also tests the transient cache.
	 *
	 * @dataProvider data_main_sitemap
	 *
	 * @covers WPSEO_Sitemaps::redirect
	 *
	 * @param string $expected_output Substring expected to be found in the actual output.
	 */
	public function test_main_sitemap( $expected_output ) {

		self::$class_instance->reset();

		set_query_var( 'sitemap', '1' );

		$this->factory->post->create();

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( $expected_output );
	}

	/**
	 * Data provider for the `test_main_sitemap()` test.
	 *
	 * @return array
	 */
	public function data_main_sitemap() {
		return [
			[ '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' ],
			[ '<sitemap>' ],
			[ '<lastmod>' ],
			[ '</sitemapindex>' ],
		];
	}

	/**
	 * Tests the wpseo_sitemap_index_links filter.
	 *
	 * @covers WPSEO_Sitemaps::build_root_map
	 */
	public function test_index_links_filter() {

		self::$class_instance->reset();

		set_query_var( 'sitemap', '1' );

		$this->factory->post->create();

		add_filter(
			'wpseo_sitemap_index_links',
			static function( $links ) {
				$links[] = [
					'loc'     => 'test-sitemap.xml',
					'lastmod' => date( '1' ),
				];
				return $links;
			}
		);

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( '<loc>test-sitemap.xml</loc>' );
	}

	/**
	 * Test for last modified date.
	 *
	 * @covers WPSEO_Sitemaps::get_last_modified_gmt
	 */
	public function test_last_modified_post_type() {

		$older_date  = '2015-01-01 12:00:00';
		$newest_date = '2016-01-01 12:00:00';

		$post_type_args = [
			'public'      => true,
			'has_archive' => true,
		];
		register_post_type( 'yoast', $post_type_args );

		$post_args = [
			'post_status' => 'publish',
			'post_type'   => 'yoast',
			'post_date'   => $newest_date,
		];
		$this->factory->post->create( $post_args );

		$post_args['post_date'] = $older_date;
		$this->factory->post->create( $post_args );

		$this->assertEquals( $newest_date, WPSEO_Sitemaps::get_last_modified_gmt( [ 'yoast' ] ) );
	}

	/**
	 * Test for last modified date with invalid post types.
	 *
	 * @covers WPSEO_Sitemaps::get_last_modified_gmt
	 */
	public function test_last_modified_with_invalid_post_type() {
		$this->assertFalse( WPSEO_Sitemaps::get_last_modified_gmt( [ 'invalid_post_type' ] ) );
	}
}
