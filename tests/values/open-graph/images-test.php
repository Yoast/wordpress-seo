<?php

namespace Yoast\WP\SEO\Tests\Values\Open_Graph;

use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Values\Open_Graph\Images;

/**
 * Class Images_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Values\Open_Graph\Images
 *
 * @group values
 * @group open-graph
 * @group open-graph-image
 */
class Images_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Open_Graph_Image_Helper
	 */
	protected $open_graph_image;

	/**
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * @var Images
	 */
	protected $instance;

	/**
	 * @var Url_Helper|Mockery\Mock
	 */
	protected $url;

	/**
	 * Setup the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->image            = Mockery::mock( Image_Helper::class )->makePartial();
		$this->url              = Mockery::mock( Url_Helper::class )->makePartial();
		$this->open_graph_image = Mockery::mock(
			Open_Graph_Image_Helper::class,
			[ new Url_Helper(), $this->image ]
		)->makePartial();

		$this->instance = new Images( $this->image, $this->url );
		$this->instance->set_helpers( $this->open_graph_image );
	}

	/**
	 * Test adding an image by id.
	 *
	 * @covers ::add_image_by_id
	 */
	public function test_add_image_by_id() {
		$this->open_graph_image
			->expects( 'get_image_by_id' )
			->once()
			->with( 1337 )
			->andReturn( 'image.jpg' );

		$this->instance->add_image_by_id( 1337 );

		$this->assertEquals(
			[
				'image.jpg' => [
					'url' => 'image.jpg',
				],
			],
			$this->instance->get_images()
		);
	}

	/**
	 * Test adding an image by id with no image being found.
	 *
	 * @covers ::add_image_by_id
	 */
	public function test_add_image_by_id_no_image_found() {
		$this->open_graph_image
			->expects( 'get_image_by_id' )
			->once()
			->with( 1337 )
			->andReturnFalse();

		$this->instance->add_image_by_id( 1337 );

		$this->assertEquals( [], $this->instance->get_images() );
	}
}
