<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Home_Page_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Open_Graph_URL_Test.
 *
 * @group presentations
 * @group open-graph
 * @group open-graph-url
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Home_Page_Presentation
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
	 * Tests whether generate_open_graph_url calls the `home` method of the url helper.
	 *
	 * @covers ::generate_open_graph_url
	 */
	public function test_generate_open_graph_url() {
		$this->url
			->expects( 'home' )
			->withNoArgs()
			->once()
			->andReturn( 'https://example.com/' );

		$this->assertEquals( 'https://example.com/', $this->instance->generate_open_graph_url() );
	}
}
