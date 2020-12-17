<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Class Current_Page_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Current_Page_Helper
 */
class Current_Page_Helper_Test extends TestCase {

	/**
	 * Query wrapper instance.
	 *
	 * @var WP_Query_Wrapper|Mockery\MockInterface
	 */
	private $wp_query_wrapper;

	/**
	 * The 'wp_query' instance.
	 *
	 * @var Mockery\MockInterface
	 */
	private $wp_query;

	/**
	 * Current page helper instance.
	 *
	 * @var Current_Page_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->wp_query_wrapper = Mockery::mock( WP_Query_Wrapper::class );
		$this->wp_query         = Mockery::mock();

		$this->instance = Mockery::mock( Current_Page_Helper::class, [ $this->wp_query_wrapper ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests that get_non_cached_date_archive_permalink calls the expected methods on a day archive.
	 *
	 * @covers ::get_non_cached_date_archive_permalink
	 */
	public function test_get_non_cached_date_archive_permalink_day() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->expects( 'is_day' )->once()->andReturnTrue();
		$wp_query->expects( 'is_month' )->once()->andReturnFalse();
		$wp_query->expects( 'is_year' )->once()->andReturnFalse();
		$wp_query->expects( 'get' )->with( 'year' )->once()->andReturn( '2019' );
		$wp_query->expects( 'get' )->with( 'monthnum' )->once()->andReturn( '10' );
		$wp_query->expects( 'get' )->with( 'day' )->once()->andReturn( '23' );

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		Monkey\Functions\expect( 'get_day_link' )
			->withArgs( [ 2019, 10, 23 ] )
			->andReturn( 'https://2019/10/23' );

