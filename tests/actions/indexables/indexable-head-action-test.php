<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Actions\Indexables
 */

namespace Yoast\WP\SEO\Tests\Actions\Indexables;

use Mockery;
use Yoast\WP\SEO\Actions\Indexables\Indexable_Head_Action;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Indexable_Post_Indexation_Action_Test class
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
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->meta_surface = Mockery::mock( Meta_Surface::class );
		$this->instance     = new Indexable_Head_Action( $this->meta_surface );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertAttributeInstanceOf( Meta_Surface::class, 'meta_surface', $this->instance );
	}

	/**
	 * Tests retrieval for a url that has meta.
	 *
	 * @covers ::for_url
	 */
	public function test_for_url() {
		$meta = Mockery::mock();
		$meta
			->expects( 'get_head' )
			->andReturn( 'this is the head' );

		$this->meta_surface
			->expects( 'for_url' )
			->with( 'https://example.org/' )
			->andReturn( $meta );

		$this->assertEquals(
			(object) [
				'head'   => 'this is the head',
				'status' => 200,
			],
			$this->instance->for_url( 'https://example.org/' )
		);
	}

	/**
	 * Tests retrieval for a url that has no meta data.
	 *
	 * @covers ::for_url
	 */
	public function test_for_url_with_meta_not_found() {
		$meta = Mockery::mock();
		$meta
			->expects( 'get_head' )
			->andReturn( 'this is the 404 head' );

		$this->meta_surface
			->expects( 'for_url' )
			->with( 'https://example.org/' )
			->andReturnFalse();

		$this->meta_surface
			->expects( 'for_404' )
			->andReturn( $meta );

		$this->assertEquals(
			(object) [
				'head'   => 'this is the 404 head',
				'status' => 404,
			],
			$this->instance->for_url( 'https://example.org/' )
		);
	}

}
