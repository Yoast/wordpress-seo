<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Static_Posts_Page_Presentation;

use Brain\Monkey;

use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the permalink is returned.
	 *
	 * @covers ::generate_open_graph_url
	 */
	public function test_generate_open_graph_url_and_return_permalink() {
		$this->indexable->permalink = 'https://example.com/static-posts-page';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'is_date' )
			->once()
			->andReturn( false );

		$this->assertEquals( 'https://example.com/static-posts-page', $this->instance->generate_open_graph_url() );
	}
}
