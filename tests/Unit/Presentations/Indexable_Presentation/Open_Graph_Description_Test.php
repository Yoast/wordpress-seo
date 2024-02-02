<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 */
final class Open_Graph_Description_Test extends TestCase {

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
	 * Tests the situation where the Open Graph description is given.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_generate_open_graph_description_when_open_graph_description_is_given() {
		$this->indexable->open_graph_description = 'Example of Open Graph description';

		$this->assertSame( 'Example of Open Graph description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the value from the helper is used.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_with_helper_fallback() {
		$description_from_helper          = 'Description from helper';
		$this->instance->meta_description = 'Meta description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->andReturn( $description_from_helper );

		$this->assertSame( 'Description from helper', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the Open Graph description is not given, and the meta description is returned.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_generate_open_graph_description_with_meta_description() {
		$this->indexable->description = 'Example of meta description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->andReturn( '' );

		$this->assertSame( 'Example of meta description', $this->instance->generate_open_graph_description() );
	}
}
