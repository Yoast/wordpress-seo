<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Home_Page_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Canonical_Test.
 *
 * @group presentations
 * @group canonical
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Home_Page_Presentation
 */
class Canonical_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the canonical is set.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_canonical() {
		$this->indexable->canonical = 'https://example.com/';

		$this->assertEquals( 'https://example.com/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where there is no permalink set.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_permalink() {
		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'is_date' )
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
		$this->indexable->permalink = 'https://example.com/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'is_date' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 0 );

		$this->assertEquals( 'https://example.com/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation with pagination.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_pagination() {
		$this->indexable->permalink = 'https://example.com/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'is_date' )
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
			->andReturn( 'https://example.com/page/2/' );

		$this->assertEquals( 'https://example.com/page/2/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation without pagination and with dynamic permalinks enabled.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_pagination_with_dynamic_permalinks() {
		$this->indexable->permalink = 'https://example.com/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( true );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->with( $this->instance->model )
			->once()
			->andReturn( 'https://dynamic.example.com/' );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 0 );

		$this->assertEquals( 'https://dynamic.example.com/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation with pagination and with dynamic permalinks enabled.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_pagination_with_dynamic_permalinks() {
		$this->indexable->permalink = 'https://example.com/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( true );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->with( $this->instance->model )
			->once()
			->andReturn( 'https://dynamic.example.com/' );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 3 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->with( 'https://dynamic.example.com/', 3 )
			->once()
			->andReturn( 'https://dynamic.example.com/page/3/' );

		$this->assertEquals( 'https://dynamic.example.com/page/3/', $this->instance->generate_canonical() );
	}
}
