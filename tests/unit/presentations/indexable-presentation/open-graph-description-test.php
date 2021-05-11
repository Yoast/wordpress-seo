<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class Open_Graph_Description_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the Open Graph description is given.
	 *
	 * @covers ::generate_open_graph_description
	 */
	public function test_generate_open_graph_description_when_open_graph_description_is_given() {
		$this->indexable->open_graph_description = 'Example of Open Graph description';

		$this->assertEquals( 'Example of Open Graph description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the Open Graph description is not given, and the meta description is returned.
	 *
	 * @covers ::generate_open_graph_description
	 */
	public function test_generate_open_graph_description_with_meta_description() {
		$this->indexable->description = 'Example of meta description';
		$this->assertEquals( 'Example of meta description', $this->instance->generate_open_graph_description() );
	}
}
