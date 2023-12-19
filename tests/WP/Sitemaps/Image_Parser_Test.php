<?php

namespace Yoast\WP\SEO\Tests\WP\Sitemaps;

use WPSEO_Sitemap_Image_Parser;
use Yoast\WP\SEO\Tests\WP\Doubles\Inc\Sitemap_Image_Parser_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Image_Parser_Test.
 *
 * @group sitemaps
 */
final class Image_Parser_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Sitemap_Image_Parser
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		self::$class_instance = new WPSEO_Sitemap_Image_Parser();
	}

	/**
	 * Tests the get_images function.
	 *
	 * @covers WPSEO_Sitemap_Image_Parser::get_images
	 *
	 * @return void
	 */
	public function test_get_images() {

		$content_src = 'http://example.org/content-image.jpg';
		$post_id     = $this->factory->post->create(
			[ 'post_content' => "<img src='{$content_src}' alt='jibberish' />" ]
		);

		$images = self::$class_instance->get_images( \get_post( $post_id ) );
		$this->assertNotEmpty( $images[0] );
		$content_image = $images[0];
		$this->assertEquals( $content_src, $content_image['src'] );
	}

	/**
	 * Tests the get_gallery_attachments function.
	 *
	 * @covers WPSEO_Sitemap_Image_Parser::get_gallery_attachments
	 *
	 * @link https://github.com/Yoast/wordpress-seo/issues/8634
	 *
	 * @return void
	 */
	public function test_parse_galleries() {
		/**
		 * The test instance.
		 *
		 * @var Sitemap_Image_Parser_Double $image_parser
		 */
		$image_parser = $this->getMockBuilder( Sitemap_Image_Parser_Double::class )
			->setMethods( [ 'get_content_galleries', 'get_gallery_attachments' ] )
			->getMock();

		$image_parser
			->expects( $this->once() )
			->method( 'get_content_galleries' )
			->willReturn( [ [ 'id' => 1 ] ] );

		$a = (object) [ 'a', 'b' ];
		$b = (object) 1234;
		$c = (object) 'some string';

		$attachments = [ $a, $b, $c, $a, $c ];

		$image_parser
			->expects( $this->once() )
			->method( 'get_gallery_attachments' )
			->willReturn( $attachments );

		$attachments = $image_parser->parse_galleries( '' );

		$this->assertContains( $a, $attachments );
		$this->assertContains( $b, $attachments );
		$this->assertContains( $c, $attachments );
	}
}
