<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Open_Graph_Site_Name_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class Open_Graph_Site_Name_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		$this->set_instance();

		return parent::setUp();
	}

	/**
	 * Tests the situation where the Open Graph site name is given.
	 *
	 * @covers ::generate_open_graph_site_name
	 */
	public function test_generate_open_graph_site_name() {
		$this->context->wordpress_site_name = 'My Site';

		$this->assertEquals( 'My Site', $this->instance->generate_open_graph_site_name() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_open_graph_site_name
	 */
	public function test_generate_title_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_open_graph_site_name() );
	}
}