		$this->assertEquals( 'https://2019/10/23', $this->instance->get_non_cached_date_archive_permalink() );
	}

	/**
	 * Tests that get_non_cached_date_archive_permalink calls the expected methods on a month archive.
	 *
	 * @covers ::get_non_cached_date_archive_permalink
	 */
	public function test_get_non_cached_date_archive_permalink_month() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->expects( 'is_day' )->once()->andReturnFalse();
		$wp_query->expects( 'is_month' )->once()->andReturnTrue();
		$wp_query->expects( 'is_year' )->once()->andReturnFalse();
		$wp_query->expects( 'get' )->with( 'year' )->once()->andReturn( '2019' );
		$wp_query->expects( 'get' )->with( 'monthnum' )->once()->andReturn( '10' );

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		Monkey\Functions\expect( 'get_month_link' )
			->withArgs( [ 2019, 10 ] )
			->andReturn( 'https://2019/10' );

		$this->assertEquals( 'https://2019/10', $this->instance->get_non_cached_date_archive_permalink() );
	}

	/**
	 * Tests that get_non_cached_date_archive_permalink calls the expected methods on a year archive.
	 *
	 * @covers ::get_non_cached_date_archive_permalink
	 */
	public function test_get_non_cached_date_archive_permalink_year() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->expects( 'is_day' )->once()->andReturnFalse();
		$wp_query->expects( 'is_month' )->once()->andReturnFalse();
		$wp_query->expects( 'is_year' )->once()->andReturnTrue();
		$wp_query->expects( 'get' )->with( 'year' )->once()->andReturn( '2019' );

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		Monkey\Functions\expect( 'get_year_link' )
			->withArgs( [ 2019 ] )
			->andReturn( 'https://2019' );

		$this->assertEquals( 'https://2019', $this->instance->get_non_cached_date_archive_permalink() );
	}

	/**
	 * Tests that get_non_cached_date_archive_permalink calls the expected methods - unexpected fallback.
	 *
	 * @covers ::get_non_cached_date_archive_permalink
	 */
	public function test_get_non_cached_date_archive_permalink_fallback() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->expects( 'is_day' )->once()->andReturnFalse();
		$wp_query->expects( 'is_month' )->once()->andReturnFalse();
		$wp_query->expects( 'is_year' )->once()->andReturnFalse();

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertEmpty( $this->instance->get_non_cached_date_archive_permalink() );
	}

	/**
	 * Tests if the current page is a simple page.
	 *
	 * @covers ::is_simple_page
	 */
	public function test_is_simple_page() {
		$this->instance->expects( 'get_simple_page_id' )->andReturn( 1 );

		$this->assertTrue( $this->instance->is_simple_page() );
	}

	/**
	 * Tests the retrieval of the simple page id on a singular page.
	 *
	 * @covers ::get_simple_page_id
	 */
	public function test_get_simple_page_id_on_singular_page() {
		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'get_the_ID' )
			->once()
			->andReturn( 1 );

		$this->assertEquals( 1, $this->instance->get_simple_page_id() );
	}

	/**
	 * Tests the retrieval of the simple page id on a posts page.
	 *
	 * @covers ::get_simple_page_id
	 */
	public function test_get_simple_page_id_on_posts_page() {
		$this->instance->expects( 'is_posts_page' )->andReturnTrue();

		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_for_posts' )
			->andReturn( 1 );

		$this->assertEquals( 1, $this->instance->get_simple_page_id() );
	}

	/**
	 * Tests the retrieval of the simple page id with the default value being filtered..
	 *
	 * @covers ::get_simple_page_id
	 */
	public function test_get_simple_page_id_with_default_value_being_filtered() {
		$this->instance->expects( 'is_posts_page' )->andReturnFalse();

		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( false );

		Monkey\Filters\expectApplied( 'wpseo_frontend_page_type_simple_page_id' )
			->once()
			->with( 0 )
			->andReturn( 1 );

		$this->assertEquals( 1, $this->instance->get_simple_page_id() );
	}

	/**
	 * Tests the retrieval of the front page id.
	 *
	 * @covers ::get_front_page_id
	 */
	public function test_get_front_page_id() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_on_front' )
			->andReturn( 1 );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'show_on_front' )
			->andReturn( 'page' );

		$this->assertEquals( 1, $this->instance->get_front_page_id() );
	}

	/**
	 * Tests the retrieval of the front page id having no page being set as the front page..
	 *
	 * @covers ::get_front_page_id
	 */
	public function test_get_front_page_id_having_no_page_set_as_front_page() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'show_on_front' )
			->andReturn( 'posts' );

		Monkey\Functions\expect( 'get_option' )
			->never()
			->with( 'page_on_front' );

		$this->assertEquals( 0, $this->instance->get_front_page_id() );
	}

	/**
	 * Tests retrieval of the term id with no term page matches.
	 *
	 * @covers ::get_term_id
	 */
	public function test_get_term_id() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query->expects( 'is_category' )->andReturnFalse();
		$this->wp_query->expects( 'is_tag' )->andReturnFalse();
		$this->wp_query->expects( 'is_tax' )->andReturnFalse();

		$this->assertEquals( 0, $this->instance->get_term_id() );
	}

	/**
	 * Tests retrieval of the term id with category as current page.
	 *
	 * @covers ::get_term_id
	 */
	public function test_get_term_id_for_category() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query->expects( 'is_category' )->andReturnTrue();

		$this->wp_query
			->expects( 'get' )
			->with( 'cat' )
			->andReturn( 1 );

		$this->assertEquals( 1, $this->instance->get_term_id() );
	}

	/**
	 * Tests retrieval of the term id with tag as current page.
	 *
	 * @covers ::get_term_id
	 */
	public function test_get_term_id_for_tag() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query->expects( 'is_category' )->andReturnFalse();
		$this->wp_query->expects( 'is_tag' )->andReturnTrue();

		$this->wp_query
			->expects( 'get' )
			->with( 'tag_id' )
			->andReturn( 1 );

		$this->assertEquals( 1, $this->instance->get_term_id() );
	}

	/**
	 * Tests retrieval of the term id with a taxonomy as current page and no
	 * wp_error given.
	 *
	 * @covers ::get_term_id
	 */
	public function test_get_term_id_for_taxonomy() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query->expects( 'is_category' )->andReturnFalse();
		$this->wp_query->expects( 'is_tag' )->andReturnFalse();
		$this->wp_query->expects( 'is_tax' )->andReturnTrue();

		$this->wp_query
			->expects( 'get_queried_object' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Functions\expect( 'is_wp_error' )
			->once()
			->andReturn( false );

		$this->assertEquals( 1, $this->instance->get_term_id() );
	}

	/**
	 * Tests retrieval of the term id with a taxonomy as current page and a
	 * wp_error given.
	 *
	 * @covers ::get_term_id
	 */
	public function test_get_term_id_for_taxonomy_that_gives_wp_error() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query->expects( 'is_category' )->andReturnFalse();
		$this->wp_query->expects( 'is_tag' )->andReturnFalse();
		$this->wp_query->expects( 'is_tax' )->andReturnTrue();

		$this->wp_query
			->expects( 'get_queried_object' )
			->andReturnTrue();

		Monkey\Functions\expect( 'is_wp_error' )
			->once()
			->andReturn( true );

		$this->assertEquals( 0, $this->instance->get_term_id() );
	}

	/**
	 * Tests the retrieval of the queried post type.
	 *
	 * @covers ::get_queried_post_type
	 */
	public function test_queried_post_type() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'get' )
			->with( 'post_type' )
			->andReturn( 'post' );

		$this->assertEquals( 'post', $this->instance->get_queried_post_type() );
	}

	/**
	 * Tests the retrieval of the queried post type.
	 *
	 * @covers ::get_queried_post_type
	 */
	public function test_queried_post_type_with_multiple_post_types() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'get' )
			->with( 'post_type' )
			->andReturn( [ 'page', 'post' ] );

		$this->assertEquals( 'page', $this->instance->get_queried_post_type() );
	}

	/**
	 * Tests is page is the home page and shows posts.
	 *
	 * @covers ::is_home_posts_page
	 */
	public function test_is_home_posts_page() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'is_home' )
			->andReturnTrue();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_on_front' )
			->andReturn( 1 );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'show_on_front' )
			->andReturn( 'posts' );

		$this->assertTrue( $this->instance->is_home_posts_page() );
	}

	/**
	 * Tests that is_static_posts_page returns false if the page_for_posts option is "0".
	 *
	 * @covers ::is_static_posts_page
	 */
	public function test_is_static_posts_page_invalid_page_for_posts() {
		$wp_query = Mockery::mock( 'WP_Query' );

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		Monkey\Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->once()
			->andReturn( '0' );

		$this->assertFalse( $this->instance->is_static_posts_page() );
	}

	/**
	 * Tests that is_static_posts_page returns true if the page_for_posts option is the same as the
	 * queried object id.
	 *
	 * @covers ::is_static_posts_page
	 */
	public function test_is_static_posts_page_same_object_id() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query
			->expects( 'get_queried_object_id' )
			->once()
			->andReturn( 1 );

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		Monkey\Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->once()
			->andReturn( '1' );

		$this->assertTrue( $this->instance->is_static_posts_page() );
	}

	/**
	 * Tests that is_static_posts_page returns true if the page_for_posts option is different than
	 * the queried object id.
	 *
	 * @covers ::is_static_posts_page
	 */
	public function test_is_static_posts_page_different_object_id() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query
			->expects( 'get_queried_object_id' )
			->once()
			->andReturn( 2 );

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		Monkey\Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->once()
			->andReturn( '1' );

		$this->assertFalse( $this->instance->is_static_posts_page() );
	}

	/**
	 * Tests that get_date_archive_permalink calls the expected methods when the static variable is not set.
	 *
	 * @covers ::get_date_archive_permalink
	 */
	public function test_get_date_archive_permalink_static_not_set() {
		$this->instance
			->expects( 'get_non_cached_date_archive_permalink' )
			->once()
			->andReturn( 'A date archive permalink' );

		$this->assertEquals( 'A date archive permalink', $this->instance->get_date_archive_permalink() );
	}

	/**
	 * Tests that get_date_archive_permalink calls the expected methods when the static variable is set.
	 * Notice that this test is connected to the above test ('test_get_date_archive_permalink_static_not_set'),
	 * because that test will set the static variable.
	 *
	 * @covers ::get_date_archive_permalink
	 */
	public function test_get_date_archive_permalink_static_set() {
		$this->instance
			->expects( 'get_non_cached_date_archive_permalink' )
			->never();

		$this->assertEquals( 'A date archive permalink', $this->instance->get_date_archive_permalink() );
	}

	/**
	 * Tests is page is the home page and shows posts, but with having no page_on_front set.
	 *
	 * @covers ::is_home_posts_page
	 */
	public function test_is_home_posts_page_with_page_on_front_not_set() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'is_home' )
			->andReturnTrue();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_on_front' )
			->andReturn( 0 );

		Monkey\Functions\expect( 'get_option' )
			->never()
			->with( 'show_on_front' );

		$this->assertTrue( $this->instance->is_home_posts_page() );
	}

	/**
	 * Tests is page is the home page and shows posts, but having current page not being the home page.
	 *
	 * @covers ::is_home_posts_page
	 */
	public function test_is_home_posts_page_not_on_the_home_page() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'is_home' )
			->andReturnFalse();

		Monkey\Functions\expect( 'get_option' )->never();

		$this->assertFalse( $this->instance->is_home_posts_page() );
	}

	/**
	 * Tests if the page is a static page set as the home page.
	 *
	 * @covers ::is_home_static_page
	 */
	public function test_is_home_static_page() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->wp_query
			->expects( 'is_page' )
			->with( 1 )
			->andReturnTrue();

		Monkey\Functions\expect( 'get_option' )
			->twice()
			->andReturnUsing(
				function ( $option ) {
					if ( $option === 'show_on_front' ) {
						return 'page';
					}

					if ( $option === 'page_on_front' ) {
						return 1;
					}

					return null;
				}
			);

		$this->assertTrue( $this->instance->is_home_static_page() );
	}

	/**
	 * Tests if the page is a static page, with current page not the front page
	 *
	 * @covers ::is_home_static_page
	 */
	public function test_is_home_static_page_not_the_front_page() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'is_front_page' )
			->andReturnFalse();

		Monkey\Functions\expect( 'get_option' )
			->with( 'show_on_front' )
			->never();

		$this->assertFalse( $this->instance->is_home_static_page() );
	}

	/**
	 * Tests if the page is a static page set as the home page with show_on_front
	 * set as posts.
	 *
	 * @covers ::is_home_static_page
	 */
	public function test_is_home_static_page_and_show_on_front_is_posts() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->wp_query
			->expects( 'is_page' )
			->never();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'show_on_front' )
			->andReturn( 'posts' );

		$this->assertFalse( $this->instance->is_home_static_page() );
	}

	/**
	 * Tests if the page is a posts page.
	 *
	 * @covers ::is_posts_page
	 */
	public function test_is_posts_page() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'is_home' )
			->andReturnTrue();

		Monkey\Functions\expect( 'get_option' )
			->with( 'show_on_front' )
			->andReturn( 'page' );

		$this->assertTrue( $this->instance->is_posts_page() );
	}

	/**
	 * Tests if the page is a posts page with current page not being the home page.
	 *
	 * @covers ::is_posts_page
	 */
	public function test_is_posts_page_not_on_the_home() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'is_home' )
			->andReturnFalse();

		Monkey\Functions\expect( 'get_option' )
			->with( 'show_on_front' )
			->never();

		$this->assertFalse( $this->instance->is_posts_page() );
	}

	/**
	 * Tests if the page is a posts page with the option show_on_front not having the value page.
	 *
	 * @covers ::is_posts_page
	 */
	public function test_is_posts_page_with_option_not_set() {
		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->andReturn( $this->wp_query );

		$this->wp_query
			->expects( 'is_home' )
			->andReturnTrue();

		Monkey\Functions\expect( 'get_option' )
			->with( 'show_on_front' )
			->andReturn( 'posts' );

		$this->assertFalse( $this->instance->is_posts_page() );
	}

	/**
	 * Tests if the page has multiple terms on a non term archive page.
	 *
	 * @covers ::is_multiple_terms_page
	 */
	public function test_is_multiple_terms_page_non_terms_archive() {
		$this->instance->expects( 'is_term_archive' )->andReturnFalse();

		$this->assertFalse( $this->instance->is_multiple_terms_page() );
	}

	/**
	 * Tests if the page has multiple terms on a term archive having on queried term.
	 *
	 * @covers ::is_multiple_terms_page
	 */
	public function test_is_multiple_terms_page_having_one_queried_term() {
		$this->instance->expects( 'is_term_archive' )->andReturnTrue();
		$this->instance->expects( 'count_queried_terms' )->andReturn( 1 );

		$this->assertFalse( $this->instance->is_multiple_terms_page() );
	}

	/**
	 * Tests if the page has multiple terms on a term archive having on queried term.
	 *
	 * @covers ::is_multiple_terms_page
	 */
	public function test_is_multiple_terms_page() {
		$this->instance->expects( 'is_term_archive' )->andReturnTrue();
		$this->instance->expects( 'count_queried_terms' )->andReturn( 10 );

		$this->assertTrue( $this->instance->is_multiple_terms_page() );
	}
}
