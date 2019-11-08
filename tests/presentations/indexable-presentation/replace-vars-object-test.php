<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Replace_Vars_Object_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class Replace_Vars_Object_Test extends TestCase {
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
	 * @covers ::generate_replace_vars_object
	 */
	public function test_generate_replace_vars_object() {
		$this->assertEquals( [], $this->instance->generate_replace_vars_object() );
	}
}
