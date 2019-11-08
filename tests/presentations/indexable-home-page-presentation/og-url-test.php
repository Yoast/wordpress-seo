<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Home_Page_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_URL_Test.
 *
 * @group presentations
 * @group og-url
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Home_Page_Presentation
 */
class OG_URL_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether generate_og_url calls the `home` method of the url helper.
	 *
	 * @covers ::generate_og_url
	 */
	public function test_generate_og_url() {
		$this->url_helper
			->expects( 'home' )
			->withNoArgs()
			->once()
			->andReturn( 'https://example.com/' );

		$this->assertEquals( 'https://example.com/', $this->instance->generate_og_url() );
	}
}
