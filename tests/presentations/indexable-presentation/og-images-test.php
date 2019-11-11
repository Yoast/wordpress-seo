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
		$this->set_instance();

		parent::setUp();
	}

	/**
	 * Tests the situation where the featured image id is set.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_opengraph_disabled() {
		$this->context->open_graph_enabled = false;

		$this->assertEmpty( $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the og_image_id isn't set but the og_image is.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_generator_result() {
		$this->indexable->og_image = 'facebook_image.jpg';

		$this->og_image_generator
			->expects( 'generate' )
			->once()
			->with( $this->context )
			->andReturn( [ 'facebook_image.jpg' ] );

		$this->assertEquals( [ 'facebook_image.jpg' ], $this->instance->generate_og_images() );
	}

}
