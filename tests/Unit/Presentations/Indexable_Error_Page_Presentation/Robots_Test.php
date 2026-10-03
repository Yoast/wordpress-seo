<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Error_Page_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Test.
 *
 * @group presentations
 * @group robots
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Error_Page_Presentation
 */
final class Robots_Test extends TestCase {

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
	 * Tests that the robots is set to no index.
	 *
	 * @covers ::generate_robots
	 *
	 * @return void
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
