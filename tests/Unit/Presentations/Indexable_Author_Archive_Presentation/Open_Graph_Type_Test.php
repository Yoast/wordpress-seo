<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Author_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Type_test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Author_Archive_Presentation
 *
 * @group presentations
 * @group open-graph
 */
final class Open_Graph_Type_Test extends TestCase {

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
	 * Tests whether the Open Graph type is article.
	 *
	 * @covers ::generate_open_graph_type
	 *
	 * @return void
	 */
	public function test_open_graph_type() {
		$this->assertEquals( 'profile', $this->instance->generate_open_graph_type() );
	}
}
