<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\SEO_Links_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Link_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Link_Builder
 */
class Indexable_Link_Builder_Test extends TestCase {

	/**
	 * The SEO links repository.
	 *
	 * @var Mockery\MockInterface|SEO_Links_Repository
	 */
	protected $seo_links_repository;

	/**
	 * The url helper.
	 *
	 * @var Mockery\MockInterface|Url_Helper
	 */
	protected $url_helper;

	/**
	 * The image helper.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image_helper;

	/**
	 * The post helper.
	 *
	 * @var Mockery\MockInterface|Post_Helper
	 */
	protected $post_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The test instance.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $instance;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->seo_links_repository = Mockery::mock( SEO_Links_Repository::class );
		$this->url_helper           = Mockery::mock( Url_Helper::class );
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->image_helper         = Mockery::mock( Image_Helper::class );
		$this->post_helper          = Mockery::mock( Post_Helper::class );

		$this->instance = new Indexable_Link_Builder(
			$this->seo_links_repository,
			$this->url_helper,
			$this->post_helper
		);
		$this->instance->set_dependencies( $this->indexable_repository, $this->image_helper );

		Functions\expect( 'wp_list_pluck' )->andReturnUsing(
			static function ( $haystack, $prop ) {
				return \array_map(
					static function ( $e ) use ( $prop ) {
						return $e->{$prop};
					},
					$haystack
				);
			}
		);
	}

	/**
	 * Tests the build function.
	 *
	 * @covers ::__construct
	 * @covers ::set_dependencies
	 * @covers ::build
	 *
	 * @dataProvider build_provider
	 *
	 * @param string $content   The content.
	 * @param string $link_type The link type.
	 * @param bool   $is_image  Whether or not the link is an image.
	 */
	public function test_build( $content, $link_type, $is_image ) {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'post';
		$indexable->permalink   = 'https://site.com/page';

		$this->post_helper->expects( 'get_post' )->once()->with( 2 )->andReturn( 'post' );
		Functions\expect( 'setup_postdata' )->once()->with( 'post' );
		Filters\expectApplied( 'the_content' )->with( $content )->andReturnFirstArg();
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

		Functions\expect( 'home_url' )->once()->andReturn( 'https://site.com' );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://site.com' )->andReturn( $parsed_home_url );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://site.com/page' )->andReturn( $parsed_page_url );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://link.com/newly-added-in-post' )->andReturn( $parsed_new_link_url );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://link.com/already-existed-in-post' )->andReturn( $parsed_existing_link_url );

		$this->url_helper->expects( 'get_link_type' )->with( $parsed_new_link_url, $parsed_home_url, $is_image )->andReturn( $link_type );
		$this->url_helper->expects( 'get_link_type' )->with( $parsed_existing_link_url, $parsed_home_url, $is_image )->andReturn( $link_type );

		$query_mock                 = Mockery::mock();
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
		$this->seo_links_repository->expects( 'find_all_by_indexable_id' )->once()->with( $indexable->id )->andReturn( [ $old_seo_link, $existing_seo_link ] );
		$this->seo_links_repository->expects( 'delete_many_by_id' )->once()->with( [ 567 ] );
		$this->seo_links_repository->expects( 'delete_all_by_post_id_where_indexable_id_null' )->once()->with( $indexable->object_id );
		$this->seo_links_repository->expects( 'insert_many' )->once()->with( [ $new_seo_link ] );
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

		$this->post_helper->expects( 'get_post' )->once()->with( 2 )->andReturn( 'post' );
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

		$query_mock                    = Mockery::mock();
		$seo_link                      = Mockery::mock( SEO_Links_Mock::class );
		$seo_link->type                = $link_type;
		$seo_link->url                 = $target_indexable->permalink;
		$seo_link->indexable_id        = $indexable->id;
		$seo_link->post_id             = $indexable->object_id;
		$seo_link->target_indexable_id = $target_indexable->id;
		$seo_link->target_post_id      = $target_indexable->object_id;

		$this->seo_links_repository->expects( 'query' )->once()->andReturn( $query_mock );
		$this->seo_links_repository->expects( 'delete_many_by_id' )->once()->with( [ 567 ] );
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
		$this->seo_links_repository->expects( 'find_all_by_indexable_id' )->once()->with( $indexable->id )->andReturn( [ $old_seo_link ] );
		$this->seo_links_repository->expects( 'delete_all_by_post_id_where_indexable_id_null' )->once()->with( $indexable->object_id );
		$this->seo_links_repository->expects( 'insert_many' )->once()->with( [ $seo_link ] );
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
		$this->indexable_repository->expects( 'find_by_permalink' )
			->once()
			->with( $target_indexable->permalink )
			->andReturn( null );
		$this->indexable_repository->expects( 'find_by_id_and_type' )
			->with( 3, 'post' )
			->andReturn( $target_indexable );

		Functions\expect( 'url_to_postid' )
			->with( $target_indexable->permalink )
			->andReturn( $target_indexable->object_id );

		$links = $this->instance->build( $indexable, $content );

		self::assertCount( 1, $links );
		self::assertEquals( $seo_link, $links[0] );
		self::assertEquals( $seo_link->target_indexable_id, $links[0]->target_indexable_id );
		self::assertEquals( $seo_link->target_post_id, $links[0]->target_post_id );
	}

	/**
	 * Data provider to test the build.
	 *
	 * @return array The test data.
	 */
	public function build_provider() {
		return [
			[
				'
					<a href="https://link.com/newly-added-in-post">link</a>
					<a href="https://link.com/already-existed-in-post">link</a>
				',
				SEO_Links::TYPE_EXTERNAL,
				false,
			],
			[
				'
					<img src="https://link.com/newly-added-in-post" />
					<img src="https://link.com/already-existed-in-post" />
				',
				SEO_Links::TYPE_EXTERNAL_IMAGE,
				true,
			],
		];
	}
}
