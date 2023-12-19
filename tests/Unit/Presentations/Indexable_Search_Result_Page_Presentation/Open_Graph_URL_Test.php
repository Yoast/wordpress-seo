<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Search_Result_Page_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_URL_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Search_Result_Page_Presentation
 *
 * @group presentations
 * @group open-graph
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
	 * Tests the situation where the search link is returned.
	 *
	 * @covers ::generate_open_graph_url
	 *
	 * @return void
	 */
	public function test_generate_open_graph_url() {
		Monkey\Functions\expect( 'get_search_query' )
			->once()
			->andReturn( 'searchquery' );

		Monkey\Functions\expect( 'get_search_link' )
			->once()
			->andReturn( 'http://example.com/search/searchquery' );

		$this->assertEquals( 'http://example.com/search/searchquery', $this->instance->generate_open_graph_url() );
	}

	/**
	 * Tests the situation where the canonical is returned.
	 *
	 * @covers ::generate_open_graph_url
	 *
	 * @return void
	 */
	public function test_generate_open_graph_url_invalid_query() {
		Monkey\Functions\expect( 'get_search_query' )
			->once()
			->andReturn( 'page/2' );

		$this->assertEmpty( $this->instance->generate_open_graph_url() );
	}
}
