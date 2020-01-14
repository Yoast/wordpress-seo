<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Static_Home_Page_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class OG_Type_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Static_Home_Page_Presentation
 *
 * @group presentations
 */
class OG_Type_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether the og type is article.
	 *
	 * @covers ::generate_og_type
	 */
	public function test_og_type() {
		$this->assertEquals( 'website', $this->instance->generate_og_type() );
	}
}
