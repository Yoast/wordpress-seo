<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexables;

use Mockery;
use Yoast\WP\SEO\Actions\Indexables\Indexable_Head_Action;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Indexable_Head_Action_Test class.
 *
 * @group actions
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexables\Indexable_Head_Action
 */
class Indexable_Head_Action_Test extends TestCase {

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
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Meta_Surface::class,
			$this->getPropertyValue( $this->instance, 'meta_surface' )
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
	 */
	public function test_retrieving_meta( $method, $input ) {
		$meta = Mockery::mock();
		$meta
			->expects( 'get_head' )
			->andReturn( 'this is the head' );

		$this->meta_surface
			->expects( $method )
			->with( $input )
			->andReturn( $meta );

		$this->assertEquals(
			(object) [
				'head'   => 'this is the head',
				'status' => 200,
			],
			$this->instance->{$method}( $input )
		);
	}

	/**
	 * Tests retrieval for a url that has meta.
	 *
	 * @covers ::for_posts_page
	 */
	public function test_retrieving_meta_for_posts_page() {
		$meta = Mockery::mock();
		$meta
			->expects( 'get_head' )
			->andReturn( 'this is the head' );

		$this->meta_surface
			->expects( 'for_posts_page' )
			->andReturn( $meta );

		$this->assertEquals(
			(object) [
				'head'   => 'this is the head',
				'status' => 200,
			],
			$this->instance->for_posts_page()
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
	 */
	public function test_retrieving_meta_with_meta_not_found( $method, $input ) {
		$meta = Mockery::mock();
		$meta
			->expects( 'get_head' )
			->andReturn( 'this is the 404 head' );

		$this->meta_surface
			->expects( $method )
			->with( $input )
			->andReturnFalse();

		$this->meta_surface
			->expects( 'for_404' )
			->andReturn( $meta );

		$this->assertEquals(
			(object) [
				'head'   => 'this is the 404 head',
				'status' => 404,
			],
			$this->instance->{$method}( $input )
		);
	}

	/**
	 * Tests retrieval for a url that has no meta data.
	 *
	 * @covers ::for_posts_page
	 */
	public function test_retrieving_meta_for_posts_page_with_meta_not_found() {
		$meta = Mockery::mock();
		$meta
			->expects( 'get_head' )
			->andReturn( 'this is the 404 head' );

		$this->meta_surface
			->expects( 'for_posts_page' )
			->andReturnFalse();

		$this->meta_surface
			->expects( 'for_404' )
			->andReturn( $meta );

		$this->assertEquals(
			(object) [
				'head'   => 'this is the 404 head',
				'status' => 404,
			],
			$this->instance->for_posts_page()
		);
	}

	/**
	 * Data provider for the tests.
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function method_provider() {
		return [
			[ 'for_url', 'https://example.org/' ],
			[ 'for_post', 1 ],
			[ 'for_term', 1 ],
			[ 'for_author', 1 ],
			[ 'for_post_type_archive', 'type' ],
		];
	}
}
