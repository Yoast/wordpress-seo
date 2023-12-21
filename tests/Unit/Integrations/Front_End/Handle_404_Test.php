<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use stdClass;
use WP_Query;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Integrations\Front_End\Handle_404;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Class Handle_404_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Handle_404
 *
 * @group integrations
 * @group front-end
 */
final class Handle_404_Test extends TestCase {

	/**
	 * The wp query Wrapper helper.
	 *
	 * @var Mockery\Mock|WP_Query_Wrapper
	 */
	protected $query_wrapper;

	/**
	 * The instance to test.
	 *
	 * @var Handle_404
	 */
	protected $instance;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->query_wrapper = Mockery::mock( WP_Query_Wrapper::class )->makePartial();
		$this->instance      = Mockery::mock( Handle_404::class, [ $this->query_wrapper ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Handle_404::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'pre_handle_404', [ $this->instance, 'handle_404' ] ) );
	}

	/**
	 * Tests the handling of a 404 page for a non feed page.
	 *
	 * @covers ::handle_404
	 * @covers ::is_feed_404
	 *
	 * @return void
	 */
	public function test_404_for_a_non_feed() {
		Monkey\Functions\expect( 'is_feed' )->once()->andReturn( false );

		$this->assertFalse( $this->instance->handle_404( false ) );
	}

	/**
	 * Tests the handling of a 404 page with the query having posts.
	 *
	 * @covers ::handle_404
	 * @covers ::is_feed_404
	 *
	 * @return void
	 */
	public function test_404_with_query_having_posts() {
		Monkey\Functions\expect( 'is_feed' )
			->once()
			->andReturn( true );

		$wp_query        = new stdClass();
		$wp_query->posts = true;

		$this->query_wrapper
			->expects( 'get_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertFalse( $this->instance->handle_404( false ) );
	}

	/**
	 * Tests the handling of a 404 page with the query having an object.
	 *
	 * @covers ::handle_404
	 * @covers ::is_feed_404
	 *
	 * @return void
	 */
	public function test_404_with_query_having_an_object() {
		Monkey\Functions\expect( 'is_feed' )
			->once()
			->andReturn( true );

		$wp_query        = Mockery::mock( WP_Query::class );
		$wp_query->posts = false;
		$wp_query->expects( 'get_queried_object' )->once()->andReturnTrue();

		$this->query_wrapper
			->expects( 'get_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertFalse( $this->instance->handle_404( false ) );
	}

	/**
	 * Tests the handling of a 404 page where the page isn't an archive or singular.
	 *
	 * @covers ::handle_404
	 * @covers ::is_feed_404
	 *
	 * @return void
	 */
	public function test_404_when_page_is_not_an_archive_and_not_singular() {
		Monkey\Functions\expect( 'is_feed' )
			->once()
			->andReturn( true );

		$wp_query        = Mockery::mock( WP_Query::class );
		$wp_query->posts = false;
		$wp_query->expects( 'get_queried_object' )->once()->andReturnFalse();
		$wp_query->expects( 'is_archive' )->once()->andReturnFalse();
		$wp_query->expects( 'is_singular' )->once()->andReturnFalse();

		$this->query_wrapper
			->expects( 'get_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertFalse( $this->instance->handle_404( false ) );
	}

	/**
	 * Tests the handling of a 404 page where the page isn't an archive not singular.
	 *
	 * @covers ::handle_404
	 * @covers ::is_feed_404
	 *
	 * @return void
	 */
	public function test_404_when_page_is_an_archive() {
		Monkey\Functions\expect( 'is_feed' )
			->once()
			->andReturn( true );

		$wp_query        = Mockery::mock( WP_Query::class );
		$wp_query->posts = false;
		$wp_query->expects( 'get_queried_object' )->once()->andReturnFalse();
		$wp_query->expects( 'is_archive' )->once()->andReturnTrue();
		$wp_query->expects( 'is_singular' )->never();

		$this->instance
			->expects( 'set_404' )
			->once()
			->andReturnNull();

		$this->instance
			->expects( 'set_headers' )
			->once()
			->andReturnNull();

		$this->query_wrapper
			->expects( 'get_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertTrue( $this->instance->handle_404( false ) );
	}

	/**
	 * Tests the handling of a 404 page where the page isn't an archive but is singular.
	 *
	 * @covers ::handle_404
	 * @covers ::is_feed_404
	 *
	 * @return void
	 */
	public function test_404_when_page_is_singular() {
		Monkey\Functions\expect( 'is_feed' )
			->once()
			->andReturn( true );

		$wp_query        = Mockery::mock( WP_Query::class );
		$wp_query->posts = false;
		$wp_query->expects( 'get_queried_object' )->once()->andReturnFalse();
		$wp_query->expects( 'is_archive' )->once()->andReturnFalse();
		$wp_query->expects( 'is_singular' )->once()->andReturnTrue();

		$this->query_wrapper
			->expects( 'get_query' )
			->once()
			->andReturn( $wp_query );

		$this->instance
			->expects( 'set_404' )
			->once()
			->andReturnNull();

		$this->instance
			->expects( 'set_headers' )
			->once()
			->andReturnNull();

		$this->assertTrue( $this->instance->handle_404( false ) );
	}

	/**
	 * Tests the handling of a 404 page where the page is a 404 page.
	 *
	 * @covers ::handle_404
	 * @covers ::set_404
	 *
	 * @return void
	 */
	public function test_404_when_page_is_404() {
		$wp_query = Mockery::mock( WP_Query::class );
		$wp_query->expects( 'set_404' )->once()->andReturnNull();

		$this->query_wrapper
			->expects( 'get_query' )
			->once()
			->andReturn( $wp_query );

		$this->query_wrapper
			->expects( 'set_query' )
			->once()
			->with( $wp_query )
			->andReturnNull();

		$this->instance
			->expects( 'is_feed_404' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'set_headers' )
			->once()
			->andReturnNull();

		$this->assertTrue( $this->instance->handle_404( false ) );
	}
}
