<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Canonical_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Archive_Presentation
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
	 * Tests the situation where the permalink is not set.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_permalink() {
		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->assertEmpty( $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation without pagination.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_pagination() {
		$this->indexable->permalink = 'https://example.com/custom-post-type/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 0 );

		$this->assertEquals( 'https://example.com/custom-post-type/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation with pagination.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_pagination() {
		$this->indexable->permalink = 'https://example.com/custom-post-type/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 2 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->with( $this->indexable->permalink, 2 )
			->once()
			->andReturn( 'https://example.com/custom-post-type/page/2/' );

		$this->assertEquals( 'https://example.com/custom-post-type/page/2/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation without pagination and with dynamic permalinks enabled.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_pagination_with_dynamic_permalinks() {
		$this->indexable->permalink = 'https://example.com/custom-post-type/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( true );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->with( $this->instance->model )
			->once()
			->andReturn( 'https://example.com/dynamic-custom-post-type/' );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 0 );

		$this->assertEquals( 'https://example.com/dynamic-custom-post-type/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation with pagination and with dynamic permalinks enabled.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_pagination_with_dynamic_permalinks() {
		$this->indexable->permalink = 'https://example.com/custom-post-type/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( true );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->with( $this->instance->model )
			->once()
			->andReturn( 'https://example.com/dynamic-custom-post-type/' );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 3 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->with( 'https://example.com/dynamic-custom-post-type/', 3 )
			->once()
			->andReturn( 'https://example.com/dynamic-custom-post-type/page/3/' );

		$this->assertEquals( 'https://example.com/dynamic-custom-post-type/page/3/', $this->instance->generate_canonical() );
	}
}
