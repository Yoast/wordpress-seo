<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Static_Posts_Page_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class OG_URL_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Static_Posts_Page_Presentation
 *
 * @group presentations
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
	 * Tests the situation where the canonical is returned.
	 *
	 * @covers ::generate_og_url
	 */
	public function test_generate_og_url_and_return_home_url() {
		$this->url_helper->expects( 'home' )
			->once()
			->andReturn( 'https://example.com/' );

		$this->assertEquals( 'https://example.com/', $this->instance->generate_og_url() );
	}
}
