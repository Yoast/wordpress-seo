<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Static_Posts_Page_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Open_Graph_URL_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Static_Posts_Page_Presentation
 *
 * @group presentations
 */
class Open_Graph_URL_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the permalink is returned.
	 *
	 * @covers ::generate_open_graph_url
	 */
	public function test_generate_open_graph_url_and_return_permalink() {
		$this->indexable->permalink = 'https://example.com/static-posts-page';

		$this->assertEquals( 'https://example.com/static-posts-page', $this->instance->generate_open_graph_url() );
	}
}
