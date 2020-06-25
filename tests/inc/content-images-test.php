<?php

namespace Yoast\WP\SEO\Tests\Inc;

use Brain\Monkey;
use WPSEO_Content_Images;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Content_Images
 *
 * @group ContentImages
 */
class Content_Images_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Content_Images
	 */
	private $instance;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new WPSEO_Content_Images();
	}

	/**
	 * Test getting images from the post content.
	 *
	 * @covers ::get_images_from_content
	 */
	public function test_get_images_from_content() {

		Monkey\Functions\expect( 'get_home_url' )
			->andReturn( 'one.wordpress.test' );

		$external_image1      = 'https://example.com/media/first_image.jpg';
		$external_image2      = 'https://example.com/media/second_image.jpg';
		$non_attachment_image = \get_home_url() . '/wp-content/plugins/wordpress-seo/integration-tests/assets/yoast.png';

		$post_content = '<p>This is a post. It has several images:</p>
			<img src="' . $external_image1 . '"/>
			<img src="' . $external_image2 . '"/>
			<img src="' . $external_image2 . '"/>
			<img src="' . $non_attachment_image . '"/>
			<img src=""/>
			<p> That were all the images. Done! </p>
			<p>End of post</p>';

		$images_array = $this->instance->get_images_from_content( $post_content );

		$expected = [ $external_image1, $external_image2, $non_attachment_image ];

		$this->assertEquals( $expected, $images_array );
	}

	/**
	 * Test what happens when the post content isn't a string.
	 *
	 * @covers ::get_images_from_content
	 */
	public function test_get_images_from_when_content_not_a_string() {

		$post_content = 123;

		$images_array = $this->instance->get_images_from_content( $post_content );

		$expected = [];

		$this->assertEquals( $expected, $images_array );
	}
}

