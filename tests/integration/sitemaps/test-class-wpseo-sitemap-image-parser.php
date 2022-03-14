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

		$content_src   = 'http://example.org/content-image.jpg';
		$content_title = 'Content image title.';
		$content_alt   = 'Content image alt.';
		$post_id       = $this->factory->post->create(
			[ 'post_content' => "<img src='{$content_src}' title='{$content_title}' alt='{$content_alt}' />" ]
		);

		$images = self::$class_instance->get_images( get_post( $post_id ) );
		$this->assertNotEmpty( $images[0] );
		$content_image = $images[0];
		$this->assertEquals( $content_src, $content_image['src'] );
		$this->assertEquals( $content_title, $content_image['title'] );
		$this->assertEquals( $content_alt, $content_image['alt'] );
	}

	/**
	 * Tests the get_gallery_attachments function.
	 *
	 * @covers WPSEO_Sitemap_Image_Parser::get_gallery_attachments
	 *
	 * @link https://github.com/Yoast/wordpress-seo/issues/8634
	 */
	public function test_parse_galleries() {
		/**
		 * The test instance.
		 *
		 * @var WPSEO_Sitemap_Image_Parser_Double $image_parser
		 */
		$image_parser = $this->getMockBuilder( 'WPSEO_Sitemap_Image_Parser_Double' )
			->setMethods( [ 'get_content_galleries', 'get_gallery_attachments' ] )
			->getMock();

		$image_parser
			->expects( $this->once() )
			->method( 'get_content_galleries' )
			->will( $this->returnValue( [ [ 'id' => 1 ] ] ) );

		$a = (object) [ 'a', 'b' ];
		$b = (object) 1234;
		$c = (object) 'some string';

		$attachments = [ $a, $b, $c, $a, $c ];

		$image_parser
			->expects( $this->once() )
			->method( 'get_gallery_attachments' )
			->will( $this->returnValue( $attachments ) );

		$attachments = $image_parser->parse_galleries( '' );

		$this->assertContains( $a, $attachments );
		$this->assertContains( $b, $attachments );
		$this->assertContains( $c, $attachments );
	}
}
