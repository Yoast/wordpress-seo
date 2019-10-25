<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Canonical_Test.
 *
 * @group presentations
 * @group canonical
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Date_Archive_Presentation
 */
class Canonical_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests whether generate_canonical calls the `get_date_archive_permalink` method of the current page helper.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_generate_canonical() {
		$this->current_page_helper
			->expects( 'get_date_archive_permalink' )
			->once()
			->andReturn( 'https://permalink' );

		$this->current_page_helper
			->expects( 'get_current_archive_page' )
			->once()
			->andReturn( 0 );

		$this->assertEquals( 'https://permalink', $this->instance->generate_canonical() );
	}

	/**
	 * Tests whether generate_canonical uses the paginated url.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_generate_canonical_paginated() {
		$this->current_page_helper
			->expects( 'get_date_archive_permalink' )
			->once()
			->andReturn( 'https://permalink' );

		$this->current_page_helper
			->expects( 'get_current_archive_page' )
			->once()
			->andReturn( 2 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->with( 'https://permalink', 2 )
			->once()
			->andReturn( 'https://permalink/page/2' );

		$this->assertEquals( 'https://permalink/page/2', $this->instance->generate_canonical() );
	}
}
