<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Generate_Source_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class Generate_Source_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether an empty array is returned.
	 *
	 * @covers ::generate_source
	 */
	public function test_generate_source() {
		$this->assertEquals( [], $this->instance->generate_source() );
	}
}
