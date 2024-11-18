<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Link_Builder;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Generator;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\SEO_Links_Mock;

/**
 * Class Build_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Link_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Link_Builder
 */
final class Build_Test extends Abstract_Indexable_Link_Builder_TestCase {

	/**
	 * Data provider to test the build.
	 *
	 * @return array<string|array<string>> The test data.
	 */
	public static function build_provider() {
		return [
			[
				'
					<a href="https://link.com/newly-added-in-post">link</a>
					<a href="https://link.com/already-existed-in-post">link</a>
				',
				SEO_Links::TYPE_EXTERNAL,
				false,
				[],
			],
			[
				'
					<img src="https://link.com/newly-added-in-post" />
					<img src="https://link.com/already-existed-in-post" />
				',
				SEO_Links::TYPE_EXTERNAL_IMAGE,
				true,

				[
					'https://link.com/newly-added-in-post'     => 1,
					'https://link.com/already-existed-in-post' => 2,
				],
			],
			[
				'
					<img src="https://link.com/newly-added-in-post" />
					<img src="https://link.com/already-existed-in-post" />
				',
				SEO_Links::TYPE_EXTERNAL_IMAGE,
				true,

				[
					'https://link.com/newly-added-in-post'     => 1,
					'https://link.com/already-existed-in-post' => 2,
				],
			],
			[
				'
					<img class="wp-image-1" src="https://link.com/newly-added-in-post" />
					<img class="wp-image-2" src="https://link.com/already-existed-in-post" />
				',
				SEO_Links::TYPE_EXTERNAL_IMAGE,
				true,

				[
					'https://link.com/newly-added-in-post'     => 1,
					'https://link.com/already-existed-in-post' => 2,
				],
			],
			[
				'
					<img class="no-image" src="https://link.com/newly-added-in-post" />
					<img class="no-image" src="https://link.com/already-existed-in-post" />
				',
				SEO_Links::TYPE_EXTERNAL_IMAGE,
				true,

				[
					'https://link.com/newly-added-in-post'     => 1,
					'https://link.com/already-existed-in-post' => 2,
				],
			],
		];
	}

	/**
	 * Tests the build function.
	 *
	 * @covers ::__construct
	 * @covers ::set_dependencies
	 * @covers ::build
	 * @covers ::create_links
	 * @covers ::create_internal_link
	 *
	 * @dataProvider build_provider
	 *
	 * @param string        $content   The content.
	 * @param string        $link_type The link type.
	 * @param bool          $is_image  Whether the link is an image.
	 * @param array<string> $images    The images that are in the content.
	 *
	 * @return void
	 */
	public function test_build( $content, $link_type, $is_image, $images ) {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'post';
		$indexable->permalink   = 'https://site.com/page';

		$this->indexable_helper->expects( 'should_index_indexable' )->once()->andReturn( true );
		$this->post_helper->expects( 'get_post' )->once()->with( 2 )->andReturn( 'post' );
		if ( $is_image ) {
			$this->image_content_extractor->expects( 'gather_images' )->once()->andReturn( $images );
		}
		else {
			$this->image_content_extractor->expects( 'gather_images' )->once()->andReturn( [] );

		}
		Functions\expect( 'setup_postdata' )->once()->with( 'post' );
		Functions\expect( 'apply_filters' )->once()->with( 'the_content', $content )->andReturn( $content );
		Functions\expect( 'wp_reset_postdata' )->once();

		$parsed_home_url          = [
			'scheme' => 'https',
			'host'   => 'site.com',
		];
		$parsed_page_url          = [
			'scheme' => 'https',
			'host'   => 'site.com',
			'path'   => 'page',
		];
		$parsed_new_link_url      = [
			'scheme' => 'https',
			'host'   => 'link.com',
			'path'   => 'newly-added-in-post',
		];
		$parsed_existing_link_url = [
			'scheme' => 'https',
			'host'   => 'link.com',
			'path'   => 'newly-added-in-post',
		];

		// Inside create_links method.
		Functions\expect( 'home_url' )->once()->andReturn( 'https://site.com' );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://site.com' )->andReturn( $parsed_home_url );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://site.com/page' )->andReturn( $parsed_page_url );

		// Inside create_links->create_internal_link method.
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://link.com/newly-added-in-post' )->andReturn( $parsed_new_link_url );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://link.com/already-existed-in-post' )->andReturn( $parsed_existing_link_url );
		$this->url_helper->expects( 'get_link_type' )->with( $parsed_new_link_url, $parsed_home_url, $is_image )->andReturn( $link_type );
		$this->url_helper->expects( 'get_link_type' )->with( $parsed_existing_link_url, $parsed_home_url, $is_image )->andReturn( $link_type );

		$query_mock                 = Mockery::mock( ORM::class );
		$new_seo_link               = Mockery::mock( SEO_Links_Mock::class );
		$new_seo_link->type         = $link_type;
		$new_seo_link->url          = 'https://link.com/newly-added-in-post';
		$new_seo_link->indexable_id = $indexable->id;
		$new_seo_link->post_id      = $indexable->object_id;

		$existing_seo_link               = Mockery::mock( SEO_Links_Mock::class );
		$existing_seo_link->type         = $link_type;
		$existing_seo_link->url          = 'https://link.com/already-existed-in-post';
		$existing_seo_link->indexable_id = $indexable->id;
		$existing_seo_link->post_id      = $indexable->object_id;

		// Inside create_links->create_internal_link method.
		$this->seo_links_repository->expects( 'query' )->twice()->andReturn( $query_mock );
		$query_mock->expects( 'create' )->once()->with(
			[
				'url'          => 'https://link.com/newly-added-in-post',
				'type'         => $link_type,
				'indexable_id' => $indexable->id,
				'post_id'      => $indexable->object_id,
			]
		)->andReturn( $new_seo_link );
		$query_mock->expects( 'create' )->once()->with(
			[
				'url'          => 'https://link.com/already-existed-in-post',
				'type'         => $link_type,
				'indexable_id' => $indexable->id,
				'post_id'      => $indexable->object_id,
			]
		)->andReturn( $existing_seo_link );

		$old_seo_link                      = new SEO_Links_Mock();
		$old_seo_link->target_indexable_id = 3;
		$old_seo_link->url                 = 'https://link.com/no-longer-in-post/';
		$old_seo_link->id                  = 567;

		$this->expect_update_related_indexables( $indexable, [ $new_seo_link ], [ $old_seo_link, $existing_seo_link ], [ 567 ] );

		// Inside update_related_indexables->update_incoming_links_for_related_indexables method.
		$this->seo_links_repository
			->expects( 'get_incoming_link_counts_for_indexable_ids' )
			->once()
			->with( [ $old_seo_link->target_indexable_id ] )
			->andReturn(
				[
					[
						'target_indexable_id' => 3,
						'incoming'            => 0,
					],
				]
			);
		$this->indexable_repository->expects( 'update_incoming_link_count' )->once()->with( 3, 0 );

		Functions\expect( 'wp_cache_supports' )->once()->andReturnTrue();
		Functions\expect( 'wp_cache_flush_group' )->once()->andReturnTrue();

		$links = $this->instance->build( $indexable, $content );

		$this->assertEquals( 2, \count( $links ) );
		$this->assertContains( $new_seo_link, $links );
		$this->assertContains( $existing_seo_link, $links );
	}

