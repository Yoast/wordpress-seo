<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Article_Author_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class Open_Graph_Article_Author_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests whether an empty string is returned.
	 *
	 * @covers ::generate_open_graph_article_author
	 */
	public function test_generate_open_graph_article_author_and_return_empty() {
		$this->assertEmpty( $this->instance->generate_open_graph_article_author() );
	}
}
