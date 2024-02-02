<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph;
use Yoast\WP\SEO\Helpers\Twitter;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Social_Image_Trait_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Social_Image_Trait_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Social_Image_Trait
 * @covers \Yoast\WP\SEO\Builders\Indexable_Social_Image_Trait
 */
final class Indexable_Social_Image_Trait_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Indexable_Social_Image_Trait_Double
	 */
	protected $instance;

	/**
	 * The twitter image helper mock.
	 *
	 * @var Mockery\MockInterface|Twitter\Image_Helper
	 */
	protected $twitter_image;

	/**
	 * The open graph image helper mock.
	 *
	 * @var Mockery\MockInterface|Open_Graph\Image_Helper
	 */
	protected $open_graph_image;

	/**
	 * The image helper mock.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * The indexable mock.
	 *
	 * @var Mockery\MockInterface|Indexable
	 */
	protected $indexable;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Indexable_Social_Image_Trait_Double::class );

		$this->twitter_image    = Mockery::mock( Twitter\Image_Helper::class );
		$this->open_graph_image = Mockery::mock( Open_Graph\Image_Helper::class );
		$this->image            = Mockery::mock( Image_Helper::class );

		$this->instance->set_social_image_helpers( $this->image, $this->open_graph_image, $this->twitter_image );
	}

	/**
	 * Tests setting the social image helpers.
	 *
	 * @covers ::set_social_image_helpers
	 *
	 * @return void
	 */
	public function test_set_social_image_helpers() {
		$this->instance->set_social_image_helpers( $this->image, $this->open_graph_image, $this->twitter_image );

		self::assertInstanceOf(
			Twitter\Image_Helper::class,
			$this->getPropertyValue( $this->instance, 'twitter_image' )
		);
		self::assertInstanceOf(
			Open_Graph\Image_Helper::class,
			$this->getPropertyValue( $this->instance, 'open_graph_image' )
		);
		self::assertInstanceOf(
			Image_Helper::class,
			$this->getPropertyValue( $this->instance, 'image' )
		);
	}

	/**
	 * Tests the resetting of social images.
	 *
	 * @covers ::reset_social_images
	 *
	 * @return void
	 */
	public function test_reset_social_images() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->indexable->orm->expects( 'set' )->with( 'open_graph_image', null );
		$this->indexable->orm->expects( 'set' )->with( 'open_graph_image_id', null );
		$this->indexable->orm->expects( 'set' )->with( 'open_graph_image_source', null );
		$this->indexable->orm->expects( 'set' )->with( 'open_graph_image_meta', null );

		$this->indexable->orm->expects( 'set' )->with( 'twitter_image', null );
		$this->indexable->orm->expects( 'set' )->with( 'twitter_image_id', null );
		$this->indexable->orm->expects( 'set' )->with( 'twitter_image_source', null );

		$this->instance->reset_social_images_double( $this->indexable );
	}

	/**
	 * Tests that social images are correctly set on the indexable
	 * when both Twitter and Open Graph images are set by the user.
	 *
	 * @covers ::handle_social_images
	 * @covers ::set_open_graph_image_meta_data
	 *
	 * @return void
	 */
	public function test_handle_social_images_when_images_are_set_by_user() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$image_meta = [
			'width'  => 640,
			'height' => 480,
			'url'    => 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg',
			'path'   => '/var/www/html/wp-content/uploads/2020/07/WordPress5.jpg',
			'size'   => 'full',
			'id'     => 13,
			'alt'    => '',
			'pixels' => 307200,
			'type'   => 'image/jpeg',
		];

		$this->open_graph_image_set_by_user( $image_meta );
		$this->twitter_image_set_by_user();

		// We expect the twitter and open graph sources to be 'set-by-user'.
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image_source', 'set-by-user' );
		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image_source', 'set-by-user' );

		// We expect the open graph image and meta data to be set.
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image', 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg' );
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image_meta', \json_encode( $image_meta, ( \JSON_PRETTY_PRINT | \JSON_UNESCAPED_SLASHES ) ) );

		// We expect twitter image meta to be set.
		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image', 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress6.jpg' );

		// Since both images are already set by the user, we do not expect to search for an alternative image.
		$this->instance->expects( 'find_alternative_image' )
			->never();

		$this->instance->handle_social_images_double( $this->indexable );
	}

	/**
	 * Tests that social images are correctly set on the indexable
	 * when the Twitter image is not set by the user.
	 *
	 * @covers ::handle_social_images
	 * @covers ::set_open_graph_image_meta_data
	 * @covers ::set_alternative_image
	 *
	 * @return void
	 */
	public function test_handle_social_images_when_twitter_image_is_not_set_by_user() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$image_meta = [
			'width'  => 640,
			'height' => 480,
			'url'    => 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg',
			'path'   => '/var/www/html/wp-content/uploads/2020/07/WordPress5.jpg',
			'size'   => 'full',
			'id'     => 13,
			'alt'    => '',
			'pixels' => 307200,
			'type'   => 'image/jpeg',
		];

		$this->no_twitter_image();
		$this->open_graph_image_set_by_user( $image_meta );

		// We expect the open graph source to be 'set-by-user'.
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image_source', 'set-by-user' );
		$this->indexable->orm->expects( 'set' )
			->never()
			->with( 'twitter_image_source', 'set-by-user' );

		// We expect the open graph image and meta data to be set.
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image', 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg' );
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image_meta', \json_encode( $image_meta, ( \JSON_PRETTY_PRINT | \JSON_UNESCAPED_SLASHES ) ) );

		$alternative_image = [
			'image_id' => 'featured-image-id',
			'source'   => 'featured-image',
		];

		// We expect to find an alternative image.
		$this->instance->expects( 'find_alternative_image' )
			->once()
			->with( $this->indexable )
			->andReturn( $alternative_image );

		$this->twitter_image->expects( 'get_by_id' )
			->with( 'featured-image-id' )
			->andReturn( 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress6.jpg' );

		// We expect twitter image meta to be set.
		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image', 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress6.jpg' );

		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image_source', 'featured-image' );

		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image_id', 'featured-image-id' );

		$this->instance->handle_social_images_double( $this->indexable );
	}

	/**
	 * Tests that social images are correctly set on the indexable
	 * when the Open Graph image is not set by the user.
	 *
	 * @covers ::handle_social_images
	 * @covers ::set_open_graph_image_meta_data
	 * @covers ::set_alternative_image
	 *
	 * @return void
	 */
	public function test_handle_social_images_when_og_image_is_not_set_by_user() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->twitter_image_set_by_user();
		$this->no_open_graph_image();

		// We expect the twitter source to be 'set-by-user'.
		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image_source', 'set-by-user' );
		$this->indexable->orm->expects( 'set' )
			->never()
			->with( 'open_graph_image_source', 'set-by-user' );

		// We expect twitter image to be set.
		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image', 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress6.jpg' );

		$alternative_image = [
			'image_id' => 'featured-image-id',
			'source'   => 'featured-image',
		];

		// We expect to find an alternative image.
		$this->instance->expects( 'find_alternative_image' )
			->once()
			->with( $this->indexable )
			->andReturn( $alternative_image );

		// We expect the open graph image to be set to this alternative image.
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image_source', 'featured-image' );

		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image_id', 'featured-image-id' );

		$this->instance->handle_social_images_double( $this->indexable );
	}

	/**
	 * Tests that social images are correctly set on the indexable
	 * when the Twitter image id is not set by the user.
	 *
	 * @covers ::handle_social_images
	 * @covers ::set_open_graph_image_meta_data
	 * @covers ::set_alternative_image
	 *
	 * @return void
	 */
	public function test_handle_social_images_when_twitter_image_id_is_not_set_by_user() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$image_meta = [
			'width'  => 640,
			'height' => 480,
			'url'    => 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg',
			'path'   => '/var/www/html/wp-content/uploads/2020/07/WordPress5.jpg',
			'size'   => 'full',
			'id'     => 13,
			'alt'    => '',
			'pixels' => 307200,
			'type'   => 'image/jpeg',
		];

		$this->no_twitter_image();
		$this->open_graph_image_set_by_user( $image_meta );

		// We expect the open graph source to be 'set-by-user'.
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image_source', 'set-by-user' );
		$this->indexable->orm->expects( 'set' )
			->never()
			->with( 'twitter_image_source', 'set-by-user' );

		// We expect the open graph image and meta data to be set.
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image', 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg' );
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image_meta', \json_encode( $image_meta, ( \JSON_PRETTY_PRINT | \JSON_UNESCAPED_SLASHES ) ) );

		$alternative_image = [
			'image'  => 'featured-image.jpeg',
			'source' => 'featured-image',
		];

		// We expect to find an alternative image.
		$this->instance->expects( 'find_alternative_image' )
			->once()
			->with( $this->indexable )
			->andReturn( $alternative_image );

		// We expect the twitter image to be set to this alternative image.
		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image', 'featured-image.jpeg' );

		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image_source', 'featured-image' );

		$this->instance->handle_social_images_double( $this->indexable );
	}

	/**
	 * Tests that social images are correctly set on the indexable
	 * when the Open Graph image id is not set.
	 *
	 * @covers ::handle_social_images
	 * @covers ::set_open_graph_image_meta_data
	 * @covers ::set_alternative_image
	 *
	 * @return void
	 */
	public function test_handle_social_images_when_og_image_id_is_not_set_by_user() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->twitter_image_set_by_user();
		$this->no_open_graph_image();

		// We expect the twitter source to be 'set-by-user'.
		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image_source', 'set-by-user' );
		$this->indexable->orm->expects( 'set' )
			->never()
			->with( 'open_graph_image_source', 'set-by-user' );

		// We expect twitter image to be set.
		$this->indexable->orm->expects( 'set' )
			->with( 'twitter_image', 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress6.jpg' );

		$alternative_image = [
			'image'  => 'featured-image.jpeg',
			'source' => 'featured-image',
		];

		// We expect to find an alternative image.
		$this->instance->expects( 'find_alternative_image' )
			->once()
			->with( $this->indexable )
			->andReturn( $alternative_image );

		// We expect the open graph image to be set to this alternative image.
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image_source', 'featured-image' );

		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image', 'featured-image.jpeg' );

		$this->instance->handle_social_images_double( $this->indexable );
	}

	/**
	 * Mocks a Twitter image that has been set by the user.
	 *
	 * @return void
	 */
	protected function twitter_image_set_by_user() {
		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'twitter_image' )
			->andReturn( 'twitter-image' );

		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'twitter_image_id' )
			->andReturn( 'twitter-image-id' );

		$this->twitter_image->shouldReceive( 'get_by_id' )
			->with( 'twitter-image-id' )
			->andReturn( 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress6.jpg' );

		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'twitter_image_source' )
			->andReturn( 'set-by-user' );
	}

	/**
	 * Mocks a missing Twitter image.
	 *
	 * @return void
	 */
	protected function no_twitter_image() {
		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'twitter_image' )
			->andReturn( null );

		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'twitter_image_id' )
			->andReturn( null );

		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'twitter_image_source' )
			->andReturn( null );
	}

	/**
	 * Mocks a missing Open Graph image.
	 *
	 * @return void
	 */
	protected function no_open_graph_image() {
		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'open_graph_image' )
			->andReturn( null );

		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'open_graph_image_id' )
			->andReturn( null );

		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'open_graph_image_source' )
			->andReturn( null );
	}

	/**
	 * Mocks an Open Graph image that is set by the user.
	 *
	 * @param array $image_meta The mocked meta data of the image.
	 *
	 * @return void
	 */
	protected function open_graph_image_set_by_user( $image_meta ) {
		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'open_graph_image' )
			->andReturn( 'open-graph-image' );

		$this->indexable->orm->shouldReceive( 'get' )
			->twice()
			->with( 'open_graph_image_id' )
			->andReturn( 'open-graph-image-id' );

		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'open_graph_image_source' )
			->andReturn( 'set-by-user' );

		$this->open_graph_image->shouldReceive( 'get_image_by_id' )
			->with( 'open-graph-image-id' )
			->andReturn( $image_meta );
	}
}
