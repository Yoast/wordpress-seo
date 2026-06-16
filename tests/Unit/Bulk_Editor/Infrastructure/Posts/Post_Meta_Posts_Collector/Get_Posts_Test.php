<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;

use Brain\Monkey\Functions;

/**
 * Tests get_posts.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector::get_posts
 */
final class Get_Posts_Test extends Abstract_Post_Meta_Posts_Collector_Test {

	/**
	 * Tests that the queried posts are mapped to posts, reading the raw Yoast meta.
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

		$this->instance->expects( 'query_posts' )->once()->with( 'page', 20 )->andReturn( [ $post ] );

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
			$this->instance->get_posts( 'page', 20 )->to_array(),
		);
	}
}