	/**
	 * Tests the build function for an internal link when the target indexable does not exist yet.
	 *
	 * @covers ::__construct
	 * @covers ::set_dependencies
	 * @covers ::build
	 * @covers ::gather_images
	 *
	 * @return void
	 */
	public function test_build_target_indexable_does_not_exist() {
		$content          = '<a href="https://site.com/target">link</a>';
		$link_type        = SEO_Links::TYPE_INTERNAL;
		$target_permalink = 'https://site.com/target';

		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'post';
		$indexable->permalink   = 'https://site.com/page';

		$target_indexable              = Mockery::mock( Indexable_Mock::class );
		$target_indexable->id          = 2;
		$target_indexable->object_id   = 3;
		$target_indexable->object_type = 'post';
		$target_indexable->permalink   = $target_permalink;
		$target_indexable->language    = 'nl';
		$target_indexable->region      = 'NL';

		$this->indexable_helper->expects( 'should_index_indexable' )->once()->andReturn( true );
		$this->post_helper->expects( 'get_post' )->once()->with( 2 )->andReturn( 'post' );
		$this->image_content_extractor->expects( 'gather_images' )->once()->andReturn( [] );

		Functions\expect( 'setup_postdata' )->once()->with( 'post' );
		Filters\expectApplied( 'the_content' )->with( $content )->andReturnFirstArg();
		Functions\expect( 'wp_reset_postdata' )->once();

		$parsed_home_url = [
			'scheme' => 'https',
			'host'   => 'site.com',
		];
		$parsed_page_url = [
			'scheme' => 'https',
			'host'   => 'site.com',
			'path'   => 'page',
		];
		$parsed_link_url = [
			'scheme' => 'https',
			'host'   => 'link.com',
			'path'   => 'target',
		];

		Functions\expect( 'home_url' )->once()->andReturn( 'https://site.com' );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://site.com' )->andReturn( $parsed_home_url );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://site.com/page' )->andReturn( $parsed_page_url );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://site.com/target' )->andReturn( $parsed_link_url );
		Functions\expect( 'set_url_scheme' )->once()->with( 'https://site.com/target', 'https' )->andReturnFirstArg();

		$this->url_helper->expects( 'get_link_type' )->with( $parsed_link_url, $parsed_home_url, false )->andReturn( $link_type );
		$this->url_helper->expects( 'is_relative' )->with( $target_permalink )->andReturnFalse();

		$query_mock                    = Mockery::mock( ORM::class );
		$seo_link                      = Mockery::mock( SEO_Links_Mock::class );
		$seo_link->type                = $link_type;
		$seo_link->url                 = $target_indexable->permalink;
		$seo_link->indexable_id        = $indexable->id;
		$seo_link->post_id             = $indexable->object_id;
		$seo_link->target_indexable_id = $target_indexable->id;
		$seo_link->target_post_id      = $target_indexable->object_id;

		$this->seo_links_repository->expects( 'query' )->once()->andReturn( $query_mock );

		// Inside create_links->create_internal_link method.
		$query_mock->expects( 'create' )->once()->with(
			[
				'url'          => $target_indexable->permalink,
				'type'         => $link_type,
				'indexable_id' => $indexable->id,
				'post_id'      => $indexable->object_id,
			]
		)->andReturn( $seo_link );

		$old_seo_link                      = new SEO_Links_Mock();
		$old_seo_link->target_indexable_id = 3;
		$old_seo_link->url                 = 'https://link.com/no-longer-in-post/';
		$old_seo_link->id                  = 567;

		$this->expect_update_related_indexables( $indexable, [ $seo_link ], [ $old_seo_link ], [ 567 ] );

		// Inside update_related_indexables->update_incoming_links_for_related_indexables method.
		$this->seo_links_repository->expects( 'get_incoming_link_counts_for_indexable_ids' )
			->with( [ 2, 3 ] )
			->andReturn(
				[
					[
						'target_indexable_id' => 2,
						'incoming'            => 0,
					],
					[
						'target_indexable_id' => 3,
						'incoming'            => 0,
					],
				]
			);
		$this->indexable_repository->expects( 'update_incoming_link_count' )->once()->with( 2, 0 );
		$this->indexable_repository->expects( 'update_incoming_link_count' )->once()->with( 3, 0 );

		// Inside create_links->create_internal_link->enhance_link_from_indexable method.
		$this->indexable_repository->expects( 'find_by_permalink' )
			->once()
			->with( $target_indexable->permalink )
			->andReturn( null );
		$this->indexable_repository->expects( 'find_by_id_and_type' )
			->with( 3, 'post' )
			->andReturn( $target_indexable );

		// Inside create_links->create_internal_link->enhance_link_from_indexable->get_post_id method.
		Functions\expect( 'url_to_postid' )
			->with( $target_indexable->permalink )
			->andReturn( $target_indexable->object_id );

		Functions\expect( 'wp_cache_supports' )->once()->andReturnTrue();
		Functions\expect( 'wp_cache_flush_group' )->once()->andReturnTrue();

		$links = $this->instance->build( $indexable, $content );

		self::assertCount( 1, $links );
		self::assertEquals( $seo_link, $links[0] );
		self::assertEquals( $seo_link->target_indexable_id, $links[0]->target_indexable_id );
		self::assertEquals( $seo_link->target_post_id, $links[0]->target_post_id );
	}

