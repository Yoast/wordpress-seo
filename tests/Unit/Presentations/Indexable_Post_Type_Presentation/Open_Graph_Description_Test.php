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
	 * Tests the situation where the open_graph_description is retrieved.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_with_open_graph_description() {
		$this->indexable->open_graph_description = 'Open Graph description';

		// Do not strip any shortcodes from a manually set description.
		$this->post
			->expects( 'strip_shortcodes' )
			->never();

		self::assertSame( 'Open Graph description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the value from the helper is used.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_with_helper_fallback() {
		$this->indexable->object_type     = 'post';
		$this->indexable->object_sub_type = 'post';
		$description_from_helper          = 'Description from helper';
		$this->instance->meta_description = 'Meta description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->with( '', $this->indexable->object_type, $this->indexable->object_sub_type )
			->andReturn( $description_from_helper );

		// Do not strip any shortcodes from a manually set description.
		$this->post
			->expects( 'strip_shortcodes' )
			->never();

		self::assertSame( 'Description from helper', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the fallback to meta_description is used.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_with_meta_description() {
		$this->indexable->object_type            = 'post';
		$this->indexable->object_sub_type        = 'post';
		$this->indexable->open_graph_description = '';
		$description_from_helper                 = '';
		$this->instance->meta_description        = 'Meta description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->with( '', $this->indexable->object_type, $this->indexable->object_sub_type )
			->andReturn( $description_from_helper );

		// Do not strip any shortcodes from a manually set description.
		$this->post
			->expects( 'strip_shortcodes' )
			->never();

		self::assertSame( 'Meta description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the fallback to the excerpt is used.
	 *
	 * @covers ::generate_open_graph_description
	 *
	 * @return void
	 */
	public function test_with_excerpt_fallback() {
		$this->indexable->object_type     = 'post';
		$this->indexable->object_sub_type = 'post';
		$description_from_helper          = '';
		$this->instance->meta_description = '';
		$excerpt_description              = '[gallery]Excerpt description';
		$excerpt_description_no_shortcode = 'Excerpt description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->with( '', $this->indexable->object_type, $this->indexable->object_sub_type )
			->andReturn( $description_from_helper );

		$this->post
			->expects( 'get_the_excerpt' )
			->with( $this->indexable->object_id )
			->once()
			->andReturn( $excerpt_description );

		// Strip any shortcodes when the description comes from the excerpt.
		$this->post
			->expects( 'strip_shortcodes' )
			->with( $excerpt_description )
			->andReturn( $excerpt_description_no_shortcode );

		self::assertSame( 'Excerpt description', $this->instance->generate_open_graph_description() );
	}
}
