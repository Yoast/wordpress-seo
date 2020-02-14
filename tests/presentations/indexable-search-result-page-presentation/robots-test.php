<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Search_Result_Page_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Robots_Test.
 *
 * @group presentations
 * @group robots
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Search_Result_Page_Presentation
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
	 * Tests that the robots is set to no index.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_dont_index() {
		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}
}
