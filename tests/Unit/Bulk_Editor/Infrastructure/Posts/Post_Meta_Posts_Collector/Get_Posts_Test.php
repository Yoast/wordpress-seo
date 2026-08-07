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
	 * The statuses passed in the query.
	 *
	 * @var array<string>
	 */
	private const STATUSES = [ 'publish', 'draft', 'pending', 'future' ];

	/**
	 * Tests that an editable post is returned with its status and raw Yoast meta.
	 *
	 * @return void
	 */
	public function test_get_posts_editable() {
		$meta = [
			'_yoast_wpseo_focuskw'                => 'hello',
			'_yoast_wpseo_title'                  => 'Hello | Site',
			'_yoast_wpseo_metadesc'               => 'A description.',
			'_yoast_wpseo_opengraph-title'        => 'Social hello',
			'_yoast_wpseo_opengraph-description'  => 'Social description.',
			'_yoast_wpseo_seo_title_score'        => '90',
			'_yoast_wpseo_meta_description_score' => '50',
		];

		$this->stub_run_query( [ 7 ], 1 );

		$this->post_editability_resolver->expects( 'resolve' )->with( [ 7 ] )->andReturn( [ 7 => true ] );

		Functions\expect( 'get_post' )->once()->with( 7 )->andReturn(
			(object) [
				'post_status' => 'draft',
				'post_type'   => 'post',
			],
		);
		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Hello world' );
		Functions\expect( 'get_edit_post_link' )->once()->with( 7, 'raw' )->andReturn( 'post.php?post=7&action=edit' );
		Functions\expect( 'get_post_meta' )
			->times( 7 )
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
						'editable'           => true,
						'needs_improvement'  => [
							'seo_title'          => false,
							'meta_description'   => true,
							'social_title'       => false,
							'social_description' => false,
						],
					],
				],
				'total'       => 1,
				'total_pages' => 1,
				'page'        => 1,
				'per_page'    => 20,
			],
			$this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', self::STATUSES ) )->to_array(),
		);
	}

	/**
	 * Tests that a non-editable post is returned locked and without its SEO data.
	 *
	 * @return void
	 */
	public function test_get_posts_locks_non_editable_post() {
		$this->stub_run_query( [ 7 ], 1 );

		$this->post_editability_resolver->expects( 'resolve' )->with( [ 7 ] )->andReturn( [ 7 => false ] );

		Functions\expect( 'get_post' )->once()->with( 7 )->andReturn(
			(object) [
				'post_status' => 'publish',
				'post_type'   => 'post',
			],
		);
		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Secret post' );
		// A locked post exposes neither its edit link nor its Yoast meta.
		Functions\expect( 'get_edit_post_link' )->never();
		Functions\expect( 'get_post_meta' )->never();

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', self::STATUSES ) )->to_array();

		$this->assertSame(
			[
				'id'                 => 7,
				'title'              => 'Secret post',
				'status'             => 'publish',
				'edit_link'          => '',
				'focus_keyphrase'    => '',
				'seo_title'          => '',
				'meta_description'   => '',
				'social_title'       => '',
				'social_description' => '',
				'editable'           => false,
				'needs_improvement'  => [
					'seo_title'          => false,
					'meta_description'   => false,
					'social_title'       => false,
					'social_description' => false,
				],
			],
			$result['posts'][0],
		);
	}

	/**
	 * Tests that the total is taken from the query's found_posts.
	 *
	 * @return void
	 */
	public function test_get_posts_reports_total_from_found_posts() {
		$this->stub_run_query( [ 7 ], 42 );

		$this->post_editability_resolver->expects( 'resolve' )->with( [ 7 ] )->andReturn( [ 7 => true ] );

		Functions\expect( 'get_post' )->once()->andReturn(
			(object) [
				'post_status' => 'draft',
				'post_type'   => 'post',
			],
		);
		Functions\expect( 'get_the_title' )->once()->andReturn( 'Hello world' );
		Functions\expect( 'get_edit_post_link' )->once()->andReturn( 'edit' );
		Functions\expect( 'get_post_meta' )->times( 7 )->andReturn( '' );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', self::STATUSES ) )->to_array();

		$this->assertSame( 42, $result['total'] );
		$this->assertSame( 3, $result['total_pages'] );
	}

	/**
	 * Tests that the SEO title and meta description fall back to the resolved template when the stored
	 * values are empty, and that the post is not flagged as needing improvement.
	 *
	 * @return void
	 */
	public function test_get_posts_resolves_template_when_stored_values_are_empty() {
		$meta = [
			'_yoast_wpseo_focuskw'                => '',
			'_yoast_wpseo_title'                  => '',
			'_yoast_wpseo_metadesc'               => '',
			'_yoast_wpseo_opengraph-title'        => 'Social hello',
			'_yoast_wpseo_opengraph-description'  => 'Social description.',
			'_yoast_wpseo_seo_title_score'        => '0',
			'_yoast_wpseo_meta_description_score' => '0',
		];

		$this->stub_run_query( [ 7 ], 1 );

		$this->post_editability_resolver->expects( 'resolve' )->with( [ 7 ] )->andReturn( [ 7 => true ] );

		Functions\expect( 'get_post' )->once()->with( 7 )->andReturn(
			(object) [
				'post_status' => 'draft',
				'post_type'   => 'page',
			],
		);
		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'A page' );
		Functions\expect( 'get_edit_post_link' )->once()->with( 7, 'raw' )->andReturn( 'post.php?post=7&action=edit' );
		Functions\expect( 'get_post_meta' )
			->times( 7 )
			->andReturnUsing(
				static function ( $post_id, $key ) use ( $meta ) {
					return $meta[ $key ];
				},
			);

		$this->default_template_resolver->allows( 'resolve_seo_title' )
			->with( 7, 'page', '' )
			->andReturn( 'Page title from template' );
		$this->default_template_resolver->allows( 'resolve_meta_description' )
			->with( 7, 'page', '' )
			->andReturn( 'Page description from template' );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', self::STATUSES ) )->to_array();
		$post   = $result['posts'][0];

		$this->assertSame( 'Page title from template', $post['seo_title'] );
		$this->assertSame( 'Page description from template', $post['meta_description'] );
		$this->assertFalse( $post['needs_improvement']['seo_title'] );
		$this->assertFalse( $post['needs_improvement']['meta_description'] );
	}

	/**
	 * Tests that the social title and social description fall back to the raw template when the
	 * stored values are empty, and that the post is not flagged as needing improvement.
	 *
	 * @return void
	 */
	public function test_get_posts_resolves_social_template_when_stored_values_are_empty() {
		$meta = [
			'_yoast_wpseo_focuskw'                => '',
			'_yoast_wpseo_title'                  => 'Explicit SEO title',
			'_yoast_wpseo_metadesc'               => 'Explicit meta description.',
			'_yoast_wpseo_opengraph-title'        => '',
			'_yoast_wpseo_opengraph-description'  => '',
			'_yoast_wpseo_seo_title_score'        => '0',
			'_yoast_wpseo_meta_description_score' => '0',
		];

		$this->stub_run_query( [ 7 ], 1 );

		$this->post_editability_resolver->expects( 'resolve' )->with( [ 7 ] )->andReturn( [ 7 => true ] );

		Functions\expect( 'get_post' )->once()->with( 7 )->andReturn(
			(object) [
				'post_status' => 'publish',
				'post_type'   => 'post',
			],
		);
		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'A post' );
		Functions\expect( 'get_edit_post_link' )->once()->with( 7, 'raw' )->andReturn( 'post.php?post=7&action=edit' );
		Functions\expect( 'get_post_meta' )
			->times( 7 )
			->andReturnUsing(
				static function ( $post_id, $key ) use ( $meta ) {
					return $meta[ $key ];
				},
			);

		$this->default_template_resolver->allows( 'resolve_social_title' )
			->with( 7, 'post', '' )
			->andReturn( 'Social title from template' );
		$this->default_template_resolver->allows( 'resolve_social_description' )
			->with( 7, 'post', '' )
			->andReturn( 'Social description from template' );

		$result = $this->instance->get_posts( new Posts_Query( 'page', 1, 20, '', self::STATUSES ) )->to_array();
		$post   = $result['posts'][0];

		$this->assertSame( 'Social title from template', $post['social_title'] );
		$this->assertSame( 'Social description from template', $post['social_description'] );
		$this->assertFalse( $post['needs_improvement']['social_title'] );
		$this->assertFalse( $post['needs_improvement']['social_description'] );
	}

	/**
	 * Stubs run_query so it returns a WP_Query with the given post IDs and total.
	 *
	 * @param array<int> $post_ids    The post IDs the query returns.
	 * @param int        $found_posts The total the query reports.
	 *
	 * @return void
	 */
	private function stub_run_query( array $post_ids, int $found_posts ) {
		$wp_query              = Mockery::mock( WP_Query::class );
		$wp_query->posts       = $post_ids;
		$wp_query->found_posts = $found_posts;

		$this->instance->expects( 'run_query' )->once()->with( Mockery::type( Posts_Query::class ) )->andReturn( $wp_query );
	}
}
