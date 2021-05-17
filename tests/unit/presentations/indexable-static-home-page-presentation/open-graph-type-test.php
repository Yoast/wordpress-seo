<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Static_Home_Page_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Type_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Static_Home_Page_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class Open_Graph_Type_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests whether the Open Graph type is article.
	 *
	 * @covers ::generate_open_graph_type
	 */
	public function test_open_graph_type() {
		$this->assertEquals( 'website', $this->instance->generate_open_graph_type() );
	}
}
