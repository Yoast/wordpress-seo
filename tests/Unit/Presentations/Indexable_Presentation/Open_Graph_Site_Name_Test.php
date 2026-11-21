<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Site_Name_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 */
final class Open_Graph_Site_Name_Test extends TestCase {

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
	 * Tests the situation where the Open Graph site name is given.
	 *
	 * @covers ::generate_open_graph_site_name
	 *
	 * @return void
	 */
	public function test_generate_open_graph_site_name() {
		$this->context->wordpress_site_name = 'My Site';

		$this->assertEquals( 'My Site', $this->instance->generate_open_graph_site_name() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_open_graph_site_name
	 *
	 * @return void
	 */
	public function test_generate_title_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_open_graph_site_name() );
	}
}
