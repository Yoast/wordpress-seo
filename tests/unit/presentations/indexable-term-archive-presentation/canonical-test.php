<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Term_Archive_Presentation;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Canonical_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Term_Archive_Presentation
 *
 * @group presentations
 * @group canonical
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
	 * Tests the situation on a multiple terms page.
	 *
	 * @covers ::generate_canonical
	 * @covers ::is_multiple_terms_query
	 */
	public function test_multiple_terms_query() {
		$this->setup_multiple_terms_query( true );

		$this->assertEmpty( $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where the canonical is set.
	 *
	 * @covers ::generate_canonical
	 * @covers ::is_multiple_terms_query
	 */
	public function test_with_canonical() {
		$this->setup_multiple_terms_query();

		$this->indexable->canonical = 'https://example.com/term-archive';

		$this->assertEquals( 'https://example.com/term-archive', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where there is no permalink set.
	 *
	 * @covers ::generate_canonical
	 * @covers ::is_multiple_terms_query
	 */
	public function test_without_permalink() {
		$this->setup_multiple_terms_query();

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
	 * @covers ::is_multiple_terms_query
	 */
	public function test_without_pagination() {
		$this->setup_multiple_terms_query();

		$this->indexable->permalink = 'https://example.com/term-archive/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 0 );

		Monkey\Functions\expect( 'is_date' )
			->once()
			->andReturn( false );

		$this->assertEquals( 'https://example.com/term-archive/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation with pagination.
	 *
	 * @covers ::generate_canonical
	 * @covers ::is_multiple_terms_query
	 */
	public function test_with_pagination() {
		$this->setup_multiple_terms_query();

		$this->indexable->permalink = 'https://example.com/term-archive/';

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
			->andReturn( 'https://example.com/term-archive/page/2/' );

		Monkey\Functions\expect( 'is_date' )
			->once()
			->andReturn( false );

		$this->assertEquals( 'https://example.com/term-archive/page/2/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation without pagination and with dynamic permalinks enabled.
	 *
	 * @covers ::generate_canonical
	 * @covers ::is_multiple_terms_query
	 */
	public function test_without_pagination_with_dynamic_permalinks() {
		$this->setup_multiple_terms_query();

		$this->indexable->permalink = 'https://example.com/term-archive/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( true );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->with( $this->instance->model )
			->once()
			->andReturn( 'https://example.com/dynamic-term-archive/' );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 0 );

		$this->assertEquals( 'https://example.com/dynamic-term-archive/', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation with pagination  and with dynamic permalinks enabled.
	 *
	 * @covers ::generate_canonical
	 * @covers ::is_multiple_terms_query
	 */
	public function test_with_pagination_with_dynamic_permalinks() {
		$this->setup_multiple_terms_query();

		$this->indexable->permalink = 'https://example.com/term-archive/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( true );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->with( $this->instance->model )
			->once()
			->andReturn( 'https://example.com/dynamic-term-archive/' );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 2 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->with( 'https://example.com/dynamic-term-archive/', 2 )
			->once()
			->andReturn( 'https://example.com/dynamic-term-archive/page/2/' );

		$this->assertEquals( 'https://example.com/dynamic-term-archive/page/2/', $this->instance->generate_canonical() );
	}

	/**
	 * Sets up the tests to indicate the multiple terms query. Defaults to single term.
	 *
	 * @param bool $is_multiple Optional. Determines if the WP query contains multiple terms or not.
	 */
	private function setup_multiple_terms_query( $is_multiple = false ) {
		$this->instance->source = (object) [ 'taxonomy' => 'my-taxonomy' ];

		$terms = [];
		if ( $is_multiple ) {
			$terms = [ 'term1', 'term2', 'term3' ];
		}

		$wp_query            = Mockery::mock( 'WP_Query' );
		$wp_query->tax_query = (object) [
			'queried_terms' => [
				'my-taxonomy' => [
					'terms' => $terms,
				],
			],
		];

		$this->wp_query_wrapper
			->expects( 'get_query' )
			->once()
			->andReturn( $wp_query );
	}
}
