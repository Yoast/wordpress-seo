<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Open_Graph_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group opengraph
 */
class Open_Graph_Description_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
		$this->indexable->object_id = 1;

		$this->post_type_helper
			->expects( 'strip_shortcodes' )
			->withAnyArgs()
			->once()
			->andReturnUsing( function( $string ) {
				return $string;
			} );
	}

	/**
	 * Tests the situation where the og_description is retrieved.
	 *
	 * @covers ::generate_og_description
	 */
	public function test_with_og_description() {
		$this->indexable->og_description = 'OpenGraph description';

		$this->assertEquals( 'OpenGraph description', $this->instance->generate_og_description() );
	}

	/**
	 * Tests the situation where the fall back to the excerpt is used.
	 *
	 * @covers ::generate_og_description
	 */
	public function test_with_excerpt_fallback() {
		$this->indexable->object_sub_type = 'post';

		$this->options_helper
			->expects( 'get' )
			->with( 'metadesc-post' )
			->once()
			->andReturn( '' );

		$this->post_type_helper
			->expects( 'get_the_excerpt' )
			->with( $this->indexable->object_id )
			->once()
			->andReturn( 'Excerpt description' );

		$this->assertEquals( 'Excerpt description', $this->instance->generate_og_description() );
	}
}
