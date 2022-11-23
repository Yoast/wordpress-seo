<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Formatter;

use Brain\Monkey;
use Mockery;
use WP_Post;
use Yoast\WP\SEO\Tests\Unit\Doubles\Admin\Formatter\Post_Metabox_Formatter_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	protected function set_up() {
		parent::set_up();

		$this->mock_post               = Mockery::mock( WP_Post::class )->makePartial();
		$this->mock_post->ID           = 1;
		$this->mock_post->post_content = '';

		$this->instance = new Post_Metabox_Formatter_Double( $this->mock_post, [], '' );
	}

	/**
	 * Get the image URL when there is one image in the content.
	 *
	 * @covers ::get_image_url
	 */
	public function test_get_image_url_content_has_one_image() {
		$expected = 'https://example.com/media/content_image.jpg';

		$this->mock_post->post_content = 'Post <img src="https://example.com/media/content_image.jpg"/> content.';

		Monkey\Functions\expect( 'get_post' )
			->andReturn( $this->mock_post );

		$url = $this->instance->get_image_url();

		$this->assertEquals( $expected, $url );
	}

	/**
	 * Get the image URL when there are multiple images in the content.
	 *
	 * @covers ::get_image_url
	 */
	public function test_get_image_url_content_has_multiple_images() {
		$expected = 'https://example.com/media/content_image.jpg';

		$this->mock_post->post_content = '<img src="https://example.com/media/content_image.jpg"/><img src="https://example.com/media/content_image_2.jpg"/>';

		Monkey\Functions\expect( 'get_post' )
			->andReturn( $this->mock_post );

		$url = $this->instance->get_image_url();

		$this->assertEquals( $expected, $url );
	}

	/**
	 * Get the image URL when there is no image in the content.
	 *
	 * @covers ::get_image_url
	 */
	public function test_get_image_url_content_has_no_image() {
		$expected = null;

		Monkey\Functions\expect( 'wp_get_attachment_image_src' )
			->never();
		Monkey\Functions\expect( 'get_post' )
			->andReturn( $this->mock_post );

		$url = $this->instance->get_image_url();

		$this->assertEquals( $expected, $url );
	}
}
