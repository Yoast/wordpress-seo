<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Term_Archive_Presentation;

use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Abstract_Robots_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Term_Archive_Presentation
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
		parent::setUp();

		$this->setInstance();
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
	public function test_with_applied_filter_returning_false() {
		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_twitter_taxonomy_image', false )
			->andReturn( false );

		$this->options_helper
			->expects( 'get' )
			->with( 'opengraph' )
			->once()
			->andReturnFalse();

		$this->assertEmpty( $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where the default image is given.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_with_applied_filter() {
		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_twitter_taxonomy_image', false )
			->andReturn( 'filtered_image.jpg' );


		$this->assertEquals( 'filtered_image.jpg', $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where the opengraph default image is given.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_with_default_image() {
		$this->options_helper
			->expects( 'get' )
			->times( 3 )
			->andReturn( true, 0, 'default_image.jpg' );

		$this->assertEquals( 'default_image.jpg', $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where the default image is given.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function _test_with_() {
		$this->options_helper
			->expects( 'get' )
			->twice()
			->andReturn( true, 'default_image.jpg' );

		$this->assertEquals( 'default_image.jpg', $this->instance->generate_twitter_image() );
	}
}
