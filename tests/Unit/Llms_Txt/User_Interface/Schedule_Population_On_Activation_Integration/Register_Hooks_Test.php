<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Schedule_Population_On_Activation_Integration;

/**
 * Tests the register_hooks.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Schedule_Population_On_Activation_Integration::register_hooks
 */
final class Register_Hooks_Test extends Abstract_Schedule_Population_On_Activation_Integration_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertEquals(
			10,
			\has_action(
				'wpseo_activate',
				[ $this->instance, 'schedule_llms_txt_population' ]
			)
		);
	}
}
