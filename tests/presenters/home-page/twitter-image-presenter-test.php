<?php

/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Presenters\Home_Page;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Home_Page\Twitter_Image_Presenter;
use Yoast\WP\Free\Tests\TestCase;
use Mockery;

/**
 * Class Twitter_Image_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Home_Page\Twitter_Image_Presenter
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
	public function test_generate_with_no_social_image_set() {
		$indexable = new Indexable();

		$this->class_instance
			->shouldReceive( 'retrieve_social_image' )
			->once()
			->with( $indexable )
			->andReturn( '' );

		$this->class_instance
			->shouldReceive( 'retrieve_default_image' )
			->once()
			->andReturn( 'default_image.jpg' );

		$this->assertEquals( 'default_image.jpg', $this->class_instance->generate( $indexable ) );

//		$image_url = $this->class_instance->retrieve_featured_image( $this->mock_post->ID );
//		$this->assertEmpty( $image_url );
	}

}
