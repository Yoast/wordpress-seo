<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

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
		$this->options_helper       = Mockery::mock( Options_Helper::class );

		$this->instance = new Indexable_Link_Builder(
			$this->seo_links_repository,
			$this->url_helper,
			$this->post_helper,
			$this->options_helper
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

		$query_mock                    = Mockery::mock( ORM::class );
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

	/**
	 * Data provider for test_patch_seo_links;
	 *
	 * @return array $indexableId, $objectId, $links_times, $links.
	 */
	public function patch_seo_links_provider() {
		$object                                  = (object) [ 'type' => 'not SEO_Links' ];
		$seo_link                                = new SEO_Links_Mock();
		$seo_link->target_indexable_id           = null;
		$seo_link_not_empty                      = new SEO_Links_Mock();
		$seo_link_not_empty->target_indexable_id = 3;

		return [
			[ null, 1, 0, null, 0 ],
			[ 1, null, 0, null, 0 ],
			[ null, null, 0, null, 0 ],
			[ 1, 1, 1, [], 0 ],
			[ 1, 1, 1, [ $object ], 0 ],
			[ 1, 1, 1, [ $seo_link_not_empty ], 0 ],
			[ 1, 1, 1, [ $seo_link ], 1 ],
		];
	}

	/**
	 * Tests patch_seo_links
	 *
	 * @covers ::patch_seo_links
	 *
	 * @dataProvider patch_seo_links_provider
	 *
	 * @param int   $indexable_id The indexable id.
	 * @param int   $object_id   The object id.
	 * @param int   $links_times The number of times the find_all_by_target_post_id method should be called.
	 * @param array $links The links.
	 * @param int   $update_target_indexable_id_times The number of times the update_target_indexable_id method should be called.
	 */
	public function test_patch_seo_links( $indexable_id, $object_id, $links_times, $links, $update_target_indexable_id_times ) {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->id        = $indexable_id;
		$indexable->object_id = $object_id;

		$this->seo_links_repository
			->expects( 'find_all_by_target_post_id' )
			->with( $indexable->object_id )
			->times( $links_times )
			->andReturn( $links );

		$this->seo_links_repository
			->expects( 'update_target_indexable_id' )
			->times( $update_target_indexable_id_times );

		$this->seo_links_repository
			->expects( 'get_incoming_link_counts_for_indexable_ids' )
			->times( $update_target_indexable_id_times )
			->andReturn( [] );

			$this->instance->patch_seo_links( $indexable );
	}

	/**
	 * Tests the delete method.
	 *
	 * @covers ::delete
	 */
	public function test_delete() {
		$indexable     = Mockery::mock( Indexable_Mock::class );
		$indexable->id = 5;

		$this->seo_links_repository
			->expects( 'find_all_by_indexable_id' )
			->with( $indexable->id )
			->once()
			->andReturn( [] );

		$this->seo_links_repository
			->expects( 'delete_all_by_indexable_id' )
			->with( $indexable->id )
			->once();

		$this->instance->delete( $indexable );
	}

	/**
	 * Tests the delete method and update_incoming_links_for_related_indexables.
	 *
	 * @covers ::update_incoming_links_for_related_indexables
	 */
	public function test_delete_and_update_incoming_links_for_related_indexables() {
		$indexable                     = Mockery::mock( Indexable_Mock::class );
		$indexable->id                 = 5;
		$seo_link                      = new SEO_Links_Mock();
		$seo_link->target_indexable_id = 3;

		$this->seo_links_repository
			->expects( 'find_all_by_indexable_id' )
			->with( $indexable->id )
			->once()
			->andReturn( [ $seo_link ] );

		$this->seo_links_repository
			->expects( 'delete_all_by_indexable_id' )
			->with( $indexable->id )
			->once();

		$this->seo_links_repository
			->expects( 'get_incoming_link_counts_for_indexable_ids' )
			->with( [ 3 ] )
			->once()
			->andReturn(
				[
					[
						'target_indexable_id' => 3,
						'incoming'            => 7,
					],
				]
			);

		$this->indexable_repository
			->expects( 'update_incoming_link_count' )
			->with( 3, 7 )
			->once();

		$this->instance->delete( $indexable );
	}

	/**
	 * Tests the build method with no links.
	 *
	 * @covers ::build
	 */
	public function test_build_no_links() {

		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'page';
		$indexable->permalink   = 'https://site.com/page';

		$this->seo_links_repository
			->expects( 'find_all_by_indexable_id' )
			->with( $indexable->id )
			->once()
			->andReturn( [] );

		$this->assertSame( [], $this->instance->build( $indexable, '' ) );
	}

	/**
	 * Tests the build other cases.
	 *
	 * @covers ::create_internal_link
	 * @covers ::create_links
	 * @covers ::build
	 * @covers ::build_permalink
	 * @covers ::update_incoming_links_for_related_indexables
	 * @covers ::update_related_indexables
	 * @covers ::enhance_link_from_indexable
	 * @covers ::get_post_id
	 */
	public function test_build_create_internal_link() {

		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'page';
		$indexable->permalink   = 'https://site.com/page';

		$model = new SEO_Links_Mock();

		$model->type = SEO_Links::TYPE_INTERNAL_IMAGE;
		$orm_mock    = $this
			->getMockBuilder( ORM::class )
			->disableOriginalConstructor()
			->setMethods( [ 'create' ] )
			->getMock();


		Functions\stubs(
			[
				// Executed in build->create_links->create_internal_link.
				'home_url'       => 'http://basic.wordpress.test',

				// Executed in build->create_links->create_internal_link.
				'wp_parse_url'   => [
					'scheme' => 'http',
					'host'   => 'basic.wordpress.test',
				],

				// Executed in build->create_links->create_internal_link->build_permalink->get_permalink.
				'set_url_scheme' => 'http://basic.wordpress.test',
			]
		);

		// Executed in build->create_links->create_internal_link.
		$this->url_helper
			->expects( 'get_link_type' )
			->once()
			->andReturn( SEO_Links::TYPE_INTERNAL_IMAGE );

		// Executed in build->create_links->create_internal_link.
		$this->seo_links_repository
			->expects( 'query' )
			->once()
			->andReturn( $orm_mock );

		// Executed in build->create_links->create_internal_link.
		$orm_mock->expects( $this->once() )
			->method( 'create' )
			->will( $this->returnValue( $model ) );

		// Executed in build->create_links->create_internal_link->build_permalink.
		$this->url_helper
			->expects( 'is_relative' )
			->once()
			->andReturn( true );

		// Executed in build->create_links->create_internal_link->build_permalink.
		$this->url_helper
			->expects( 'ensure_absolute_url' )
			->once()
			->andReturn( 'http://basic.wordpress.test' );

		// Executed in build->create_links->create_internal_link.
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'disable-attachment' )
			->andReturn( false );


		// Executed in build->create_links->create_internal_link->enhance_link_from_indexable.
		$this->indexable_repository
			->expects( 'find_by_permalink' )
			->once()
			->with( 'http://basic.wordpress.test' )
			->andReturn( false );

		// Executed in build->create_links->create_internal_link->enhance_link_from_indexable->get_post_id.
		$this->image_helper
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'http://basic.wordpress.test' )
			->andReturn( 0 );

		// Executed in build->update_related_indexables.
		$this->seo_links_repository
			->expects( 'find_all_by_indexable_id' )
			->with( $indexable->id )
			->once()
			->andReturn( [] );

		// Executed in build->update_related_indexables.
		$this->seo_links_repository
			->expects( 'insert_many' )
			->once()
			->with( [ $model ] );

		$this->assertSame( [ $model ], $this->instance->build( $indexable, '<img width="640" height="480" src="http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg?quality=90&amp;grain=0.5" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy" srcset="http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg 640w, http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8-300x225.jpg 300w" sizes="(max-width: 640px) 100vw, 640px">' ) );
	}
}
