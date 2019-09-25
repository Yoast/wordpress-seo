<?php

namespace Yoast\WP\Free\Tests\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Builders\Indexable_Home_Page_Builder;
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
	 * Options being mocked.
	 *
	 * @var array
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_taxonomy_meta', 'wpseo_ms' ];

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		Monkey\Functions\expect( 'get_option' )->with( 'wpseo_titles' )->andReturn( [
			'title-home-wpseo'    => 'home_title',
			'breadcrumbs-home'    => 'home_breadcrumb_title',
			'metadesc-home-wpseo' => 'home_meta_description',
		] );
		Monkey\Functions\expect( 'get_option' )->with( 'wpseo_social' )->andReturn( [
			'og_frontpage_title' => 'home_og_title',
			'og_frontpage_desc'  => 'home_og_description',
			'og_frontpage_image' => 'home_og_image',
		] );
		Monkey\Functions\expect( 'home_url' )->once()->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'wp_parse_url' )->once()->with( 'https://permalink', PHP_URL_PATH )->andReturn( '/' );
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

		$builder = new Indexable_Home_Page_Builder();
		$builder->build( $indexable_mock );
	}

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build_with_fallback_description() {
		Monkey\Functions\expect( 'get_option' )->with( 'wpseo_titles' )->andReturn( [
			'title-home-wpseo'    => 'home_title',
			'breadcrumbs-home'    => 'home_breadcrumb_title',
		] );
		Monkey\Functions\expect( 'get_option' )->with( 'wpseo_social' )->andReturn( [
			'og_frontpage_title' => 'home_og_title',
			'og_frontpage_desc'  => 'home_og_description',
			'og_frontpage_image' => 'home_og_image',
		] );
		Monkey\Functions\expect( 'home_url' )->once()->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'wp_parse_url' )->once()->with( 'https://permalink', PHP_URL_PATH )->andReturn( '/' );
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

		$builder = new Indexable_Home_Page_Builder();
		$builder->build( $indexable_mock );
	}
}
