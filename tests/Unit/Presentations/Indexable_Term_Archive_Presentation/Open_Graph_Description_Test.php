<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Term_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Term_Archive_Presentation
 *
 * @group presentations
 * @group open-graph
 * @group open-graph-description
 */
final class Open_Graph_Description_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
		$this->indexable->object_id = 1;
	}

	/**
	 * Tests the situation where the Open Graph description is given.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_with_set_open_graph_description() {
		$this->indexable->open_graph_description = 'Open Graph description';

		$this->assertSame( 'Open Graph description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the description from template is given.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_with_description_from_template() {
		$this->indexable->object_type            = 'post-type-archive';
		$this->indexable->object_sub_type        = 'book';
		$this->indexable->open_graph_description = '';
		$description_from_template               = 'Description from template';
		$this->instance->meta_description        = 'Meta description';

		$this->taxonomy
			->expects( 'get_term_description' )
			->with( $this->indexable->object_id )
			->never();

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->with( '', $this->indexable->object_type, $this->indexable->object_sub_type )
			->andReturn( $description_from_template );

		$this->assertSame( 'Description from template', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_with_meta_description() {
		$this->indexable->object_type            = 'post-type-archive';
		$this->indexable->object_sub_type        = 'book';
		$this->indexable->open_graph_description = '';
		$this->instance->meta_description        = 'Meta description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->with( '', $this->indexable->object_type, $this->indexable->object_sub_type )
			->andReturn( '' );

		$this->assertSame( 'Meta description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the term description is given.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_with_term_description() {
		$this->indexable->object_type            = 'post-type-archive';
		$this->indexable->object_sub_type        = 'book';
		$this->indexable->open_graph_description = '';
		$this->instance->meta_description        = '';
		$term_description                        = 'Term description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->with( '', $this->indexable->object_type, $this->indexable->object_sub_type )
			->andReturn( '' );

		$this->taxonomy
			->expects( 'get_term_description' )
			->with( $this->indexable->object_id )
			->andReturn( $term_description );

		$this->assertSame( 'Term description', $this->instance->generate_open_graph_description() );
	}
}
