<?php

/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Presenters\Post_Type;

use Yoast\WP\Free\Presenters\Post_Type\Twitter_Image_Presenter;
use Yoast\WP\Free\Tests\Doubles\Presenters\Post_Type\Twitter_Image_Presenter_Double;
use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;
use Mockery;

/**
 * Class Twitter_Image_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Post_Type\Twitter_Image_Presenter
 *
 * @group twitter-image
 */
class Twitter_Image_Presenter_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Twitter_Image_Presenter_Double
	 */
	protected $class_instance;

	/**
	 * Mocked WP_Post.
	 *
	 * @var \WP_Post
	 */
	protected $mock_post;

	/**
	 * Sets up the test instance.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->mock_post               = Mockery::mock( '\WP_Post' )
												->makePartial();
		$this->mock_post->ID           = 1;
		$this->mock_post->post_content = '';

		$this->class_instance = new Twitter_Image_Presenter_Double();
	}

	/**
	 * Tests retrieving the featured image url when the has_post_thumbnail function does not exist.
	 *
	 * @covers ::retrieve_featured_image
	 */
	public function test_retrieve_featured_image_function_does_not_exist() {
		$image_url = $this->class_instance->retrieve_featured_image( $this->mock_post->ID );
		$this->assertEmpty( $image_url );
	}

	/**
	 * Tests retrieving the featured image url when the post has no image attached.
	 *
	 * @covers ::retrieve_featured_image
	 */
	public function test_retrieve_featured_image_no_post_thumbnail() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->with( $this->mock_post->ID )
			->andReturn( false );

		$image_url = $this->class_instance->retrieve_featured_image( $this->mock_post->ID );
		$this->assertEmpty( $image_url );
	}

	/**
	 * Tests retrieving the featured image url when the post has a thumbnail and a full image attached.
	 *
	 * @covers ::retrieve_featured_image
	 */
	public function test_retrieve_featured_image_post_has_thumbnail_and_image_attached() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->with( $this->mock_post->ID )
			->andReturn( true );
		Monkey\Functions\expect( 'apply_filters' )
			->with ( 'wpseo_twitter_image_size', 'full' )
			->andReturn( 'full' );
		Monkey\Functions\expect ( 'get_post_thumbnail_id' )
			->with( $this->mock_post->ID )
			->andReturn( 11 );
		Monkey\Functions\expect( 'wp_get_attachment_image_src' )
			->with ( get_post_thumbnail_id( $this->mock_post->ID ), 'full' )
			->andReturn( [ 'https://example.com/media/image.jpg', '100px', '200px', false ] );

		$expected = 'https://example.com/media/image.jpg';
		$image_url = $this->class_instance->retrieve_featured_image( $this->mock_post->ID );
		$this->assertEquals( $expected, $image_url );
	}

	/**
	 * Tests retrieving the featured image url when the post has a thumbnail but no full image attached.
	 *
	 * @covers ::retrieve_featured_image
	 */
	public function test_retrieve_featured_image_post_has_thumbnail() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->with( $this->mock_post->ID )
			->andReturn( true );
		Monkey\Functions\expect( 'apply_filters' )
			->with ( 'wpseo_twitter_image_size', 'full' )
			->andReturn( 'full' );
		Monkey\Functions\expect ( 'get_post_thumbnail_id' )
			->with( $this->mock_post->ID )
			->andReturn( 11 );
		Monkey\Functions\expect( 'wp_get_attachment_image_src' )
			->with ( get_post_thumbnail_id( $this->mock_post->ID ), 'full' )
			->andReturn( false );

		$image_url = $this->class_instance->retrieve_featured_image( $this->mock_post->ID );
		$this->assertEmpty( $image_url );
	}

	/**
	 * Tests retrieving the first image url of a gallery when there is no gallery.
	 *
	 * @covers ::retrieve_gallery_image
	 */
	public function test_retrieve_gallery_image_when_gallery_is_absent() {
		Monkey\Functions\expect( 'get_post' )
			->with( $this->mock_post->ID )
			->andReturn( $this->mock_post );
		Monkey\Functions\expect( 'has_shortcode' )
			->with( $this->mock_post->post_content, 'gallery' )
			->andReturn( false );
		Monkey\Functions\expect( 'get_post_gallery_images' )
			->never();

		$image_url = $this->class_instance->retrieve_gallery_image( $this->mock_post->ID );
		$this->assertEmpty( $image_url );
	}

	/**
	 * Tests retrieving the first image url of a gallery when there is an empty gallery.
	 *
	 * @covers ::retrieve_gallery_image
	 */
	public function test_retrieve_gallery_image_when_gallery_is_empty() {
		Monkey\Functions\expect( 'get_post' )
			->with( $this->mock_post->ID )
			->andReturn( $this->mock_post );
		Monkey\Functions\expect( 'has_shortcode' )
			->with( $this->mock_post->post_content, 'gallery' )
			->andReturn( true );
		Monkey\Functions\expect( 'get_post_gallery_images' )
			->andReturn( [] );

		$image_url = $this->class_instance->retrieve_gallery_image( $this->mock_post->ID );
		$this->assertEmpty( $image_url );
	}

	/**
	 * Tests retrieving the first image url of a gallery when there is a gallery.
	 *
	 * @covers ::retrieve_gallery_image
	 */
	public function test_retrieve_gallery_image_when_gallery_is_present() {
		Monkey\Functions\expect( 'get_post' )
			->with( $this->mock_post->ID )
			->andReturn( $this->mock_post );
		Monkey\Functions\expect( 'has_shortcode' )
			->with( $this->mock_post->post_content, 'gallery' )
			->andReturn( true );
		Monkey\Functions\expect( 'get_post_gallery_images' )
			->andReturn( [ 'https://example.com/media/image.jpg', 'https://example.com/media/image2.jpg' ] );

		$expected = 'https://example.com/media/image.jpg';
		$images = $this->class_instance->retrieve_gallery_image( $this->mock_post->ID );
		$this->assertEquals( $expected, $images );
	}

	/**
	 * Tests retrieving the first image url from the content.
	 *
	 * @covers ::retrieve_content_image
	 */
	public function test_retrieve_content_image() {
		$expected = 'https://example.com/media/content_image.jpg';

		\Mockery::mock('alias:WPSEO_Image_Utils')
			->shouldReceive('get_first_usable_content_image_for_post')
			->with( $this->mock_post->ID )
			->once()
			->andReturn($expected);

		$image_url = $this->class_instance->retrieve_content_image( $this->mock_post->ID );
		$this->assertEquals( $expected, $image_url );
	}

	/**
	 * Tests whether an empty string is returned when the content contains no image.
	 *
	 * @covers ::retrieve_content_image
	 */
	public function test_retrieve_content_image_no_image_in_content() {
		\Mockery::mock('alias:WPSEO_Image_Utils')
			->shouldReceive('get_first_usable_content_image_for_post')
			->with( $this->mock_post->ID )
			->once()
			->andReturn(null);

		$image_url = $this->class_instance->retrieve_content_image( $this->mock_post->ID );
		$this->assertEmpty( $image_url );
	}
}
