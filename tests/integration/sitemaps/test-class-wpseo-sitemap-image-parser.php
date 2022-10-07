<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Sitemap_Image_Parser_Test.
 *
 * @group sitemaps
 */
class WPSEO_Sitemap_Image_Parser_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Sitemap_Image_Parser
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 */
	public function set_up() {
		parent::set_up();

		self::$class_instance = new WPSEO_Sitemap_Image_Parser();
	}

	/**
	 * Tests the get_images function.
	 *
	 * @covers WPSEO_Sitemap_Image_Parser::get_images
	 */
	public function test_get_images() {

		$content_src = 'http://example.org/content-image.jpg';
		$post_id     = $this->factory->post->create(
			[ 'post_content' => "<img src='{$content_src}' alt='jibberish' />" ]
		);

		$images = self::$class_instance->get_images( get_post( $post_id ) );
		$this->assertNotEmpty( $images[0] );
		$content_image = $images[0];
		$this->assertEquals( $content_src, $content_image['src'] );
	}
}
