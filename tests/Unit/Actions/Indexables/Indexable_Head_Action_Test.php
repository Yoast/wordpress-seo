<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexables;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexables\Indexable_Head_Action;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Surfaces\Values\Meta;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Indexable_Head_Action_Test class.
 *
 * @group actions
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexables\Indexable_Head_Action
 */
final class Indexable_Head_Action_Test extends TestCase {

	/**
	 * Represents the meta surface.
	 *
	 * @var Mockery\MockInterface|Meta_Surface
	 */
	protected $meta_surface;

	/**
	 * The instance to test.
	 *
	 * @var Indexable_Head_Action
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->meta_surface = Mockery::mock( Meta_Surface::class );
		$this->instance     = new Indexable_Head_Action( $this->meta_surface );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Meta_Surface::class,
			$this->getPropertyValue( $this->instance, 'meta_surface' ),
		);
	}

	/**
	 * Tests retrieval for a url that has meta.
	 *
	 * @covers ::for_url
	 * @covers ::for_post
	 * @covers ::for_term
	 * @covers ::for_author
	 * @covers ::for_post_type_archive
	 *
	 * @dataProvider method_provider
	 *
	 * @param string     $method The method to call.
	 * @param string|int $input  The data to pass.
	 *
	 * @return void
	 */
	public function test_retrieving_meta( $method, $input ) {
		$meta = Mockery::mock( Meta::class );
		$meta
			->expects( 'get_head' )
			->andReturn( $this->get_head() );

		$this->meta_surface
			->expects( $method )
			->with( $input )
			->andReturn( $meta );

		if ( $method === 'for_url' ) {
			Monkey\Functions\expect( 'get_home_url' )
				->once()
				->andReturn( 'https://homepage.org' );
		}

		$output = $this->instance->{$method}( $input );

		$this->assertEquals(
			(object) [
				'html'   => 'this is the head',
				'json'   => [ 'key' => 'value' ],
				'status' => 200,
			],
			$output,
		);
	}

	/**
	 * Tests retrieval for a url that has meta.
	 *
	 * @covers ::for_posts_page
	 *
	 * @return void
	 */
	public function test_retrieving_meta_for_posts_page() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_for_posts' )
			->andReturn( 0 );

		$meta = Mockery::mock( Meta::class );
		$meta
			->expects( 'get_head' )
			->andReturn( $this->get_head() );

		$this->meta_surface
			->expects( 'for_posts_page' )
			->andReturn( $meta );

