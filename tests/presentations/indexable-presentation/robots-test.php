<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Robots_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group robots
 */
class Robots_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots() {
		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'index',
			'follow' => 'follow',
		];

		$this->assertEquals( $actual, $expected );
	}
}
