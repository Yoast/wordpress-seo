<?php

namespace Yoast\WP\Free\Tests\Presenters\Open_Graph;

use Mockery;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Tests\Doubles\Presenters\Open_Graph\Image_Presenter_Double;
use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Image_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Open_Graph\Image_Presenter
 *
 * @group presenters
 * @group opengraph
 * @group opengraph-image
 */
class Image_Presenter_Test extends TestCase {

	/**
	 * @var Url_Helper|Mockery\MockInterface
	 */
	protected $url_helper;

	/**
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image_helper;

	/**
	 * @var Image_Presenter_Double|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Setup some mocks.
	 */
	public function setUp() {
		parent::setUp();

		$this->url_helper   = Mockery::mock( Url_Helper::class )->makePartial();
		$this->image_helper = Mockery::mock( Image_Helper::class )->makePartial();
		$this->instance     = Mockery::mock( Image_Presenter_Double::class, [ $this->image_helper, $this->url_helper ] )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests the present when no image is given.
	 *
	 * @covers ::present
	 */
	public function test_present_with_no_set_images() {
		$presentation = new Indexable_Presentation();
		$presentation->og_images = [];

		$this->assertEmpty( $this->instance->present( $presentation ) );
	}

	/**
	 * Tests the presentation with a set image.
	 *
	 * @covers ::present
	 */
	public function test_present_with_a_set_image() {
		$image = [
			'url'    => 'https://example.com/image.jpg',
			'width'  => 100,
			'height' => 100,
		];

		$presentation = new Indexable_Presentation();
		$presentation->og_images = [ $image ];

		$this->instance
			->expects( 'format_image' )
			->once()
			->with( $image )
			->andReturn( $image );

		$this->instance
			->expects( 'is_image_url_valid' )
			->once()
			->with( $image )
			->andReturnTrue();

		$this->assertEquals(
			'<meta property="og:image" value="https://example.com/image.jpg"/><meta property="og:image:secure_url" value="https://example.com/image.jpg"/><meta property="og:image:width" value="100"/><meta property="og:image:height" value="100"/>',
			$this->instance->present( $presentation )
		);
	}


	/**
	 * Tests the situation where the apply_filters returns a non-string value.
	 *
	 * @covers ::filter
	 */
	public function test_filter_wrong_image_url_returned() {
		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_opengraph_image', 'image.jpg' )
			->andReturn( false );

		$this->assertEquals( [ 'url' => 'image.jpg' ], $this->instance->filter( [ 'url' => 'image.jpg' ] ) );
	}
	/**
	 * Tests the situation where the apply_filters returns another image.
	 *
	 * @covers ::filter
	 */
	public function test_filter() {
		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_opengraph_image', 'image.jpg' )
			->andReturn( 'filtered_image.jpg' );

		$this->assertEquals( [ 'url' => 'filtered_image.jpg' ], $this->instance->filter( [ 'url' => 'image.jpg' ] ) );
	}


}
