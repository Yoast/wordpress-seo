<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Canonical_Test.
 *
 * @group presentations
 * @group canonical
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Date_Archive_Presentation
 */
final class Canonical_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests whether generate_canonical calls the `get_date_archive_permalink` method of the current page helper.
	 *
	 * @covers ::generate_canonical
	 *
	 * @return void
	 */
	public function test_generate_canonical() {
		$this->current_page
			->expects( 'get_date_archive_permalink' )
			->once()
			->andReturn( 'https://permalink' );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
			->once()
			->andReturn( 0 );

		$this->assertEquals( 'https://permalink', $this->instance->generate_canonical() );
	}

	/**
	 * Tests whether generate_canonical uses the paginated url.
	 *
	 * @covers ::generate_canonical
	 *
	 * @return void
	 */
	public function test_generate_canonical_paginated() {
		$this->current_page
			->expects( 'get_date_archive_permalink' )
			->once()
			->andReturn( 'https://permalink' );

		$this->pagination
			->expects( 'get_current_archive_page_number' )
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
