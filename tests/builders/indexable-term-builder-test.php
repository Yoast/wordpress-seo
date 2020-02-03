<?php

namespace Yoast\WP\SEO\Tests\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\ORM\ORMWrapper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Term_Test.
 *
 * @group indexables
 * @group formatters
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Term_Builder
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Builders
 */
class Indexable_Term_Builder_Test extends TestCase {

	/**
	 * Options being mocked.
	 *
	 * @var array
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_titles', 'wpseo_social', 'wpseo_ms' ];

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		Monkey\Functions\expect( 'get_term' )->once()->with( 1 )->andReturn( (object) [ 'taxonomy' => 'category' ] );
		Monkey\Functions\expect( 'get_term_by' )->once()->with( 'id', 1, 'category' )->andReturn( (object) [ 'term_id' => 1 ] );
		Monkey\Functions\expect( 'get_term_link' )->once()->with( 1, 'category' )->andReturn( 'https://example.org/category/1' );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'wpseo_taxonomy_meta' )->andReturn(
			[
				'category' => [
					1 => [
						'wpseo_focuskw'               => 'focuskeyword',
						'wpseo_linkdex'               => '75',
						'wpseo_noindex'               => 'noindex',
						'wpseo_meta-robots-adv'       => '',
						'wpseo_content_score'         => '50',
						'wpseo_canonical'             => 'https://canonical-term',
						'wpseo_meta-robots-nofollow'  => '1',
						'wpseo_title'                 => 'title',
						'wpseo_desc'                  => 'description',
						'wpseo_bctitle'               => 'breadcrumb_title',
						'wpseo_opengraph-title'       => 'og_title',
						'wpseo_opengraph-image'       => 'og_image',
						'wpseo_opengraph-description' => 'og_description',
						'wpseo_twitter-title'         => 'twitter_title',
						'wpseo_twitter-image'         => 'twitter_image',
						'wpseo_twitter-description'   => 'twitter_description',
					],
				],
			]
		);

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORMWrapper::class );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://example.org/category/1' );
		$indexable_mock->orm->expects( 'set' )->with( 'canonical', 'https://canonical-term' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_sub_type', 'category' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'title' );
		$indexable_mock->orm->expects( 'set' )->with( 'breadcrumb_title', 'breadcrumb_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'description', 'description' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_title', 'og_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image', 'og_image' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_description', 'og_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_title', 'twitter_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'twitter_image' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_description', 'twitter_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_cornerstone', false );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', true );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nofollow', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noarchive', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noimageindex', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nosnippet', null );
		$indexable_mock->orm->expects( 'set' )->with( 'primary_focus_keyword', 'focuskeyword' );
		$indexable_mock->orm->expects( 'set' )->with( 'primary_focus_keyword_score', 75 );
		$indexable_mock->orm->expects( 'set' )->with( 'readability_score', 50 );

		$builder = new Indexable_Term_Builder();
		$builder->build( 1, $indexable_mock );
	}
}
