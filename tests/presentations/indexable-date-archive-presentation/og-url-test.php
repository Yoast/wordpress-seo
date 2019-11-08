<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_URL_Test.
 *
 * @group presentations
 * @group og-url
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Date_Archive_Presentation
 */
class OG_URL_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests whether generate_og_url calls the `get_date_archive_permalink` method of the current page helper.
	 *
	 * @covers ::generate_og_url
	 */
	public function test_generate_og_url() {
		$this->current_page_helper
			->expects( 'get_date_archive_permalink' )
			->once()
			->andReturn( 'https://example.com/2019/11' );

		$this->assertEquals( 'https://example.com/2019/11', $this->instance->generate_og_url() );
	}
}