	/**
	 * Tests the build method with no links.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_no_links() {
				$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'page';
		$indexable->permalink   = 'https://site.com/page';

		$this->indexable_helper->expects( 'should_index_indexable' )->once()->andReturn( true );
		$this->image_content_extractor->expects( 'gather_images' )->once()->andReturn( [] );

		$this->seo_links_repository
			->expects( 'find_all_by_indexable_id' )
			->with( $indexable->id )
			->once()
			->andReturn( [] );

		$this->assertSame( [], $this->instance->build( $indexable, '' ) );
	}

	/**
	 * Tests the build method when ignoring content scan.
	 *
	 * @covers ::build
	 * @covers ::gather_images
	 * @dataProvider provide_no_content_scan
	 *
	 * @param string $input_content The input content.
	 * @param array  $output_result The expected result.
	 *
	 * @return void
	 */
	public function test_build_ignore_content_scan( $input_content, $output_result ) {

		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'page';
		$indexable->permalink   = 'https://site.com/page';

		$this->indexable_helper->expects( 'should_index_indexable' )->once()->andReturn( true );
		$this->image_content_extractor->expects( 'gather_images' )->once()->andReturn( [] );

		Functions\expect( 'apply_filters' )->andReturn( true );

		$this->seo_links_repository
			->expects( 'find_all_by_indexable_id' )
			->with( $indexable->id )
			->once()
			->andReturn( [] );

		self::assertSame( $output_result, $this->instance->build( $indexable, $input_content ) );
	}

	/**
	 * Provides data for the test_build_ignore_content_scan test.
	 *
	 * @return Generator
	 */
	public static function provide_no_content_scan() {
		yield 'No content so no links' => [
			'input_content' => '',
			'output_result' => [],
		];

		yield 'Content but no links' => [
			'input_content' => 'something something no links',
			'output_result' => [],
		];
	}

	/**
	 * Expectation for update_related_indexables.
	 *
	 * @param object $indexable    The indexable object.
	 * @param array  $new_seo_link The new seo link.
	 * @param array  $old_seo_link The old seo link.
	 * @param array  $delete_ids   The delete ids.
	 *
	 * @return void
	 */
	public function expect_update_related_indexables( $indexable, $new_seo_link, $old_seo_link, $delete_ids ) {

		$this->seo_links_repository->expects( 'delete_all_by_post_id_where_indexable_id_null' )->once()->with( $indexable->object_id );
		$this->seo_links_repository->expects( 'delete_many_by_id' )->once()->with( $delete_ids );
		$this->expect_update_related_indexables_with_links_to_add( $indexable->id, $new_seo_link, $old_seo_link );
	}
}
