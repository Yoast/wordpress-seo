<?php

namespace Yoast\WP\Free\Tests\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\Free\Builders\Indexable_Author_Builder
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Builders
 */
class Indexable_Home_Page_Builder_Test extends TestCase {

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$options_helper_mock = Mockery::mock( Options_Helper::class );
		$options_helper_mock->expects( 'get' )->with( 'title-home-wpseo' )->andReturn( 'home_title' );
		$options_helper_mock->expects( 'get' )->with( 'breadcrumbs-home' )->andReturn( 'home_breadcrumb_title' );
		$options_helper_mock->expects( 'get' )->with( 'metadesc-home-wpseo' )->andReturn( 'home_meta_description' );
		$options_helper_mock->expects( 'get' )->with( 'og_frontpage_title' )->andReturn( 'home_og_title' );
		$options_helper_mock->expects( 'get' )->with( 'og_frontpage_desc' )->andReturn( 'home_og_description' );
		$options_helper_mock->expects( 'get' )->with( 'og_frontpage_image' )->andReturn( 'home_og_image' );

		$url_helper_mock = Mockery::mock( Url_Helper::class );
		$url_helper_mock->expects( 'home' )->once()->with()->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'blog_public' )->andReturn( '1' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORMWrapper::class );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'home-page' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'home_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'breadcrumb_title', 'home_breadcrumb_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://permalink' );
		$indexable_mock->orm->expects( 'get' )->with( 'permalink' )->andReturn( 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'canonical', 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'description', 'home_meta_description' );
		$indexable_mock->orm->expects( 'offsetExists' )->with( 'description' )->andReturn( true );
		$indexable_mock->orm->expects( 'get' )->with( 'description' )->andReturn( 'home_meta_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', false );
		$indexable_mock->orm->expects( 'set' )->with( 'og_title', 'home_og_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image', 'home_og_image' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_description', 'home_og_description' );

		$builder = new Indexable_Home_Page_Builder( $options_helper_mock, $url_helper_mock );
		$builder->build( $indexable_mock );
	}

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build_with_fallback_description() {
		$options_helper_mock = Mockery::mock( Options_Helper::class );
		$options_helper_mock->expects( 'get' )->with( 'title-home-wpseo' )->andReturn( 'home_title' );
		$options_helper_mock->expects( 'get' )->with( 'breadcrumbs-home' )->andReturn( 'home_breadcrumb_title' );
		$options_helper_mock->expects( 'get' )->with( 'metadesc-home-wpseo' )->andReturn( false );
		$options_helper_mock->expects( 'get' )->with( 'og_frontpage_title' )->andReturn( 'home_og_title' );
		$options_helper_mock->expects( 'get' )->with( 'og_frontpage_desc' )->andReturn( 'home_og_description' );
		$options_helper_mock->expects( 'get' )->with( 'og_frontpage_image' )->andReturn( 'home_og_image' );

		$url_helper_mock = Mockery::mock( Url_Helper::class );
		$url_helper_mock->expects( 'home' )->once()->with()->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'blog_public' )->andReturn( '1' );
		Monkey\Functions\expect( 'get_bloginfo' )->once()->with( 'description' )->andReturn( 'fallback_description' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORMWrapper::class );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'home-page' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'home_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'breadcrumb_title', 'home_breadcrumb_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://permalink' );
		$indexable_mock->orm->expects( 'get' )->with( 'permalink' )->andReturn( 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'canonical', 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'description', null );
		$indexable_mock->orm->expects( 'offsetExists' )->with( 'description' )->andReturn( false );
		$indexable_mock->orm->expects( 'set' )->with( 'description', 'fallback_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', false );
		$indexable_mock->orm->expects( 'set' )->with( 'og_title', 'home_og_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image', 'home_og_image' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_description', 'home_og_description' );

		$builder = new Indexable_Home_Page_Builder( $options_helper_mock, $url_helper_mock );
		$builder->build( $indexable_mock );
	}
}
