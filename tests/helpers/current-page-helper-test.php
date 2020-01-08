<?php

namespace Yoast\WP\SEO\Tests\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Tests\TestCase;
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
	 * Current page helper instance.
	 *
	 * @var Current_Page_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->wp_query_wrapper = Mockery::mock( WP_Query_Wrapper::class );

		$this->instance = new Current_Page_Helper( $this->wp_query_wrapper );
	}

	/**
	 * Tests that get_date_archive_permalink calls the expected methods on a day archive.
	 *
	 * @covers ::get_date_archive_permalink
	 */
	public function test_get_date_archive_permalink_day() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->expects( 'is_day' )->once()->andReturnTrue();
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

		$this->assertEquals( 'https://2019/10/23', $this->instance->get_date_archive_permalink() );
	}

	/**
	 * Tests that get_date_archive_permalink calls the expected methods on a month archive.
	 *
	 * @covers ::get_date_archive_permalink
	 */
	public function test_get_date_archive_permalink_month() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->expects( 'is_day' )->once()->andReturnFalse();
		$wp_query->expects( 'is_month' )->once()->andReturnTrue();
		$wp_query->expects( 'get' )->with( 'year' )->once()->andReturn( '2019' );
		$wp_query->expects( 'get' )->with( 'monthnum' )->once()->andReturn( '10' );

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		Monkey\Functions\expect( 'get_month_link' )
			->withArgs( [ 2019, 10 ] )
			->andReturn( 'https://2019/10' );

		$this->assertEquals( 'https://2019/10', $this->instance->get_date_archive_permalink() );
	}

	/**
	 * Tests that get_date_archive_permalink calls the expected methods on a year archive.
	 *
	 * @covers ::get_date_archive_permalink
	 */
	public function test_get_date_archive_permalink_year() {
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

		$this->assertEquals( 'https://2019', $this->instance->get_date_archive_permalink() );
	}

	/**
	 * Tests that get_date_archive_permalink calls the expected methods - unexpected fallback.
	 *
	 * @covers ::get_date_archive_permalink
	 */
	public function test_get_date_archive_permalink_fallback() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->expects( 'is_day' )->once()->andReturnFalse();
		$wp_query->expects( 'is_month' )->once()->andReturnFalse();
		$wp_query->expects( 'is_year' )->once()->andReturnFalse();

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertEmpty( $this->instance->get_date_archive_permalink() );
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
}
