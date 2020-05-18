<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Debug_Info_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class Debug_Info_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the debug info method.
	 *
	 * @covers ::__debugInfo
	 */
	public function test_debug_info() {
		$this->instance->model   = 'indexable';
		$this->instance->context = 'context';

		$this->assertEquals( [ 'model' => 'indexable', 'context' => 'context' ], $this->instance->__debugInfo() );
	}
}
