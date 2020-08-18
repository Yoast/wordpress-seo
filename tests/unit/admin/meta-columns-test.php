<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey\Functions;
use Mockery;
use stdClass;
use WPSEO_Meta_Columns;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit test class.
 *
 * @group Admin
 *
 * @coversDefaultClass WPSEO_Meta_Columns
 */
class Meta_Columns_Test extends TestCase {

	/**
	 * Tests the get_post_ids_and_set_meta_cache function.
	 *
	 * @covers ::__construct
	 * @covers ::get_post_ids_and_set_meta_cache
	 */
	public function test_get_post_ids_and_set_meta_cache() {
		global $wp_query;

		$instance = new WPSEO_Meta_Columns();

		$posts = [ Mockery::mock( 'WP_Post' ) ];

		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->posts = [];
		$wp_query->expects( 'get_posts' )->once()->andReturn( $posts );

		Functions\expect( 'wp_list_pluck' )
			->once()
			->with( $posts, 'ID' )
			->andReturn( [ 1 ] );

		$results = [ (object) [ 'id' => 1 ] ];

		$meta_surface = Mockery::mock( Meta_Surface::class );
		$meta_surface->expects( 'for_posts' )
			->once()
			->with( [ 1 ] )
			->andReturn( $results );

		Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'meta' => $meta_surface ] );

		$instance->get_post_ids_and_set_meta_cache( 'top' );
	}

	/**
	 * Tests the get_post_ids_and_set_meta_cache function.
	 *
	 * @covers ::__construct
	 * @covers ::get_post_ids_and_set_meta_cache
	 */
	public function test_get_post_ids_and_set_meta_cache_with_posts() {
		global $wp_query;

		$instance = new WPSEO_Meta_Columns();

		$posts = [ Mockery::mock( 'WP_Post' ) ];

		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->posts = $posts;

		Functions\expect( 'wp_list_pluck' )
			->once()
			->with( $posts, 'ID' )
			->andReturn( [ 1 ] );

		$results = [ (object) [ 'id' => 1 ] ];

		$meta_surface = Mockery::mock( Meta_Surface::class );
		$meta_surface->expects( 'for_posts' )
			->once()
			->with( [ 1 ] )
			->andReturn( $results );

		Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'meta' => $meta_surface ] );

		$instance->get_post_ids_and_set_meta_cache( 'top' );
	}

	/**
	 * Tests the get_post_ids_and_set_meta_cache function.
	 *
	 * @covers ::__construct
	 * @covers ::get_post_ids_and_set_meta_cache
	 */
	public function test_get_post_ids_and_set_meta_cache_with_non_post_query() {
		global $wp_query;

		$instance = new WPSEO_Meta_Columns();

		$posts = [ new stdClass ];

		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->posts = [];
		$wp_query->expects( 'get_posts' )->once()->andReturn( $posts );

		Functions\expect( 'wp_list_pluck' )
			->once()
			->with( $posts, 'ID' )
			->andReturn( [ 1 ] );

		Functions\expect( '_prime_post_caches' )->once()->with( [ 1 ] );

		$results = [ (object) [ 'id' => 1 ] ];

		$meta_surface = Mockery::mock( Meta_Surface::class );
		$meta_surface->expects( 'for_posts' )
			->once()
			->with( [ 1 ] )
			->andReturn( $results );

		Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'meta' => $meta_surface ] );

		$instance->get_post_ids_and_set_meta_cache( 'top' );
	}

	/**
	 * Tests the get_post_ids_and_set_meta_cache function.
	 *
	 * @covers ::__construct
	 * @covers ::get_post_ids_and_set_meta_cache
	 */
	public function test_get_post_ids_and_set_meta_cache_with_no_results() {
		global $wp_query;

		$instance = new WPSEO_Meta_Columns();

		$posts = [];

		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->posts = [];
		$wp_query->expects( 'get_posts' )->once()->andReturn( $posts );

		$instance->get_post_ids_and_set_meta_cache( 'top' );
	}
}
