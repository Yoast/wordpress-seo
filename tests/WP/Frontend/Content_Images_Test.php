<?php

namespace Yoast\WP\SEO\Tests\WP\Frontend;

use Yoast\WP\SEO\Tests\WP\Doubles\Inc\Content_Images_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * OpenGraph tests.
 *
 * @group OpenGraph
 */
final class Content_Images_Test extends TestCase {

	/**
	 * Test getting the image from post content.
	 *
	 * @covers WPSEO_Content_Images::get_images_from_content
	 *
	 * @return void
	 */
	public function test_get_only_valid_images_from_content() {
		$class_instance = new Content_Images_Double();

		$external_image       = 'https://cdn.yoast.com/app/uploads/2018/03/Caroline_Blog_SEO_FI-600x314.jpg';
		$non_attachment_image = \get_home_url() . '/wp-content/plugins/wordpress-seo/tests/integration/assets/yoast.png';

		// Create the post content.
		$post_content = '<p>This is a post. It has several images:</p>
		<img src="' . $external_image . '"/>
		<img src="' . $non_attachment_image . '"/>
		<img src=""/>
		<img src="' . $non_attachment_image . '"/>
		<p> That were all the images. Done! </p>
		<p>End of post</p>';

		$result = $class_instance->get_images_from_content( $post_content );

		// We expect only the urls of the first two img tags in the array.
		$expected = [ $external_image, $non_attachment_image ];
		$this->assertEquals( $expected, $result );
	}
}
