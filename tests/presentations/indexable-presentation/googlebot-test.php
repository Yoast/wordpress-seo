<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Googlebot_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class Googlebot_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether the array with default settings is returned.
	 *
	 * @covers ::generate_googlebot
	 */
	public function test_generate_googlebot() {
		$this->assertEquals( [ 'max-snippet:-1', 'max-image-preview:large', 'max-video-preview:-1' ], $this->instance->generate_googlebot() );
	}
}
