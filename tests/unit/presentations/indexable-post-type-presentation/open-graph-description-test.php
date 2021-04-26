<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class Open_Graph_Description_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
		$this->indexable->object_id = 1;
	}

	/**
	 * Tests the situation where the open_graph_description is retrieved.
	 *
	 * @covers ::generate_open_graph_description
	 */
	public function test_with_open_graph_description() {
		$this->indexable->open_graph_description = 'Open Graph description';

		$this->assertSame( 'Open Graph description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the meta_description is used.
	 *
	 * @covers ::generate_open_graph_description
	 */
	public function test_with_meta_description() {
		$this->indexable->open_graph_description = '';
		$this->instance->meta_description        = 'Meta description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->with( $this->instance->meta_description, $this->indexable->object_type, $this->indexable->object_sub_type )
			->andReturn( $this->instance->meta_description );

		$this->post
			->expects( 'strip_shortcodes' )
			->with( $this->instance->meta_description )
			->andReturn( $this->instance->meta_description );

		$this->assertSame( 'Meta description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the fallback to the excerpt is used.
	 *
	 * @covers ::generate_open_graph_description
	 */
	public function test_with_excerpt_fallback() {
		$this->indexable->object_sub_type = 'post';
		$this->instance->meta_description = '';
		$excerpt_description              = 'Excerpt description';

		$this->post
			->expects( 'get_the_excerpt' )
			->with( $this->indexable->object_id )
			->once()
			->andReturn( $excerpt_description );

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->with( $excerpt_description, $this->indexable->object_type, $this->indexable->object_sub_type )
			->andReturn( $excerpt_description );

		$this->post
			->expects( 'strip_shortcodes' )
			->with( $excerpt_description )
			->andReturn( $excerpt_description );

		$this->assertSame( 'Excerpt description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the value from the helper is used.
	 *
	 * @covers ::generate_open_graph_description
	 */
	public function test_with_helper_fallback() {
		$this->indexable->object_sub_type = 'post';
		$this->instance->meta_description = 'Meta description';
		$description_from_helper          = 'Description from helper';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->with( $this->instance->meta_description, $this->indexable->object_type, $this->indexable->object_sub_type )
			->andReturn( $description_from_helper );

		$this->post
			->expects( 'strip_shortcodes' )
			->with( $description_from_helper )
			->andReturn( $description_from_helper );

		$this->assertSame( 'Description from helper', $this->instance->generate_open_graph_description() );
	}
}
