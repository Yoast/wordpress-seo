<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Post_Type_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Open_Graph_Images_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
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
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the post is password protected.
	 *
	 * @covers ::generate_open_graph_images
	 */
	public function test_for_password_protected_post() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( true );

		$this->assertEmpty( $this->instance->generate_open_graph_images() );
	}

	/**
	 * Tests the situation where the parent method is called.
	 *
	 * @covers ::generate_open_graph_images
	 */
	public function test_with_parent_call() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( false );

		$this->indexable->open_graph_image    = 'facebook_image.jpg';
		$this->indexable->open_graph_image_id = null;

		$this->open_graph_image_generator
			->expects( 'generate' )
			->once()
			->with( $this->context )
			->andReturn( [ 'facebook_image.jpg' ] );

		$this->assertEquals( [ 'facebook_image.jpg' ], $this->instance->generate_open_graph_images() );
	}
}
