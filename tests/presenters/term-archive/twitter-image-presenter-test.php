<?php

/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Presenters\Term_Archive;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Term_Archive\Twitter_Image_Presenter;
use Yoast\WP\Free\Tests\Doubles\Presenters\Term_Archive\Twitter_Image_Presenter_Double;
use Yoast\WP\Free\Tests\TestCase;
use Mockery;

/**
 * Class Twitter_Image_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Term_Archive\Twitter_Image_Presenter
 *
 * @group twitter
 * @group twitter-image
 */
class Twitter_Image_Presenter_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Twitter_Image_Presenter|\Mockery\MockInterface
	 */
	protected $class_instance;

	/**
	 * Sets up the test instance.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = Mockery::mock( Twitter_Image_Presenter::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests retrieving the image url to use with a social image being set.
	 *
	 * @covers ::generate
	 */
	public function test_generate_with_social_image_set() {
		$indexable = new Indexable();

		$this->class_instance
			->shouldReceive( 'retrieve_social_image' )
			->once()
			->with( $indexable )
			->andReturn( 'social_image.jpg' );

		$this->class_instance
			->shouldReceive( 'retrieve_default_image' )
			->never();

		$this->assertEquals( 'social_image.jpg', $this->class_instance->generate( $indexable ) );
	}

	/**
	 * Tests retrieving the featured image url when the has_post_thumbnail function does not exist.
	 *
	 * @covers ::generate
	 */
	public function test_generate_with_filter_image() {
		$indexable = new Indexable();

		$this->class_instance
			->shouldReceive( 'retrieve_social_image' )
			->once()
			->with( $indexable )
			->andReturn( '' );

		$this->class_instance
			->shouldReceive( 'retrieve_filter_image' )
			->once()
			->andReturn( 'filter_image.jpg' );

		$this->assertEquals( 'filter_image.jpg', $this->class_instance->generate( $indexable ) );
	}

	/**
	 * Tests retrieving the featured image url when the has_post_thumbnail function does not exist.
	 *
	 * @covers ::generate
	 */
	public function test_generate_with_default_image() {
		$indexable = new Indexable();

		$this->class_instance
			->shouldReceive( 'retrieve_social_image' )
			->once()
			->with( $indexable )
			->andReturn( '' );

		$this->class_instance
			->shouldReceive( 'retrieve_filter_image' )
			->once()
			->andReturn( '' );

		$this->class_instance
			->shouldReceive( 'retrieve_default_image' )
			->once()
			->andReturn( 'default_image.jpg' );

		$this->assertEquals( 'default_image.jpg', $this->class_instance->generate( $indexable ) );
	}


	/**
	 * Tests retrieving the image set by the filter.
	 *
	 * @covers ::retrieve_filter_image
	 */
	public function test_retrieve_filter_image() {
		\Brain\Monkey\Functions\expect( 'apply_filters' )
			->once()
			->andReturn( 'filter_image.jpg' );

		$instance = new Twitter_Image_Presenter_Double();

		$this->assertEquals( 'filter_image.jpg', $instance->retrieve_filter_image() );
	}

	/**
	 * Tests retrieving the image set by the filter.
	 *
	 * @covers ::retrieve_filter_image
	 */
	public function test_retrieve_filter_image_with_no_value_given() {
		\Brain\Monkey\Functions\expect( 'apply_filters' )
			->once()
			->andReturn( false );

		$instance = new Twitter_Image_Presenter_Double();

		$this->assertEmpty( $instance->retrieve_filter_image() );
	}
}
