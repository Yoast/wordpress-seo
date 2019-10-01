<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Home_Page_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Abstract_Robots_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Home_Page_Presentation
 *
 * @group presentations
 * @group twitter
 * @group twitter-image
 */
class Twitter_Image_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->setInstance();

		return parent::setUp();
	}

	/**
	 * Tests the situation where the twitter image is given.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_with_set_twitter_image() {
		$this->indexable->twitter_image = 'twitter_image.jpg';

		$this->assertEquals( 'twitter_image.jpg', $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where no twitter image is set and the opengraph is disabled.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_with_opengraph_disabled() {
		$this->options_helper
			->expects( 'get' )
			->twice()
			->with( 'opengraph' )
			->andReturnFalse();

		$this->indexable->og_image = 'facebook_image.jpg';

		$this->assertEmpty( $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where the opengraph image is given.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_with_opengraph_image() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'opengraph' )
			->andReturnTrue();

		$this->indexable->og_image = 'facebook_image.jpg';

		$this->assertEquals( 'facebook_image.jpg', $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where the default image is given.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_with_default_image() {
		$this->options_helper
			->expects( 'get' )
			->twice()
			->andReturn( true, 'default_image.jpg' );

		$this->assertEquals( 'default_image.jpg', $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where the default image is given.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_with_no_default_image() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturnFalse();

		$this->assertEmpty( $this->instance->generate_twitter_image() );
	}
}
