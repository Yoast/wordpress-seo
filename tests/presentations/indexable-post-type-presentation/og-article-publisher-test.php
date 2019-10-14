<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_Article_Publisher_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class OG_Article_Publisher_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests the situation where the article author is given.
	 *
	 * ::covers generate_og_article_publisher
	 */
	public function test_generate_og_article_publisher() {

		$this->context->open_graph_publisher = 'http://facebook.com/publisher';

		$this->assertEquals( 'http://facebook.com/publisher', $this->instance->generate_og_article_publisher() );
	}

	/**
	 * Tests the situation where no article author is given.
	 *
	 * ::covers generate_og_article_author
	 */
	public function test_generate_og_article_publisher_no_publisher() {
		$this->context->open_graph_publisher = '';

		$this->assertEmpty( $this->instance->generate_og_article_publisher() );
	}
}
