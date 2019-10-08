<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Twitter_Image_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class Twitter_Image_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests the situation where the Twitter image is given.
	 *
	 * ::covers generate_twitter_image
	 */
	public function test_generate_twitter_image() {
		$this->indexable->twitter_image = 'Example of Twitter image';

		$this->assertEquals( 'Example of Twitter image', $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * ::covers generate_twitter_image
	 */
	public function test_generate_twitter_image_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_twitter_image() );
	}
}
