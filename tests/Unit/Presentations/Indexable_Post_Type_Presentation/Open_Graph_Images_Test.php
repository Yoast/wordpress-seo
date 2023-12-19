<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Images_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group open-graph
 * @group open-graph-image
 */
final class Open_Graph_Images_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the post is password protected.
	 *
	 * @covers ::generate_open_graph_images
	 *
	 * @return void
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
	 *
	 * @return void
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
