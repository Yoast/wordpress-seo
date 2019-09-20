<?php

namespace Yoast\WP\Free\Tests\Admin\Inc;

use WPSEO_Image_Utils;
use Yoast\WP\Free\Tests\Doubles\Inc\Image_Utils_Double;
use Yoast\WP\Free\Tests\TestCase;

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
	 * Test whether the first image is returned from an array consisting of multiple images.
	 *
	 * @covers ::get_first_image
	 */

	public function test_get_first_image() {

		$images = [ 'https://example.com/media/first_image.jpg', 'https://example.com/media/second_image.jpg' ];

		$first_image = $this->instance->get_first_image( $images );

		$expected = 'https://example.com/media/first_image.jpg';

		$this->assertEquals( $expected, $first_image );
	}

	/**
	 * Test whether the first image is returned when the first element(s) in an array is/are empty.
	 *
	 * @covers ::get_first_image
	 */

	public function test_first_elements_are_empty() {

		$images = [ '', '', 'https://example.com/media/first_image.jpg', 'https://example.com/media/second_image.jpg' ];

		$first_image = $this->instance->get_first_image( $images );

		$expected = 'https://example.com/media/first_image.jpg';

		$this->assertEquals( $expected, $first_image );
	}

	/**
	 * Test whether null is returned when the argument to the get_first_image function is not an array.
	 *
	 * @covers ::get_first_image
	 */

	public function test_not_an_array() {

		$images = 'example_string';

		$first_image = $this->instance->get_first_image( $images );

		$this->assertNull( $first_image );
	}

	/**
	 * Test whether null is returned when the array is empty.
	 *
	 * @covers ::get_first_image
	 */

	public function test_empty_array() {

		$images = [ ];

		$first_image = $this->instance->get_first_image( $images );

		$this->assertNull( $first_image );
	}
}