		$this->assertEquals(
			(object) [
				'html'   => 'this is the head',
				'json'   => [ 'key' => 'value' ],
				'status' => 200,
			],
			$this->instance->for_posts_page(),
		);
	}

	/**
	 * Tests retrieval for a url that has no meta data.
	 *
	 * @covers ::for_url
	 * @covers ::for_post
	 * @covers ::for_term
	 * @covers ::for_author
	 * @covers ::for_post_type_archive
	 * @covers ::for_404
	 *
	 * @dataProvider method_provider
	 *
	 * @param string     $method The method to call.
	 * @param string|int $input  The data to pass.
	 *
	 * @return void
	 */
	public function test_retrieving_meta_with_meta_not_found( $method, $input ) {
		$meta = Mockery::mock( Meta::class );
		$meta
			->expects( 'get_head' )
			->andReturn(
				(object) [
					'html' => 'this is the 404 head',
					'json' => [ 'key' => 'value' ],
				],
			);

		$this->meta_surface
			->expects( $method )
			->with( $input )
			->andReturnFalse();

		$this->meta_surface
			->expects( 'for_404' )
			->andReturn( $meta );

		if ( $method === 'for_url' ) {
			Monkey\Functions\expect( 'get_home_url' )
				->once()
				->andReturn( 'https://homepage.org' );
		}

		$this->assertEquals(
			(object) [
				'html'   => 'this is the 404 head',
				'json'   => [ 'key' => 'value' ],
				'status' => 404,
			],
			$this->instance->{$method}( $input ),
		);
	}

	/**
	 * Tests retrieval for a url that has no meta data.
	 *
	 * @covers ::for_posts_page
	 *
	 * @return void
	 */
	public function test_retrieving_meta_for_posts_page_with_meta_not_found() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_for_posts' )
			->andReturn( 0 );

		$meta = Mockery::mock( Meta::class );
		$meta
			->expects( 'get_head' )
			->andReturn(
				(object) [
					'html' => 'this is the 404 head',
					'json' => [ 'key' => 'value' ],
				],
			);

		$this->meta_surface
			->expects( 'for_posts_page' )
			->andReturnFalse();

		$this->meta_surface
			->expects( 'for_404' )
			->andReturn( $meta );

		$this->assertEquals(
			(object) [
				'html'   => 'this is the 404 head',
				'json'   => [ 'key' => 'value' ],
				'status' => 404,
			],
			$this->instance->for_posts_page(),
		);
	}

	/**
	 * Tests retrieval for a static posts page, depending on whether the current user can read it.
	 *
	 * @covers ::for_posts_page
	 *
	 * @dataProvider data_for_posts_page_with_static_page
	 *
	 * @param bool $is_readable Whether the posts page is readable.
	 * @param int  $status      The expected status.
	 *
	 * @return void
	 */
	public function test_for_posts_page_with_static_page( $is_readable, $status ) {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_for_posts' )
			->andReturn( 3 );

		$this->meta_surface
			->expects( 'is_post_readable' )
			->once()
			->with( 3 )
			->andReturn( $is_readable );

		$meta = Mockery::mock( Meta::class );
		$meta
			->expects( 'get_head' )
			->andReturn( $this->get_head() );

		$this->meta_surface
			->expects( 'for_posts_page' )
			->times( ( $status === 200 ) ? 1 : 0 )
			->andReturn( $meta );

		$this->meta_surface
			->expects( 'for_404' )
			->times( ( $status === 404 ) ? 1 : 0 )
			->andReturn( $meta );

		$this->assertSame( $status, $this->instance->for_posts_page()->status );
	}

	/**
	 * Data provider for test_for_posts_page_with_static_page.
	 *
	 * @return array<string, array<bool|int>>
	 */
	public static function data_for_posts_page_with_static_page() {
		return [
			'Public posts page'  => [ true, 200 ],
			'Private posts page' => [ false, 404 ],
		];
	}

	/**
	 * Tests retrieval for the home url, depending on the front page settings.
	 *
	 * @covers ::for_url
	 * @covers ::is_front_page_readable
	 *
	 * @dataProvider data_for_url_with_home_url
	 *
	 * @param string    $show_on_front The show_on_front option value.
	 * @param int       $page_on_front The page_on_front option value.
	 * @param bool|null $is_readable   Whether the front page is readable, null if it is not checked.
	 * @param int       $status        The expected status.
	 *
	 * @return void
	 */
	public function test_for_url_with_home_url( $show_on_front, $page_on_front, $is_readable, $status ) {
		Monkey\Functions\expect( 'get_home_url' )
			->once()
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_on_front' )
			->andReturn( $page_on_front );
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'show_on_front' )
			->andReturn( $show_on_front );

		$this->meta_surface
			->expects( 'is_post_readable' )
			->times( ( $is_readable === null ) ? 0 : 1 )
			->with( $page_on_front )
			->andReturn( $is_readable );

		$meta = Mockery::mock( Meta::class );
		$meta
			->expects( 'get_head' )
			->andReturn( $this->get_head() );

		$this->meta_surface
			->expects( 'for_home_page' )
			->times( ( $status === 200 ) ? 1 : 0 )
			->andReturn( $meta );

		$this->meta_surface
			->expects( 'for_404' )
			->times( ( $status === 404 ) ? 1 : 0 )
			->andReturn( $meta );

		$this->assertSame( $status, $this->instance->for_url( 'https://example.org/' )->status );
	}

	/**
	 * Data provider for test_for_url_with_home_url.
	 *
	 * @return array<string, array<string|int|bool|null>>
	 */
	public static function data_for_url_with_home_url() {
		return [
			'Latest posts on front'     => [ 'posts', 0, null, 200 ],
			'No front page selected'    => [ 'page', 0, null, 200 ],
			'Public static front page'  => [ 'page', 2, true, 200 ],
			'Private static front page' => [ 'page', 2, false, 404 ],
		];
	}

	/**
	 * Data provider for the tests.
	 *
	 * @return array<array<string|int>> A mapping of methods and expected inputs.
	 */
	public static function method_provider() {
		return [
			[ 'for_url', 'https://example.org/' ],
			[ 'for_post', 1 ],
			[ 'for_term', 1 ],
			[ 'for_author', 1 ],
			[ 'for_post_type_archive', 'type' ],
		];
	}

	/**
	 * Stub the Meta result.
	 *
	 * @param string                $html The HTML setup.
	 * @param array<string, string> $json The JSON setup.
	 *
	 * @return object The mocked result.
	 */
	protected function get_head( $html = 'this is the head', $json = [ 'key' => 'value' ] ) {
		return (object) [
			'html' => $html,
			'json' => $json,
		];
	}
}
