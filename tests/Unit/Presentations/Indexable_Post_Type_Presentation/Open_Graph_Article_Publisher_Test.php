<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Article_Publisher_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group open-graph
 */
final class Open_Graph_Article_Publisher_Test extends TestCase {

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
	 * Tests the situation where the article author is given.
	 *
	 * @covers ::generate_open_graph_article_publisher
	 *
	 * @return void
	 */
	public function test_generate_open_graph_article_publisher() {

		$this->context->open_graph_publisher = 'http://facebook.com/publisher';

		$this->assertEquals( 'http://facebook.com/publisher', $this->instance->generate_open_graph_article_publisher() );
	}

	/**
	 * Tests the situation where no article author is given.
	 *
	 * @covers ::generate_open_graph_article_publisher
	 *
	 * @return void
	 */
	public function test_generate_open_graph_article_publisher_no_publisher() {
		$this->context->open_graph_publisher = '';

		$this->assertEmpty( $this->instance->generate_open_graph_article_publisher() );
	}
}
