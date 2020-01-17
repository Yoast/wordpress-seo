<?php

namespace Yoast\WP\SEO\Tests\Frontend\Schema;

use Brain\Monkey;
use Mockery;
use WP_Post;
use WPSEO_Schema_Context;
use WPSEO_Schema_WebPage;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class WPSEO_Schema_HowTo_Test.
 *
 * @group schema
 *
 * @package Yoast\Tests\Frontend\Schema
 */
class Schema_WebPage_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var \WPSEO_Schema_WebPage
	 */
	private $instance;

	/**
	 * The schema context.
	 *
	 * @var \WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * Test setup.
	 */
	public function setUp() {
		parent::setUp();

		Monkey\Functions\stubs(
			[
				'get_bloginfo'  => [ $this, 'get_bloginfo' ],
				'is_search'     => false,
				'is_author'     => false,
				'is_home'       => false,
				'is_archive'    => false,
				'is_front_page' => false,
				'is_singular'   => false,
			]
		);

		$this->context = Mockery::mock( WPSEO_Schema_Context::class )->makePartial();

		$this->context->id        = 1;
		$this->context->title     = 'title';
		$this->context->canonical = 'example.com';

		$this->instance = new WPSEO_Schema_WebPage( $this->context );
	}

	/**
	 * Mock for get_bloginfo.
	 *
	 * @param string $type Blog info type.
	 *
	 * @return mixed Mocked get_bloginfo return value.
	 */
	public function get_bloginfo( $type ) {
		switch ( $type ) {
			case 'language':
				return 'en-US';
			default:
				return null;
		}
	}

	/**
	 * Tests if the WebPage type is CollectionPage if a static posts page is opened.
	 *
	 * @covers \WPSEO_Schema_WebPage::generate
	 * @covers \WPSEO_Schema_WebPage::add_breadcrumbs
	 * @covers \WPSEO_Schema_WebPage::determine_page_type
	 * @covers \WPSEO_Frontend_Page_Type::is_posts_page
	 */
	public function test_schema_output_type_is_collection_page_on_static_posts_page() {
		Monkey\Functions\stubs( [ 'is_home' => true ] );

		Monkey\Functions\expect( 'get_option' )
			->with( 'show_on_front' )
			->andReturn( 'page' );

		$actual = $this->instance->generate();

		$expected = 'CollectionPage';

		$this->assertEquals( $actual['@type'], $expected );
	}

	/**
	 * Tests if the WebPage type is CollectionPage if the homepage is set to display posts.
	 *
	 * @covers \WPSEO_Schema_WebPage::generate
	 * @covers \WPSEO_Schema_WebPage::add_breadcrumbs
	 * @covers \WPSEO_Schema_WebPage::determine_page_type
	 * @covers \WPSEO_Frontend_Page_Type::is_posts_page
	 * @covers \WPSEO_Frontend_Page_Type::is_home_posts_page
	 */
	public function test_schema_output_type_is_collection_page_on_homepage_with_posts() {
		Monkey\Functions\stubs( [ 'is_home' => true ] );

		Monkey\Functions\expect( 'get_option' )
			->with( 'show_on_front' )
			->andReturn( 'posts' );

		$actual = $this->instance->generate();

		$expected = 'CollectionPage';

		$this->assertEquals( $actual['@type'], $expected );
	}

	/**
	 * Tests if no author is set for a page.
	 *
	 * @covers \WPSEO_Schema_WebPage::generate
	 * @covers \WPSEO_Schema_WebPage::add_breadcrumbs
	 * @covers \WPSEO_Schema_WebPage::determine_page_type
	 * @covers \WPSEO_Frontend_Page_Type::is_posts_page
	 * @covers \WPSEO_Frontend_Page_Type::is_home_posts_page
	 */
	public function test_do_not_add_author_for_page() {
		Monkey\Functions\stubs( [ 'is_singular' => true ] );

		$this->context->site_represents = false;

		$post                    = Mockery::mock( 'WP_Post' );
		$post->post_date_gmt     = '0000-00-00 00:00:00';
		$post->post_modified_gmt = '0000-00-00 00:00:00';

		Monkey\Functions\expect( 'get_post' )
			->andReturn( $post );

		Monkey\Functions\expect( 'get_post_type' )
			->andReturn( 'page' );

		$actual = $this->instance->generate();

		$this->assertArrayNotHasKey( 'author', $actual );
	}

	/**
	 * Tests if an author is set for a post when the site is not represented.
	 *
	 * @covers \WPSEO_Schema_WebPage::generate
	 * @covers \WPSEO_Schema_WebPage::add_breadcrumbs
	 * @covers \WPSEO_Schema_WebPage::determine_page_type
	 * @covers \WPSEO_Frontend_Page_Type::is_posts_page
	 * @covers \WPSEO_Frontend_Page_Type::is_home_posts_page
	 * @covers \WPSEO_Schema_WebPage::add_author
	 */
	public function test_add_author_for_post() {
		Monkey\Functions\stubs( [ 'is_singular' => true ] );

		$this->context->site_represents = false;

		$post                    = Mockery::mock( 'WP_Post' );
		$post->post_date_gmt     = '0000-00-00 00:00:00';
		$post->post_modified_gmt = '0000-00-00 00:00:00';
		$post->post_author       = 'author';

		Monkey\Functions\expect( 'get_post' )
			->andReturn( $post );

		Monkey\Functions\expect( 'get_post_type' )
			->andReturn( 'post' );

		Monkey\Functions\expect( 'get_userdata' )
			->andReturn( (object) [ 'user_login' => 'user_login' ] );

		Monkey\Functions\expect( 'wp_hash' )
			->andReturn( 'user_hash' );

		$actual = $this->instance->generate();

		$this->assertArrayHasKey( 'author', $actual );
	}

	/**
	 * Tests if the add_author adds the author when the site is not represented.
	 *
	 * @covers \WPSEO_Schema_WebPage::add_author
	 */
	public function test_add_author() {
		$post              = Mockery::mock( WP_Post::class )->makePartial();
		$post->post_author = 'author';

		$this->context->site_represents = false;

		Monkey\Functions\expect( 'get_userdata' )
			->andReturn( (object) [ 'user_login' => 'user_login' ] );

		Monkey\Functions\expect( 'wp_hash' )
			->andReturn( 'user_hash' );

		$data = $this->instance->add_author( [], $post );

		$this->assertArrayHasKey( 'author', $data );
	}

	/**
	 * Tests that add_author does not add the author when the site is represented.
	 *
	 * @covers \WPSEO_Schema_WebPage::add_author
	 */
	public function test_do_not_add_author() {
		$post              = Mockery::mock( WP_Post::class )->makePartial();
		$post->post_author = 'author';

		$this->context->site_represents = true;

		Monkey\Functions\expect( 'get_userdata' )
			->andReturn( (object) [ 'user_login' => 'user_login' ] );

		Monkey\Functions\expect( 'wp_hash' )
			->andReturn( 'user_hash' );

		$data = $this->instance->add_author( [], $post );

		$this->assertArrayNotHasKey( 'author', $data );
	}

	/**
	 * Tests if the description in the schema output gets stripped from script tags.
	 *
	 * @covers \WPSEO_Schema_WebPage::generate
	 */
	public function test_schema_output_strips_script_tags_from_description() {
		$this->context->description = '<script>this is a malicious script</script>';

		$actual = $this->instance->generate();

		$expected = 'this is a malicious script';

		$this->assertEquals( $actual['description'], $expected );
	}

	/**
	 * Tests if the description in the schema output gets stripped from script tags.
	 *
	 * @covers \WPSEO_Schema_WebPage::generate
	 */
	public function test_schema_output_leaves_h1_tags_in_description() {
		$this->context->description = '<h1>this is a title</h1>';

		$actual = $this->instance->generate();

		$expected = '<h1>this is a title</h1>';

		$this->assertEquals( $actual['description'], $expected );
	}
}
