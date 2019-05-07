<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

use Brain\Monkey;

/**
 * Class WPSEO_Sitemaps_Test.
 *
 * @group sitemaps
 */
class Sitemaps extends \Yoast\Tests\TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Sitemaps_Double
	 */
	private static $class_instance;

	/**
	 * Holds the instance of the query.
	 *
	 * @var WP_Query
	 */
	private static $wp_the_query;


	/**
	 * Set up our double class.
	 */
	public function setUp() {
		parent::setUp();

		self::$class_instance = Mockery::mock( WPSEO_Sitemaps::class )->makePartial();
		self::$class_instance->cache = Mockery::mock( WPSEO_Sitemaps_Cache::class );

		self::$wp_the_query = Mockery::mock( '\WP_Query' );
		self::$wp_the_query
			->shouldReceive( 'is_main_query' )
			->once()
			->andReturn( true );
		self::$wp_the_query
			->shouldReceive( 'is_404' )
			->never();
	}

	/**
	 * Test the nested sitemap generation.
	 *
	 * @covers WPSEO_Sitemaps::redirect
	 */
	public function test_post_sitemap() {
		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'yoast-sitemap-xsl' )
			->andReturn( '' );
		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'sitemap' )
			->andReturn( 'post' );
		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'sitemap_n' )
			->andReturn( '' );

		self::$class_instance->cache
			->shouldReceive( 'is_enabled' )
			->once()
			->andReturn( false );

		self::$class_instance
			->shouldReceive( 'build_sitemap' )
			->once()
			->with( 'post' );

		self::$class_instance
			->shouldReceive( 'output' )
			->once();

		self::$class_instance
			->shouldReceive( 'sitemap_close' )
			->once();

		self::$class_instance->redirect( self::$wp_the_query );
	}

	/**
	 * Test the nested sitemap generation with cache enabled.
	 *
	 * @covers WPSEO_Sitemaps::redirect
	 */
	public function test_post_sitemap_with_cache() {
		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'yoast-sitemap-xsl' )
			->andReturn( '' );
		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'sitemap' )
			->andReturn( 'post' );
		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'sitemap_n' )
			->andReturn( '' );

		self::$class_instance->cache
			->shouldReceive( 'is_enabled' )
			->once()
			->andReturn( true );

		$sitemap_cache_data_mock = Mockery::mock( WPSEO_Sitemap_Cache_Data::class );
		$sitemap_cache_data_mock
			->shouldReceive( 'get_sitemap' )
			->once()
			->andReturn( 'sitemap' );

		$sitemap_cache_data_mock
			->shouldReceive( 'is_usable' )
			->once()
			->andReturn( true );

		self::$class_instance->cache
			->shouldReceive( 'get_sitemap_data' )
			->once()
			->with( 'post', 1 )
			->andReturn( $sitemap_cache_data_mock );

		self::$class_instance
			->shouldReceive( 'build_sitemap' )
			->never()
			->with( 'post' );

		self::$class_instance
			->shouldReceive( 'output' )
			->once();

		self::$class_instance
			->shouldReceive( 'sitemap_close' )
			->once();

		self::$class_instance->redirect( self::$wp_the_query );
	}

	/**
	 * Test for last modified date.
	 *
	 * @covers WPSEO_Sitemaps::get_last_modified_gmt
	 */
	public function test_last_modified_post_type() {

		$older_date  = '2015-01-01 12:00:00';
		$newest_date = '2016-01-01 12:00:00';

		$post_type_args = array(
			'public'      => true,
			'has_archive' => true,
		);
		register_post_type( 'yoast', $post_type_args );

		$post_args = array(
			'post_status' => 'publish',
			'post_type'   => 'yoast',
			'post_date'   => $newest_date,
		);
		$this->factory->post->create( $post_args );

		$post_args['post_date'] = $older_date;
		$this->factory->post->create( $post_args );

		$this->assertEquals( $newest_date, WPSEO_Sitemaps::get_last_modified_gmt( array( 'yoast' ) ) );
	}

	/**
	 * Test for last modified date with invalid post types.
	 *
	 * @covers WPSEO_Sitemaps::get_last_modified_gmt
	 */
	public function test_last_modified_with_invalid_post_type() {
		$this->assertFalse( WPSEO_Sitemaps::get_last_modified_gmt( array( 'invalid_post_type' ) ) );
	}
}
