<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Yoast_Plugins_Tab\User_Interface\Yoast_Plugins_Tab;

use Brain\Monkey;

/**
 * Tests the Yoast_Plugins_Tab_Integration register_hooks method.
 *
 * @group yoast-plugins-tab
 *
 * @covers Yoast\WP\SEO\Yoast_Plugins_Tab\User_Interface\Yoast_Plugins_Tab_Integration::register_hooks
 */
final class Register_Hooks_Test extends Abstract_Yoast_Plugins_Tab_Integration_Test {

	/**
	 * Tests that hooks are registered on WP 7.0+.
	 *
	 * @return void
	 */
	public function test_register_hooks_on_wp_70() {
		global $wp_version;
		$wp_version = '7.0';

		Monkey\Filters\expectAdded( 'plugins_list' )
			->once()
			->with( [ $this->handler, 'filter_plugins_list' ] );

		Monkey\Filters\expectAdded( 'plugins_list_status_text' )
			->once()
			->with( [ $this->handler, 'get_status_text' ], 10, 3 );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that hooks are not registered on WP below 7.0.
	 *
	 * @return void
	 */
	public function test_register_hooks_on_wp_below_70() {
		global $wp_version;
		$wp_version = '6.9';

		Monkey\Filters\expectAdded( 'plugins_list' )
			->never();

		Monkey\Filters\expectAdded( 'plugins_list_status_text' )
			->never();

		$this->instance->register_hooks();
	}
}
