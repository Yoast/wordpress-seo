<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\Infrastructure\Tracking_On_Page_Load;

use Brain\Monkey;

/**
 * Tests the Tracking_On_Page_Load_Integration register_hooks method.
 *
 * @group tracking
 *
 * @covers Yoast\WP\SEO\Tracking\Infrastructure\Tracking_On_Page_Load_Integration::register_hooks
 */
final class Register_Hooks_Test extends Abstract_Tracking_On_Page_Load_Integration_Test {

	/**
	 * Tests the register_hooks method.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_init' )
			->once()
			->with( [ $this->instance, 'store_version_on_page_load' ] );

		$this->instance->register_hooks();
	}
}
