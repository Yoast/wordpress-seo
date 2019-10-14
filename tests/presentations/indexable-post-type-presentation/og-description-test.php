<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Open_Graph_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class Open_Graph_Description_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->setInstance();
		$this->indexable->object_id = 1;

		parent::setUp();
	}

	/**
	 * Tests the situation where the og_description is cached.
	 *
	 * @covers ::generate_og_description
	 */
	public function test_with_cached_og_description() {
		$this->indexable->og_description = 'Cached OpenGraph description';

		$this->assertEquals( 'Cached OpenGraph description', $this->instance->generate_og_description() );
	}

	/**
	 * Tests the situation where the og_description is retrieved.
	 *
	 * @covers ::generate_og_description
	 */
	public function test_with_og_description() {
		$this->meta_helper
			->expects( 'get_value' )
			->with( 'opengraph-description', $this->indexable->object_id )
			->once()
			->andReturn( 'OpenGraph description' );

		$this->post_type_helper
			->expects( 'strip_shortcodes' )
			->withAnyArgs()
			->once()
			->andReturnUsing( function( $string ) {
				return $string;
			});

		$this->assertEquals( 'OpenGraph description', $this->instance->generate_og_description() );
	}

	/**
	 * Tests the situation where the fall back to the meta description is used.
	 *
	 * @covers ::generate_og_description
	 */
	public function test_with_meta_description_fallback() {
		$this->indexable->description = 'Meta description';

		$this->meta_helper
			->expects( 'get_value' )
			->with( 'opengraph-description', $this->indexable->object_id )
			->once()
			->andReturn( '' );

		$this->post_type_helper
			->expects( 'strip_shortcodes' )
			->withAnyArgs()
			->once()
			->andReturnUsing( function( $string ) {
				return $string;
			});

		$this->assertEquals( 'Meta description', $this->instance->generate_og_description() );
	}

	/**
	 * Tests the situation where the fall back to the excerpt is used.
	 *
	 * @covers ::generate_og_description
	 */
	public function test_with_excerpt_fallback() {
		$this->indexable->object_sub_type = 'post';

		$this->meta_helper
			->expects( 'get_value' )
			->with( 'opengraph-description', $this->indexable->object_id )
			->once()
			->andReturn( '' );

		$this->options_helper
			->expects( 'get' )
			->with( 'metadesc-post' )
			->once()
			->andReturn( '' );

		$this->post_type_helper
			->expects( 'get_the_excerpt' )
			->with( 1 )
			->once()
			->andReturn( 'Excerpt description' );

		$this->post_type_helper
			->expects( 'strip_shortcodes' )
			->withAnyArgs()
			->once()
			->andReturnUsing( function( $string ) {
				return $string;
			});

		$this->assertEquals( 'Excerpt description', $this->instance->generate_og_description() );
	}
}
