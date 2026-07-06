<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;

use Brain\Monkey\Functions;
use Mockery;
use WP_Query;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;

/**
 * Tests get_posts.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector::get_posts
 */
final class Get_Posts_Test extends Abstract_Post_Meta_Posts_Collector_Test {

	/**
	 * Tests that the queried posts are mapped to a page of posts, reading the raw Yoast meta.
	 *
	 * @return void
	 */
	public function test_get_posts() {
		$post = (object) [
			'ID'          => 7,
			'post_title'  => 'Hello world',
			'post_status' => 'draft',
		];
		$meta = [
			'_yoast_wpseo_focuskw'               => 'hello',
			'_yoast_wpseo_title'                 => 'Hello | Site',
			'_yoast_wpseo_metadesc'              => 'A description.',
			'_yoast_wpseo_opengraph-title'       => 'Social hello',
			'_yoast_wpseo_opengraph-description' => 'Social description.',
		];

		$wp_query              = Mockery::mock( WP_Query::class );
		$wp_query->posts       = [ $post ];
		$wp_query->found_posts = 1;

		$this->instance->expects( 'run_query' )->once()->with( Mockery::type( Posts_Query::class ) )->andReturn( $wp_query );

		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Hello world' );
		Functions\expect( 'get_edit_post_link' )->once()->with( 7, 'raw' )->andReturn( 'post.php?post=7&action=edit' );
		Functions\expect( 'get_post_meta' )
			->times( 5 )
			->andReturnUsing(
				static function ( $post_id, $key ) use ( $meta ) {
					return $meta[ $key ];
				},
			);

		$this->assertSame(
			[
				'posts'       => [
					[
						'id'                 => 7,
						'title'              => 'Hello world',
						'status'             => 'draft',
						'edit_link'          => 'post.php?post=7&action=edit',
						'focus_keyphrase'    => 'hello',
						'seo_title'          => 'Hello | Site',
						'meta_description'   => 'A description.',
						'social_title'       => 'Social hello',
						'social_description' => 'Social description.',
					],
				],
				'total'       => 1,
				'total_pages' => 1,
				'page'        => 1,
				'per_page'    => 20,
			],
			$this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', [ 'publish' ] ) )->to_array(),
		);
	}

	/**
	 * Tests that HTML entities in the post title are decoded so they render as text.
	 *
	 * @return void
	 */
	public function test_get_posts_decodes_html_entities_in_the_title() {
		$post = (object) [
			'ID'          => 7,
			'post_status' => 'draft',
		];

		$wp_query              = Mockery::mock( WP_Query::class );
		$wp_query->posts       = [ $post ];
		$wp_query->found_posts = 1;

		$this->instance->expects( 'run_query' )->once()->andReturn( $wp_query );

		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Tips &amp; Tricks: &#8220;SEO&#8221;' );
		Functions\expect( 'get_edit_post_link' )->once()->with( 7, 'raw' )->andReturn( 'post.php?post=7&action=edit' );
		Functions\expect( 'get_post_meta' )->times( 5 )->andReturn( '' );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', [ 'publish' ] ) )->to_array();

		$this->assertSame( 'Tips & Tricks: “SEO”', $result['posts'][0]['title'] );
	}

	/**
	 * Tests that the total is taken from the query's found_posts.
	 *
	 * @return void
	 */
	public function test_get_posts_reports_total_from_found_posts() {
		$wp_query              = Mockery::mock( WP_Query::class );
		$wp_query->posts       = [];
		$wp_query->found_posts = 42;

		$this->instance->expects( 'run_query' )->once()->andReturn( $wp_query );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', [ 'publish' ] ) )->to_array();

		$this->assertSame( 42, $result['total'] );
		$this->assertSame( 3, $result['total_pages'] );
	}
}
