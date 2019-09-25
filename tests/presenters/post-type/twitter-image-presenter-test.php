<?php

/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Presenters\Post_Type;

use Yoast\WP\Free\Presenters\Post_Type\Twitter_Image_Presenter;
use Yoast\WP\Free\Tests\Doubles\Presenters\Post_Type\Twitter_Image_Presenter_Double;
use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;
use Mockery;

/**
 * Class Twitter_Image_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Post_Type\Twitter_Image_Presenter
 *
 * @group twitter-image
 */
class Twitter_Image_Presenter_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Twitter_Image_Presenter_Double
	 */
	protected $class_instance;

	/**
	 * Mocked WP_Post.
	 *
	 * @var \WP_Post
	 */
	protected $mock_post;

	/**
	 * Sets up the test instance.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->mock_post               = Mockery::mock( '\WP_Post' )->makePartial();
		$this->mock_post->ID           = 1;
		$this->mock_post->post_content = '';

		$this->class_instance = new Twitter_Image_Presenter_Double();
	}

	/**
	 * Tests retrieving the first image url from the content.
	 *
	 * @covers ::retrieve_content_image
	 */
	public function test_retrieve_content_image() {
		$expected = 'https://example.com/media/content_image.jpg';

		\Mockery::mock('alias:WPSEO_Image_Utils')
			->shouldReceive('get_first_usable_content_image_for_post')
			->once()
			->andReturn($expected);

		$image_url = $this->class_instance->retrieve_content_image($this->mock_post->ID);
		$this->assertEquals( $expected, $image_url );
	}

	/**
	 * Tests whether an empty string is returned when the content contains no image.
	 *
	 * @covers ::retrieve_content_image
	 */
	public function test_retrieve_content_image_no_image_in_content() {
		\Mockery::mock('alias:WPSEO_Image_Utils')
			->shouldReceive('get_first_usable_content_image_for_post')
			->once()
			->andReturn(null);

		$image_url = $this->class_instance->retrieve_content_image($this->mock_post->ID);
		$this->assertEmpty( $image_url );
	}
}
