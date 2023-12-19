<?php

namespace Yoast\WP\SEO\Tests\Unit\Values\Open_Graph;

use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
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
final class Images_Test extends TestCase {

	/**
	 * Represents the open graph image helper.
	 *
	 * @var Mockery\MockInterface|Open_Graph_Image_Helper
	 */
	protected $open_graph_image;

	/**
	 * Represents the image helper.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * Represents the instance to test.
	 *
	 * @var Images
	 */
	protected $instance;

	/**
	 * Represents the url helper.
	 *
	 * @var Url_Helper|Mockery\Mock
	 */
	protected $url;

	/**
	 * Setup the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

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
	 *
	 * @return void
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
	 *
	 * @return void
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
