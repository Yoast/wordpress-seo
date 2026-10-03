<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Title_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 * @group open-graph-title
 */
final class Open_Graph_Title_Test extends TestCase {

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
	 * Tests the situation where the Open Graph title is set.
	 *
	 * @covers ::generate_open_graph_title
	 *
	 * @return void
	 */
	public function test_generate_open_graph_title_when_open_graph_title_is_set() {
		$this->indexable->open_graph_title = 'Example of Open Graph title';
		$this->indexable->title            = 'Example of SEO title';

		$this->assertSame( 'Example of Open Graph title', $this->instance->generate_open_graph_title() );
	}

	/**
	 * Tests the situation where the Open Graph title is not set and the value from the helper is used.
	 *
	 * @covers ::generate_open_graph_title
	 *
	 * @return void
	 */
	public function test_generate_open_graph_title_from_helper() {
		$title_from_helper      = 'Example of title from the helper';
		$this->indexable->title = 'Example of SEO title';

		$this->values_helper
			->expects( 'get_open_graph_title' )
			->andReturn( $title_from_helper );

		$this->assertSame( 'Example of title from the helper', $this->instance->generate_open_graph_title() );
	}

	/**
	 * Tests the situation where the Open Graph title is not set, and the SEO title is returned.
	 *
	 * @covers ::generate_open_graph_title
	 *
	 * @return void
	 */
	public function test_generate_open_graph_title_with_seo_title() {
		$this->indexable->title = 'Example of SEO title';

		$this->values_helper
			->expects( 'get_open_graph_title' )
			->andReturn( '' );

		$this->assertSame( 'Example of SEO title', $this->instance->generate_open_graph_title() );
	}
}
