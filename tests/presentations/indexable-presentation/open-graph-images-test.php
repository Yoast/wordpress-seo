<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Open_Graph_Images_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 * @group open-graph-image
 */
class Open_Graph_Images_Test extends TestCase {
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
	 * @covers ::generate_open_graph_images
	 */
	public function test_with_open_graph_disabled() {
		$this->context->open_graph_enabled = false;

		$this->assertEmpty( $this->instance->generate_open_graph_images() );
	}

	/**
	 * Tests the situation where the open_graph_image_id isn't set but the open_graph_image is.
	 *
	 * @covers ::generate_open_graph_images
	 */
	public function test_with_generator_result() {
		$this->indexable->open_graph_image = 'facebook_image.jpg';

		$this->open_graph_image_generator
			->expects( 'generate' )
			->once()
			->with( $this->context )
			->andReturn( [ 'facebook_image.jpg' ] );

		$this->assertEquals( [ 'facebook_image.jpg' ], $this->instance->generate_open_graph_images() );
	}
}
