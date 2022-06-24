<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_URL_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
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
	 * Tests the situation where the canonical is returned.
	 *
	 * @covers ::generate_open_graph_url
	 */
	public function test_generate_open_graph_url_and_return_canonical() {
		$this->indexable->canonical = 'http://example.com/canonical';
		$this->indexable->permalink = 'http://example.com/permalink';

		$this->assertEquals( 'http://example.com/canonical', $this->instance->generate_open_graph_url() );
	}

	/**
	 * Tests the situation where the canonical is returned.
	 *
	 * @covers ::generate_open_graph_url
	 */
	public function test_generate_open_graph_url_fallback_to_permalink() {
		$this->indexable->permalink = 'http://example.com/permalink';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'is_date' )
			->once()
			->andReturn( false );

		$this->assertEquals( 'http://example.com/permalink', $this->instance->generate_open_graph_url() );
	}
}
