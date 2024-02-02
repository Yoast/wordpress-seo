<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Article_Published_Time_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 */
final class Open_Graph_Article_Published_Time_Test extends TestCase {

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
	 * Tests whether an empty string is returned.
	 *
	 * @covers ::generate_open_graph_article_published_time
	 *
	 * @return void
	 */
	public function test_generate_open_graph_article_published_time_and_return_empty() {
		$this->assertEmpty( $this->instance->generate_open_graph_article_published_time() );
	}
}
