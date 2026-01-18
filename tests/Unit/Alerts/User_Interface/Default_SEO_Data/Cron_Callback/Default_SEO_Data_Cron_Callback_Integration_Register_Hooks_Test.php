<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\User_Interface\Default_SEO_Data\Cron_Callback;

use Brain\Monkey;

/**
 * Test class for the register_hooks method.
 *
 * @group Default_SEO_Data
 *
 * @covers Yoast\WP\SEO\Alerts\User_Interface\Default_SEO_Data\Default_SEO_Data_Cron_Callback_Integration::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Cron_Callback_Integration_Register_Hooks_Test extends Abstract_Default_SEO_Data_Cron_Callback_Integration_Test {

	/**
	 * Tests if the hooks are registered properly.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'wpseo_detect_default_seo_data' )
			->with( [ $this->instance, 'detect_default_seo_data_in_recent' ] );

		$this->instance->register_hooks();
	}
}
