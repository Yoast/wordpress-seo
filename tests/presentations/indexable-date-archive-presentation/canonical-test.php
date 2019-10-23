<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Canonical_Test.
 *
 * @group presentations
 * @group canonical
 *
 * @package Yoast\Tests\Presentations\Indexable_Date_Archive_Presentation
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
	 */
	public function test_generate_canonical() {
		$this->current_page_helper
			->expects( 'get_date_archive_permalink' )
			->once()
			->andReturn( 'https://permalink' );

		$this->assertEquals( 'https://permalink', $this->instance->generate_canonical() );
	}
}
