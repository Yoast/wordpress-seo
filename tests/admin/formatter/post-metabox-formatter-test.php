<?php

namespace Yoast\WP\SEO\Tests\Admin\Formatter;

use Brain\Monkey;
use Mockery;
use WP_Post;
use Yoast\WP\SEO\Tests\Doubles\Admin\Formatter\Post_Metabox_Formatter_Double;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Post_Metabox_Formatter
 *
 * @group Formatter
 */
class Post_Metabox_Formatter_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Post_Metabox_Formatter_Double
	 */
	private $instance;

	/**
	 * Mocked WP_Post.
	 *
	 * @var WP_Post
	 */
	private $mock_post;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->mock_post               = Mockery::mock( '\WP_Post' )->makePartial();
		$this->mock_post->ID           = 1;
		$this->mock_post->post_content = '';

		$this->instance = new Post_Metabox_Formatter_Double( $this->mock_post, [], '' );
	}

	/**
	 * Get the image URL when a featured image is set, and there is no image in the content.
	 *
	 * @covers ::get_image_url
	 */
	public function test_get_image_url_featured_image_set_content_has_no_image() {
		$expected = 'https://example.com/media/featured_image.jpg';

		Monkey\Functions\expect( 'has_post_thumbnail' )
			->andReturn( true );
		Monkey\Functions\expect( 'get_post_thumbnail_id' )
			->once()
			->andReturn( 123 );
		Monkey\Functions\expect( 'wp_get_attachment_image_src' )
			->once()
			->andReturn( [ 'https://example.com/media/featured_image.jpg' ] );

		$url = $this->instance->get_image_url();

		$this->assertEquals( $expected, $url );
	}

	/**
	 * Get the image URL when no featured image is set, and there are images in the content.
	 *
	 * @covers ::get_image_url
	 */
	public function test_get_image_url_no_featured_image_set_content_has_multiple_images() {
		$expected = 'https://example.com/media/content_image.jpg';

		$this->mock_post->post_content = '<img src="https://example.com/media/content_image.jpg"/><img src="https://example.com/media/content_image_2.jpg"/>';

		Monkey\Functions\expect( 'has_post_thumbnail' )
			->andReturn( false );
		Monkey\Functions\expect( 'get_post' )
			->andReturn( $this->mock_post );

		$url = $this->instance->get_image_url();

		$this->assertEquals( $expected, $url );
	}

	/**
	 * Get the image URL when a featured image is set, and there is an image in the content.
	 *
	 * @covers ::get_image_url
	 */
	public function test_get_image_url_featured_image_set_content_has_an_image() {
		$expected = 'https://example.com/media/featured_image.jpg';

		$this->mock_post->post_content = '<img src="https://example.com/media/content_image.jpg"/><img src="https://example.com/media/content_image_2.jpg"/>';

		Monkey\Functions\expect( 'has_post_thumbnail' )
			->andReturn( true );
		Monkey\Functions\expect( 'get_post_thumbnail_id' )
			->once()
			->andReturn( 123 );
		Monkey\Functions\expect( 'wp_get_attachment_image_src' )
			->once()
			->andReturn( [ 'https://example.com/media/featured_image.jpg' ] );
		Monkey\Functions\expect( 'get_post' )
			->andReturn( $this->mock_post );

		$url = $this->instance->get_image_url();

		$this->assertEquals( $expected, $url );
	}

	/**
	 * Get the image URL when no featured image is set, and there is no image in the content.
	 *
	 * @covers ::get_image_url
	 */
	public function test_get_image_url_no_featured_image_set_content_has_no_image() {
		$expected = null;

		Monkey\Functions\expect( 'has_post_thumbnail' )
			->andReturn( false );
		Monkey\Functions\expect( 'wp_get_attachment_image_src' )
			->never();
		Monkey\Functions\expect( 'get_post' )
			->andReturn( $this->mock_post );

		$url = $this->instance->get_image_url();

		$this->assertEquals( $expected, $url );
	}
}
