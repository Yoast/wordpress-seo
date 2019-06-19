<?php
namespace Yoast\WP\Free\Tests\Frontend\Schema;

use Yoast\WP\Free\Tests\TestCase;
use \WPSEO_Schema_WebPage;
use \WPSEO_Schema_Context;
use \Mockery;
use Brain\Monkey;

/**
* Class WPSEO_Schema_HowTo_Test.
*
* @group schema
*
* @package Yoast\Tests\Frontend\Schema
*/
class WPSEO_Schema_WebPage_Test extends TestCase {
	/**
	 * @var \WPSEO_Schema_WebPage
	 */
	private $instance;

	/**
	 * Test setup.
	 */
	public function setUp() {
		parent::setUp();

		Monkey\Functions\stubs( [
			'get_bloginfo'  => array( $this, 'get_bloginfo' ),
			'is_search'     => false,
			'is_author'     => false,
			'is_home'       => false,
			'is_archive'    => false,
			'is_front_page' => false,
			'is_singular'   => false,
		] );

		$context = Mockery::mock( WPSEO_Schema_Context::class )->makePartial();

		$context->title     = 'title';
		$context->canonical = 'example.com';

		$this->instance = new WPSEO_Schema_WebPage( $context );
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
		Monkey\Functions\stubs( [
			'is_home' => true,
		] );

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
		Monkey\Functions\stubs( [
			'is_home' => true,
		] );

		Monkey\Functions\expect( 'get_option' )
			->with( 'show_on_front' )
			->andReturn( 'posts' );

		$actual = $this->instance->generate();

		$expected = 'CollectionPage';

		$this->assertEquals( $actual['@type'], $expected );
	}
}
