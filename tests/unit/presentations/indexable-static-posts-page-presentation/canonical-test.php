<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Static_Posts_Page_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Canonical_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Static_Posts_Page_Presentation
 *
 * @group presentations
 * @group canonical
 */
class Canonical_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
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
		$this->indexable->canonical = 'https://example.com/canonical';

		$this->assertEquals( 'https://example.com/canonical', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where the permalink is given.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_permalink() {
		$this->indexable->permalink = 'https://example.com/permalink';

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 1 );

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->assertEquals( 'https://example.com/permalink', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_canonical_or_permalink() {
		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 1 );

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->assertEmpty( $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where a canonical is paginated.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_pagination() {
		$this->indexable->permalink = 'https://example.com/permalink';

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 2 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->once()
			->with( 'https://example.com/permalink', 2 )
			->andReturn( 'https://example.com/permalink/page/2/' );

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->assertEquals( 'https://example.com/permalink/page/2/', $this->instance->generate_canonical() );
	}
}
