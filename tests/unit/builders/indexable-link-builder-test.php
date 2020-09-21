<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Image_Helper;
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
	 * @var SEO_Links_Repository
	 */
	protected $seo_links_repository;

	/**
	 * The url helper.
	 *
	 * @var Url_Helper
	 */
	protected $url_helper;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
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
	public function setUp() {
		parent::setUp();

		$this->seo_links_repository = Mockery::mock( SEO_Links_Repository::class );
		$this->url_helper           = Mockery::mock( Url_Helper::class );
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->image_helper         = Mockery::mock( Image_Helper::class );

		$this->instance = new Indexable_Link_Builder( $this->seo_links_repository, $this->url_helper );
		$this->instance->set_dependencies( $this->indexable_repository, $this->image_helper );
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

		Filters\expectApplied( 'the_content' )->with( $content )->andReturnFirstArg();

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
		];

		Functions\expect( 'home_url' )->once()->andReturn( 'https://site.com' );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://site.com' )->andReturn( $parsed_home_url );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://site.com/page' )->andReturn( $parsed_page_url );
		Functions\expect( 'wp_parse_url' )->once()->with( 'https://link.com' )->andReturn( $parsed_link_url );

		$this->url_helper->expects( 'get_link_type' )->with( $parsed_link_url, $parsed_home_url, $is_image )->andReturn( $link_type );

		$query_mock             = Mockery::mock();
		$seo_link               = Mockery::mock( SEO_Links_Mock::class );
		$seo_link->type         = $link_type;
		$seo_link->url          = 'https://link.com';
		$seo_link->indexable_id = $indexable->id;
		$seo_link->post_id      = $indexable->object_id;

		$this->seo_links_repository->expects( 'query' )->once()->andReturn( $query_mock );
		$query_mock->expects( 'create' )->once()->with(
			[
				'url'          => 'https://link.com',
				'type'         => $link_type,
				'indexable_id' => $indexable->id,
				'post_id'      => $indexable->object_id,
			]
		)->andReturn( $seo_link );

		$old_seo_link                      = new SEO_Links_Mock();
		$old_seo_link->target_indexable_id = 3;
		$this->seo_links_repository->expects( 'find_all_by_indexable_id' )->once()->with( $indexable->id )->andReturn( [ $old_seo_link ] );
		$this->seo_links_repository->expects( 'delete_all_by_indexable_id' )->once()->with( $indexable->id );
		$this->seo_links_repository->expects( 'delete_all_by_post_id' )->once()->with( $indexable->object_id );
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

		$seo_link->expects( 'save' )->once();

		$links = $this->instance->build( $indexable, $content );

		$this->assertEquals( 1, \count( $links ) );
		$this->assertEquals( $seo_link, $links[0] );
	}

	/**
	 * Tests the build function for an internal link when the target indexable does not exist yet.
	 *
	 * @covers ::__construct
	 * @covers ::set_dependencies
	 * @covers ::build
	 */
	public function test_build_target_indexable_does_not_exist() {
		$content   = '<a href="https://site.com/target">link</a>';
		$link_type = SEO_Links::TYPE_INTERNAL;

		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'post';
		$indexable->permalink   = 'https://site.com/page';

		$target_indexable              = Mockery::mock( Indexable_Mock::class );
		$target_indexable->id          = 2;
		$target_indexable->object_id   = 3;
		$target_indexable->object_type = 'post';
		$target_indexable->permalink   = 'https://site.com/target';
		$target_indexable->language    = 'nl';
		$target_indexable->region      = 'NL';

		Filters\expectApplied( 'the_content' )->with( $content )->andReturnFirstArg();

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

		$query_mock                    = Mockery::mock();
		$seo_link                      = Mockery::mock( SEO_Links_Mock::class );
		$seo_link->type                = $link_type;
		$seo_link->url                 = $target_indexable->permalink;
		$seo_link->indexable_id        = $indexable->id;
		$seo_link->post_id             = $indexable->object_id;
		$seo_link->target_indexable_id = $target_indexable->id;
		$seo_link->target_post_id      = $target_indexable->object_id;

		$this->seo_links_repository->expects( 'query' )->once()->andReturn( $query_mock );
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
		$this->seo_links_repository->expects( 'find_all_by_indexable_id' )->once()->with( $indexable->id )->andReturn( [ $old_seo_link ] );
		$this->seo_links_repository->expects( 'delete_all_by_indexable_id' )->once()->with( $indexable->id );
		$this->seo_links_repository->expects( 'delete_all_by_post_id' )->once()->with( $indexable->object_id );
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

		$seo_link->expects( 'save' )->once();

		$links = $this->instance->build( $indexable, $content );

		$this->assertCount( 1, $links );
		$this->assertEquals( $seo_link, $links[0] );
		$this->assertEquals( $seo_link->target_indexable_id, $links[0]->target_indexable_id );
		$this->assertEquals( $seo_link->target_post_id, $links[0]->target_post_id );
	}

	/**
	 * Data provider to test the build.
	 *
	 * @return array The test data.
	 */
	public function build_provider() {
		return [
			[ '<a href="https://link.com">link</a>', SEO_Links::TYPE_EXTERNAL, false ],
			[ '<img src="https://link.com" />', SEO_Links::TYPE_EXTERNAL_IMAGE, true ],
		];
	}
}
