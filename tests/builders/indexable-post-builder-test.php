<?php

namespace Yoast\WP\SEO\Tests\Builders;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\ORM\ORMWrapper;
use Yoast\WP\SEO\Repositories\SEO_Meta_Repository;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Post_Test.
 *
 * @group indexables
 * @group formatters
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Post_Builder
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Builder_Test extends TestCase {

	/**
	 * Tests building a basic post indexable from postmeta.
	 *
	 * @covers ::__construct
	 * @covers ::build
	 */
	public function test_build() {
		Monkey\Functions\expect( 'get_permalink' )->once()->with( 1 )->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'get_post_type' )->once()->with( 1 )->andReturn( 'post' );
		Monkey\Functions\expect( 'get_post_custom' )->with( 1 )->andReturn(
			[
				'_yoast_wpseo_focuskw'               => [ 'focuskeyword' ],
				'_yoast_wpseo_linkdex'               => [ '100' ],
				'_yoast_wpseo_is_cornerstone'        => [ '1' ],
				'_yoast_wpseo_meta-robots-noindex'   => [ '1' ],
				'_yoast_wpseo_meta-robots-adv'       => [ '' ],
				'_yoast_wpseo_content_score'         => [ '50' ],
				'_yoast_wpseo_canonical'             => [ 'https://canonical' ],
				'_yoast_wpseo_meta-robots-nofollow'  => [ '1' ],
				'_yoast_wpseo_title'                 => [ 'title' ],
				'_yoast_wpseo_metadesc'              => [ 'description' ],
				'_yoast_wpseo_bctitle'               => [ 'breadcrumb_title' ],
				'_yoast_wpseo_opengraph-title'       => [ 'og_title' ],
				'_yoast_wpseo_opengraph-image'       => [ 'og_image' ],
				'_yoast_wpseo_opengraph-description' => [ 'og_description' ],
				'_yoast_wpseo_twitter-title'         => [ 'twitter_title' ],
				'_yoast_wpseo_twitter-image'         => [ 'twitter_image' ],
				'_yoast_wpseo_twitter-description'   => [ 'twitter_description' ],
			]
		);
		Monkey\Functions\expect( 'maybe_unserialize' )->andReturnFirstArg();

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORMWrapper::class );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'canonical', 'https://canonical' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_sub_type', 'post' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'title' );
		$indexable_mock->orm->expects( 'set' )->with( 'breadcrumb_title', 'breadcrumb_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'description', 'description' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_title', 'og_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image', 'og_image' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_description', 'og_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_title', 'twitter_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'twitter_image' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_description', 'twitter_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_cornerstone', true );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', true );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nofollow', true );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noarchive', false );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noimageindex', false );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nosnippet', false );
		$indexable_mock->orm->expects( 'set' )->with( 'primary_focus_keyword', 'focuskeyword' );
		$indexable_mock->orm->expects( 'set' )->with( 'primary_focus_keyword_score', 100 );
		$indexable_mock->orm->expects( 'set' )->with( 'readability_score', 50 );
		$indexable_mock->orm->expects( 'set' )->with( 'link_count', 5 );
		$indexable_mock->orm->expects( 'set' )->with( 'incoming_link_count', 2 );

		$seo_meta_repository = Mockery::mock( SEO_Meta_Repository::class );
		$seo_meta_repository->expects( 'find_by_post_id' )->once()->with( 1 )->andReturn(
			(object) [
				'internal_link_count' => 5,
				'incoming_link_count' => 2,
			]
		);

		$builder = new Indexable_Post_Builder( $seo_meta_repository );
		$builder->build( 1, $indexable_mock );
	}
}
