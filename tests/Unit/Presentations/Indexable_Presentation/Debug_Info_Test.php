<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Debug_Info_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
final class Debug_Info_Test extends TestCase {

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
	 * Tests the debug info method.
	 *
	 * @covers ::__debugInfo
	 *
	 * @return void
	 */
	public function test_debug_info() {
		$this->instance->model   = 'indexable';
		$this->instance->context = 'context';

		$expected = [
			'model'   => 'indexable',
			'context' => 'context',
		];

		$this->assertEquals( $expected, $this->instance->__debugInfo() );
	}
}
