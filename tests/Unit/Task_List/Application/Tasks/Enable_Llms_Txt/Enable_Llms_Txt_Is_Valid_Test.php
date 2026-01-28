<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Enable_Llms_Txt;

use Brain\Monkey;

/**
 * Test class for the is_valid method.
 *
 * @group Enable_Llms_Txt
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::is_valid
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Enable_Llms_Txt_Is_Valid_Test extends Abstract_Enable_Llms_Txt_Test {

	/**
	 * Tests if the task is valid when not on a multisite installation.
	 *
	 * @return void
	 */
	public function test_is_valid_on_single_site() {
		Monkey\Functions\stubs(
			[
				'is_multisite' => false,
			]
		);

		$this->assertTrue( $this->instance->is_valid() );
	}

	/**
	 * Tests if the task is not valid when on a multisite installation.
	 *
	 * @return void
	 */
	public function test_is_not_valid_on_multisite() {
		Monkey\Functions\stubs(
			[
				'is_multisite' => true,
			]
		);

		$this->assertFalse( $this->instance->is_valid() );
	}
}
