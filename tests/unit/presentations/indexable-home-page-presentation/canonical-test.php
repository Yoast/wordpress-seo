<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Home_Page_Presentation;

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
	public function setUp() {
		parent::setUp();

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
		$this->assertEmpty( $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation without pagination.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_pagination() {
		$this->indexable->permalink = 'https://example.com/';

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
}
