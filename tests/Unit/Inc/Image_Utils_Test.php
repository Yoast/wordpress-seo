<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey;
use WPSEO_Image_Utils;
use Yoast\WP\SEO\Tests\Unit\Doubles\Inc\Image_Utils_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Image_Utils
 *
 * @group image-utils
 */
final class Image_Utils_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Image_Utils_Double
	 */
	private $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Image_Utils_Double();

		// The class-level memo on `get_full_size_image_data` is process-wide;
		// reset it so each test starts from a clean state.
		WPSEO_Image_Utils::reset_full_size_image_data_cache();
	}

	/**
	 * Tear down.
	 *
	 * @return void
	 */
	protected function tear_down() {
		WPSEO_Image_Utils::reset_full_size_image_data_cache();

		parent::tear_down();
	}

	/**
	 * Test whether the first image is returned from a term description.
	 *
	 * @covers ::get_first_content_image_for_term
	 *
	 * @return void
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
	 * @dataProvider get_first_image_provider
	 * @covers       ::get_first_image
	 *
	 * @param mixed  $images   The images to get first image from.
	 * @param mixed  $expected The expected value.
	 * @param string $message  The message to show when the test fails.
	 *
	 * @return void
	 */
	public function test_get_first_image( $images, $expected, $message ) {
		$first_image = $this->instance->get_first_image( $images );

		$this->assertEquals( $expected, $first_image, $message );
	}

	/**
	 * Tests that get_full_size_image_data only issues a single
	 * wp_get_attachment_metadata lookup when called multiple times for
	 * the same attachment ID within a single request.
	 *
	 * @covers ::get_full_size_image_data
	 *
	 * @return void
	 */
	public function test_get_full_size_image_data_is_memoized() {
		$metadata = [
			'width'  => 800,
			'height' => 600,
			'file'   => 'image.jpg',
		];

		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->once()
			->with( 1337 )
			->andReturn( $metadata );

		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->once()
			->with( 1337, 'full' )
			->andReturn( 'https://example.org/image.jpg' );

		Monkey\Functions\expect( 'get_attached_file' )
			->once()
			->with( 1337 )
			->andReturn( '/path/to/image.jpg' );

		$first  = Image_Utils_Double::call_get_full_size_image_data( 1337 );
		$second = Image_Utils_Double::call_get_full_size_image_data( 1337 );

		$this->assertSame( $first, $second );
		$this->assertSame( 800, $first['width'] );
		$this->assertSame( 'https://example.org/image.jpg', $first['url'] );
	}

	/**
	 * Tests that a cached `false` result (no metadata) is also returned from
	 * the memo, so a second call does not re-issue the lookup.
	 *
	 * @covers ::get_full_size_image_data
	 *
	 * @return void
	 */
	public function test_get_full_size_image_data_caches_false_result() {
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->once()
			->with( 1337 )
			->andReturn( false );

		$first  = Image_Utils_Double::call_get_full_size_image_data( 1337 );
		$second = Image_Utils_Double::call_get_full_size_image_data( 1337 );

		$this->assertFalse( $first );
		$this->assertFalse( $second );
	}

	/**
	 * Provides data for the get_first_image test.
	 *
	 * @return array Data to execute for each run.
	 */
	public static function get_first_image_provider() {
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
