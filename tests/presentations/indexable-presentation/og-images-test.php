<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_Images_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group opengraph
 * @group opengraph-image
 */
class OG_Images_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		$this->setInstance();

		parent::setUp();
	}

	/**
	 * Tests the situation where the og_image_id is set.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_og_image_id() {
		$this->indexable->og_image_id = 2;

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->andReturn( 'default_image.jpg' );

		$this->assertEquals( [ 'default_image.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the og_image_id isn't set but the og_image is.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with__og_image() {
		$this->indexable->og_image = 'default_image.jpg';

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->andReturnFalse();

		$this->assertEquals( [ 'default_image.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where no situation is applicable.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_no_applicable_situation() {
		$this->instance
			->expects( 'get_default_og_image' )
			->once()
			->andReturnFalse();

		$this->assertEquals( [], $this->instance->generate_og_images() );
	}

}
