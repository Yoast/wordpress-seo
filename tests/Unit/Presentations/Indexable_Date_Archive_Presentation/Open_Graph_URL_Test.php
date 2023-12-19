<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_URL_Test.
 *
 * @group presentations
 * @group open-graph
 * @group open-graph-url
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Date_Archive_Presentation
 */
final class Open_Graph_URL_Test extends TestCase {

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
	 * Tests whether generate_open_graph_url calls the `get_date_archive_permalink` method of the current page helper.
	 *
	 * @covers ::generate_open_graph_url
	 *
	 * @return void
	 */
	public function test_generate_open_graph_url() {
		$this->current_page
			->expects( 'get_date_archive_permalink' )
			->once()
			->andReturn( 'https://example.com/2019/11' );

		$this->assertEquals( 'https://example.com/2019/11', $this->instance->generate_open_graph_url() );
	}
}
