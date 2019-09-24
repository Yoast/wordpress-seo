<?php

namespace Yoast\WP\Free\Tests\Admin\Inc;

use WPSEO_Image_Utils;
use Yoast\WP\Free\Tests\Doubles\Inc\Image_Utils_Double;
use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

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

	public function test_first_of_multiple_content_images_for_term() {

		$term_descr =
			'<p>This is a term description. It has several images:</p>
			<img src=""/>
			<img src="' . 'https://example.com/media/first_image.jpg' . '"/>
			<img src="' . 'https://example.com/media/second_image.jpg' . '"/>
			<p> That were all the images. Done! </p>';

		Monkey\Functions\expect( 'term_description' )
			->andReturn( $term_descr );

		$first_image = $this->instance->get_first_content_image_for_term( '11' );

		$expected = 'https://example.com/media/first_image.jpg';

		$this->assertEquals( $expected, $first_image );
	}

	/**
	 * Test whether null is returned when $term_id is null.
	 *
	 * @covers ::get_first_content_image_for_term
	 */

	public function test_term_id_is_null() {

		$first_image = $this->instance->get_first_content_image_for_term( null );

		$this->assertNull( $first_image );
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
