<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Home_Page_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Canonical_Test.
 *
 * @group presentations
 * @group canonical
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Home_Page_Presentation
 */
class Canonical_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
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
		$this->assertEmpty( $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation without pagination.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_pagination() {
		$this->indexable->permalink = 'https://example.com/';

		$this->current_page_helper
			->expects( 'get_current_archive_page' )
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

		$this->current_page_helper
			->expects( 'get_current_archive_page' )
			->once()
			->andReturn( 2 );

		$this->rel_adjacent
			->expects( 'get_paginated_url' )
			->with( $this->indexable->permalink, 2 )
			->once()
			->andReturn( 'https://example.com/page/2/' );

		$this->assertEquals( 'https://example.com/page/2/', $this->instance->generate_canonical() );
	}
}
