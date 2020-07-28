<?php

namespace Yoast\WP\SEO\Tests\Inc;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Doubles\Inc\Image_Utils_Double;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Image_Utils
 *
 * @group image-utils
 */
class Image_Utils_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Image_Utils_Double
	 */
	private $instance;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Image_Utils_Double();
	}

	/**
	 * Test whether the first image is returned from a term description.
	 *
	 * @covers ::get_first_content_image_for_term
	 */
	public function test_get_first_content_image_for_term() {

		$term_descr = '<p>This is a term description. It has several images:</p>
			<img src=""/>
			<img src="https://example.com/media/first_image.jpg"/>
			<img src="https://example.com/media/second_image.jpg"/>
			<p> That were all the images. Done! </p>';

		Monkey\Functions\expect( 'term_description' )
			->andReturn( $term_descr );

		$first_image = $this->instance->get_first_content_image_for_term( '11' );

		$expected = 'https://example.com/media/first_image.jpg';

		$this->assertEquals( $expected, $first_image );
	}

	/**
	 * Test to run with a provider for the get_first_image method.
	 *
	 * @param mixed  $images   The images to get first image from.
	 * @param mixed  $expected The expected value.
	 * @param string $message  The message to show when the test fails.
	 *
	 * @covers ::get_first_image
	 *
	 * @dataProvider get_first_image_provider
	 */
	public function test_get_first_image( $images, $expected, $message ) {
		$first_image = $this->instance->get_first_image( $images );

		$this->assertEquals( $expected, $first_image, $message );
	}

	/**
	 * Provides data for the get_first_image test.
	 *
	 * @return array Data to execute for each run.
	 */
	public function get_first_image_provider() {
		return [
			[
				'images'   => [ 'https://example.com/media/first_image.jpg', 'https://example.com/media/second_image.jpg' ],
				'expected' => 'https://example.com/media/first_image.jpg',
				'message'  => 'Test whether the first image is returned from an array consisting of multiple images.',
			],
			[
				'images'   => [ '', '', 'https://example.com/media/first_image.jpg', 'https://example.com/media/second_image.jpg' ],
				'expected' => 'https://example.com/media/first_image.jpg',
				'message'  => 'Test whether the first image is returned when the first element(s) in an array is/are empty.',
			],
			[
				'images'   => 'example_string',
				'expected' => null,
				'message'  => 'Test whether null is returned when the argument to the get_first_image function is not an array.',
			],
			[
				'images'   => [],
				'expected' => null,
				'message'  => 'Test whether null is returned when the array is empty.',
			],
		];
	}
}
