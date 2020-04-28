<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Open_Graph_Title_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 * @group open-graph-title
 */
class Open_Graph_Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the Open Graph title is set.
	 *
	 * @covers ::generate_open_graph_title
	 */
	public function test_generate_open_graph_title_when_open_graph_title_is_set() {
		$this->indexable->open_graph_title = 'Example of Open Graph title';

		$this->assertEquals( 'Example of Open Graph title', $this->instance->generate_open_graph_title() );
	}

	/**
	 * Tests the situation where the Open Graph title is not set, and the SEO title is returned.
	 *
	 * @covers ::generate_open_graph_title
	 */
	public function test_generate_open_graph_title_with_seo_title() {
		$this->indexable->title = 'Example of SEO title';
		$this->assertEquals( 'Example of SEO title', $this->instance->generate_open_graph_title() );
	}
}
