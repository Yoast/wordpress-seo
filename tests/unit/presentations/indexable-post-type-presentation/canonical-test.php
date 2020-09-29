<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Canonical_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group canonical
 */
class Canonical_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the canonical is given.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_canonical() {
		$this->indexable->canonical = 'https://example.com/my-post/';

		$this->assertEquals( 'https://example.com/my-post/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where no canonical is given, and it should fall back to the permalink.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_canonical() {
		$this->indexable->object_id = 1337;
		$this->indexable->permalink = 'https://example.com/permalink/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_post_page_number' )
			->once()
			->andReturn( 0 );

		$this->url
			->expects( 'ensure_absolute_url' )
			->once()
			->andReturnUsing(
				function ( $val ) {
					return $val;
				}
			);

		$this->assertEquals( 'https://example.com/permalink/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests a post with pagination.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_pagination() {
		$this->indexable->object_id       = 1337;
		$this->indexable->number_of_pages = 2;
		$this->indexable->permalink       = 'https://example.com/permalink/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_post_page_number' )
			->once()
			->andReturn( 2 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->once()
			->andReturn( 'https://example.com/permalink/2/' );

		$this->url
			->expects( 'ensure_absolute_url' )
			->once()
			->andReturnUsing(
				function ( $val ) {
					return $val;
				}
			);

		$this->assertEquals( 'https://example.com/permalink/2/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where no canonical is given, and it should fall back to the permalink, and dynamic permalink are enabled.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_canonical_with_dynamic_permalinks() {
		$this->indexable->object_id = 1337;
		$this->indexable->permalink = 'https://example.com/permalink/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( true );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->with( $this->instance->model )
			->once()
			->andReturn( 'https://example.com/dynamic-permalink/' );

		$this->pagination
			->expects( 'get_current_post_page_number' )
			->once()
			->andReturn( 0 );

		$this->url
			->expects( 'ensure_absolute_url' )
			->once()
			->andReturnUsing(
				function ( $val ) {
					return $val;
				}
			);

		$this->assertEquals( 'https://example.com/dynamic-permalink/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests a post with pagination and with dynamic permalink enabled.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_pagination_with_dynamic_permalinks() {
		$this->indexable->object_id       = 1337;
		$this->indexable->number_of_pages = 2;
		$this->indexable->permalink       = 'https://example.com/permalink/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( true );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->with( $this->instance->model )
			->once()
			->andReturn( 'https://example.com/dynamic-permalink/' );

		$this->pagination
			->expects( 'get_current_post_page_number' )
			->once()
			->andReturn( 2 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->once()
			->andReturn( 'https://example.com/dynamic-permalink/2/' );

		$this->url
			->expects( 'ensure_absolute_url' )
			->once()
			->andReturnUsing(
				function ( $val ) {
					return $val;
				}
			);

		$this->assertEquals( 'https://example.com/dynamic-permalink/2/', $this->instance->generate_canonical() );
	}
}
