<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Archive_Presentation\Presentation_Instance_Builder;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Canonical_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Archive_Adjacent
 *
 * @group presentations
 * @group adjacent
 */
class Archive_Adjacent_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper
	 */
	protected $pagination;

	/**
	 * Does the setup for testing.
	 */
	protected function set_up() {
		parent::set_up();

		$this->pagination = Mockery::mock( Pagination_Helper::class );

		$this->set_instance();
		$this->instance->set_archive_adjacent_helpers( $this->pagination );
	}

	/**
	 * Tests the situation where the rel adjacent is disabled.
	 *
	 * @covers ::generate_rel_prev
	 */
	public function test_generate_rel_prev_is_disabled() {
		$this->pagination
			->expects( 'is_rel_adjacent_disabled' )
			->once()
			->andReturn( true );

		$this->assertEmpty( $this->instance->generate_rel_prev() );
	}

	/**
	 * Tests the situation where the current page is the first page.
	 *
	 * @covers ::generate_rel_prev
	 */
	public function test_generate_rel_prev_is_first_page() {
		$this->pagination
			->expects( 'is_rel_adjacent_disabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 1 );

		$this->assertEmpty( $this->instance->generate_rel_prev() );
	}

	/**
	 * Tests the situation where the previous page is the first page.
	 *
	 * @covers ::generate_rel_prev
	 */
	public function test_generate_rel_prev_is_second_page() {
		$this->indexable->permalink = 'https://example.com/permalink/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'is_rel_adjacent_disabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 2 );

		Monkey\Functions\expect( 'is_date' )
			->once()
			->andReturn( false );

		$this->assertEquals( 'https://example.com/permalink/', $this->instance->generate_rel_prev() );
	}

	/**
	 * Tests the situation where the current page is the third (or more) page.
	 *
	 * @covers ::generate_rel_prev
	 */
	public function test_generate_rel_prev_is_third_page() {
		$this->indexable->permalink = 'https://example.com/permalink/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'is_rel_adjacent_disabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 3 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->with( 'https://example.com/permalink/', 2 )
			->once()
			->andReturn( 'https://example.com/permalink/page/2/' );

		Monkey\Functions\expect( 'is_date' )
			->once()
			->andReturn( false );

		$this->assertEquals( 'https://example.com/permalink/page/2/', $this->instance->generate_rel_prev() );
	}

	/**
	 * Tests the situation where the rel adjacent is disabled.
	 *
	 * @covers ::generate_rel_next
	 */
	public function test_generate_rel_next_is_disabled() {
		$this->pagination
			->expects( 'is_rel_adjacent_disabled' )
			->once()
			->andReturn( true );

		$this->assertEmpty( $this->instance->generate_rel_next() );
	}

	/**
	 * Tests the situation where the current page is the last page.
	 *
	 * @covers ::generate_rel_next
	 */
	public function test_generate_rel_prev_is_last_page() {
		$this->pagination
			->expects( 'is_rel_adjacent_disabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 6 );

		$this->pagination
			->expects( 'get_number_of_archive_pages' )
			->once()
			->andReturn( 6 );

		$this->assertEmpty( $this->instance->generate_rel_next() );
	}

	/**
	 * Tests the situation where the current page is not the last page.
	 *
	 * @covers ::generate_rel_next
	 */
	public function test_generate_rel_prev_is_not_the_last_page() {
		$this->indexable->permalink = 'https://example.com/permalink/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'is_rel_adjacent_disabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 5 );

		$this->pagination
			->expects( 'get_number_of_archive_pages' )
			->once()
			->andReturn( 6 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->with( 'https://example.com/permalink/', 6 )
			->once()
			->andReturn( 'https://example.com/permalink/page/6/' );

		Monkey\Functions\expect( 'is_date' )
			->once()
			->andReturn( false );

		$this->assertEquals( 'https://example.com/permalink/page/6/', $this->instance->generate_rel_next() );
	}
}
