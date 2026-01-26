<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Setup;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test intercept_site_kit_setup_flow method.
 *
 * @group  site_kit_setup_flow
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Flow_Interceptor::intercept_site_kit_setup_flow
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Flow_Interceptor::is_site_kit_setup_completed_page
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Flow_Interceptor_Intercept_Test extends Abstract_Setup_Flow_Interceptor_Test {

	/**
	 * Tests the intercept_site_kit_setup_flow route's happy path.
	 *
	 * @return void
	 */
	public function test_intercept_site_kit_setup_flow_everything_setup() {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->andReturn( 'googlesitekit-splash' );
		$_GET['notification'] = 'authentication_success';
		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_site_kit_set_up_transient' )
			->andReturn( '1' );
		Functions\expect( 'delete_transient' )
			->once()
			->with( 'wpseo_site_kit_set_up_transient' );

		Functions\expect( 'self_admin_url' )
			->once()
			->with( 'admin.php?page=wpseo_dashboard&redirected_from_site_kit' )
			->andReturn( 'admin.php?page=wpseo_dashboard&redirected_from_site_kit' );
		$this->redirect_helper->expects( 'do_safe_redirect' )
			->with( 'admin.php?page=wpseo_dashboard&redirected_from_site_kit', 302, 'Yoast SEO' );
		$this->instance->intercept_site_kit_setup_flow();
	}

	/**
	 * Tests the intercept_site_kit_setup_flow route's happy path for analytics.
	 *
	 * @return void
	 */
	public function test_intercept_site_kit_setup_flow_everything_setup_analytics() {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->andReturn( 'googlesitekit-dashboard' );
		$this->site_kit->expects( 'is_ga_connected' )->andReturn( true );
		$_GET['notification'] = 'authentication_success';
		$_GET['slug']         = 'analytics-4';
		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_site_kit_set_up_transient' )
			->andReturn( '1' );
		Functions\expect( 'delete_transient' )
			->once()
			->with( 'wpseo_site_kit_set_up_transient' );

		Functions\expect( 'self_admin_url' )
			->once()
			->with( 'admin.php?page=wpseo_dashboard&redirected_from_site_kit' )
			->andReturn( 'admin.php?page=wpseo_dashboard&redirected_from_site_kit' );
		$this->redirect_helper->expects( 'do_safe_redirect' )
			->with( 'admin.php?page=wpseo_dashboard&redirected_from_site_kit', 302, 'Yoast SEO' );
		$this->instance->intercept_site_kit_setup_flow();
	}

	/**
	 * Tests the intercept_site_kit_setup_flow route's paths where the transient is set but we are on different pages.
	 *
	 * @dataProvider generate_setup_interceptor_pages_provider
	 *
	 * @param string $page         The current page.
	 * @param string $notification The notification.
	 *
	 * @return void
	 */
	public function test_intercept_site_kit_setup_flow_different_pages( $page, $notification ) {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->andReturn( $page );
		$_GET['notification'] = $notification;
		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_site_kit_set_up_transient' )
			->andReturn( '1' );
		Functions\expect( 'delete_transient' )
			->never();

		$this->redirect_helper->expects( 'do_safe_redirect' )->never();
		$this->instance->intercept_site_kit_setup_flow();
	}

	/**
	 * Tests the intercept_site_kit_setup_flow route where we have the transient and correct page but not a
	 * notification.
	 *
	 * @return void
	 */
	public function test_intercept_site_kit_setup_flow_no_notification() {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->andReturn( 'googlesitekit-something' );
		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_site_kit_set_up_transient' )
			->andReturn( '1' );
		Functions\expect( 'delete_transient' )
			->never();

		$this->redirect_helper->expects( 'do_safe_redirect' )->never();
		$this->instance->intercept_site_kit_setup_flow();
	}

	/**
	 * Provides data testing for the interceptor checks with missing values.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_setup_interceptor_pages_provider() {
		yield 'Wrong page' => [
			'page'         => 'googlesitekit-something',
			'notification' => 'authentication_success',
		];

		yield 'wrong notification' => [
			'page'         => 'googlesitekit-splash',
			'notification' => 'something random',
		];
	}

	/**
	 * Tests the intercept_site_kit_setup_flow route's paths where the transient has unexpected values.
	 *
	 * @dataProvider generate_setup_interceptor_transient_provider
	 *
	 * @param string|bool|int $transient_value The transient value.
	 *
	 * @return void
	 */
	public function test_intercept_site_kit_setup_flow_different_transients( $transient_value ) {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->never();

		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_site_kit_set_up_transient' )
			->andReturn( $transient_value );
		Functions\expect( 'delete_transient' )
			->never();

		$this->redirect_helper->expects( 'do_safe_redirect' )->never();
		$this->instance->intercept_site_kit_setup_flow();
	}

	/**
	 * The generator for `test_intercept_site_kit_setup_flow_different_transients`.
	 *
	 * @return Generator
	 */
	public static function generate_setup_interceptor_transient_provider() {
		yield 'Wrong transient string ' => [
			'transient_value' => 'random string',
			'page'            => 'googlesitekit-splash',
			'notification'    => 'authentication_success',
		];
		yield 'Wrong transient boolean true' => [
			'transient_value' => true,
			'page'            => 'googlesitekit-splash',
			'notification'    => 'authentication_success',
		];
		yield 'Wrong transient boolean false' => [
			'transient_value' => false,
			'page'            => 'googlesitekit-splash',
			'notification'    => 'authentication_success',
		];
	}
}
