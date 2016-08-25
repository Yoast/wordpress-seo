<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Class WPSEO_Sitemap_Image_Parser_Test
 */
class WPSEO_Sitemap_Image_Parser_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Sitemap_Image_Parser
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public function setUp() {
		parent::setUp();

		self::$class_instance = new WPSEO_Sitemap_Image_Parser();
	}

	/**
	 * @covers WPSEO_Sitemap_Image_Parser_Test::get_images
	 */
	public function test_get_images() {

		$content_src   = 'http://example.org/content-image.jpg';
		$content_title = 'Content image title.';
		$content_alt   = 'Content image alt.';
		$post_id       = $this->factory->post->create( array(
			'post_content' => "<img src='{$content_src}' title='{$content_title}' alt='{$content_alt}' />",
		) );

		$images = self::$class_instance->get_images( get_post( $post_id ) );
		$this->assertNotEmpty( $images[0] );
		$content_image = $images[0];
		$this->assertEquals( $content_src, $content_image['src'] );
		$this->assertEquals( $content_title, $content_image['title'] );
		$this->assertEquals( $content_alt, $content_image['alt'] );
	}
}
