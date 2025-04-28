<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Setup;

use Brain\Monkey\Functions;

/**
 * Test intercept_site_kit_setup_url_redirect method.
 *
 * @group  site_kit_setup_flow
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Url_Interceptor::intercept_site_kit_setup_url_redirect
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Url_Interceptor_Intercept_Setup_Redirect_Test extends Abstract_Setup_Url_Interceptor_Test {

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->site_kit->expects( 'get_install_url' )->andReturn( 'install_url' );
		$this->site_kit->expects( 'get_activate_url' )->andReturn( 'activate_url' );
		$this->site_kit->expects( 'get_setup_url' )->andReturn( 'setup_url' );
		$this->site_kit->expects( 'get_update_url' )->andReturn( 'update_url' );
	}

	/**
	 * Tests the intercept_site_kit_setup_flow route's happy path.
	 *
	 * @return void
	 */
	public function test_intercept_site_kit_setup_url_everything_setup() {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->andReturn( 'wpseo_page_site_kit_set_up' );
		$_GET['redirect_setup_url'] = 'install_url';
		Functions\expect( 'set_transient' )
			->once()
			->with( 'wpseo_site_kit_set_up_transient', 1, ( 60 * 15 ) )
			->andReturn( '1' );
		$this->redirect_helper->expects( 'do_safe_redirect' )
			->with( 'install_url', 302, 'Yoast SEO' );
		$this->instance->intercept_site_kit_setup_url_redirect();
	}

	/**
	 * Tests the intercept_site_kit_setup_flow route's happy path.
	 *
	 * @return void
	 */
	public function test_intercept_site_kit_setup_url_wrong_page() {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->andReturn( 'different page' );
		Functions\expect( 'set_transient' )
			->never()
			->with( 'wpseo_site_kit_set_up_transient', 1, ( 60 * 15 ) )
			->andReturn( '1' );

		$this->instance->intercept_site_kit_setup_url_redirect();
	}

	/**
	 * Tests the intercept_site_kit_setup_flow route's happy path.
	 *
	 * @return void
	 */
	public function test_intercept_site_kit_setup_url_unexpected_url() {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->andReturn( 'wpseo_page_site_kit_set_up' );
		$_GET['redirect_setup_url'] = 'mybadsite.exameple.com';
		Functions\expect( 'set_transient' )
			->never()
			->with( 'wpseo_site_kit_set_up_transient', 1, ( 60 * 15 ) )
			->andReturn( '1' );

		Functions\expect( 'self_admin_url' )
			->once()
			->with( 'admin.php?page=wpseo_dashboard' )
			->andReturn( 'admin.php?page=wpseo_dashboard' );
		$this->redirect_helper->expects( 'do_safe_redirect' )
			->with( 'admin.php?page=wpseo_dashboard', 302, 'Yoast SEO' );
		$this->instance->intercept_site_kit_setup_url_redirect();
	}
}
