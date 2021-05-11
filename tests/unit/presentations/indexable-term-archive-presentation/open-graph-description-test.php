<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Term_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Term_Archive_Presentation
 *
 * @group presentations
 * @group open-graph
 * @group open-graph-description
 */
class Open_Graph_Description_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
		$this->indexable->object_id = 1;
	}

	/**
	 * Tests the situation where the Open Graph description is given.
	 *
	 * @covers ::generate_open_graph_description
	 */
	public function test_with_set_open_graph_description() {
		$this->indexable->open_graph_description = 'Open Graph description';

		$this->assertEquals( 'Open Graph description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_open_graph_description
	 */
	public function test_with_term_description() {
		$this->indexable->open_graph_description = '';
		$this->instance->meta_description        = '';

		$this->taxonomy
			->expects( 'get_term_description' )
			->with( $this->indexable->object_id )
			->once()
			->andReturn( 'Term description' );

		$this->assertEquals( 'Term description', $this->instance->generate_open_graph_description() );
	}
}
