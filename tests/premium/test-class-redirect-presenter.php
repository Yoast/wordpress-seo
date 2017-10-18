<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for the presenter
 *
 * @covers WPSEO_Redirect_Presenter
 */
class WPSEO_Redirect_Presenter_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Presenter
	 */
	private $class_instance;

	/**
	 * Setting the presenter
	 */
	public function setUp() {
		$this->class_instance = new WPSEO_Redirect_Presenter();
	}

	/**
	 * Test with the plain url tab.
	 *
	 * @covers WPSEO_Redirect_Presenter::display
	 */
	public function test_display_plain() {
		ob_start();

		$this->class_instance->display( 'plain' );

		$output = ob_get_clean();

		// Check if the output contains tabs with only the plain-tab active.
		$this->assertContains(
			'<a class="nav-tab nav-tab-active" id="tab-url-tab" href="' . admin_url( 'admin.php?page=wpseo_redirects&tab=plain' ) . '">Redirects</a><a class="nav-tab" id="tab-url-tab" href="' . admin_url( 'admin.php?page=wpseo_redirects&tab=regex' ) . '">Regex Redirects</a>',
			$output
		);
	}

	/**
	 * Test with the plain url tab.
	 *
	 * @covers WPSEO_Redirect_Presenter::display
	 */
	public function test_display_regex() {
		ob_start();

		$this->class_instance->display( 'regex' );

		$output = ob_get_clean();

		// Check if the output contains tabs with only the plain-tab active.
		$this->assertContains(
			'<a class="nav-tab" id="tab-url-tab" href="' . admin_url( 'admin.php?page=wpseo_redirects&tab=plain' ) . '">Redirects</a><a class="nav-tab nav-tab-active" id="tab-url-tab" href="' . admin_url( 'admin.php?page=wpseo_redirects&tab=regex' ) . '">Regex Redirects</a>',
			$output
		);
	}

	/**
	 * Test with the plain url tab.
	 *
	 * @covers WPSEO_Redirect_Presenter::display
	 */
	public function test_display_settings() {
		add_filter( 'user_has_cap', array( $this , 'add_capability' ) );

		ob_start();

		$this->class_instance->display( 'settings' );

		$output = ob_get_clean();

		// Check if the output contains tabs with only the plain-tab active.
		$this->assertContains(
			'<a class="nav-tab" id="tab-url-tab" href="' . admin_url( 'admin.php?page=wpseo_redirects&tab=plain' ) . '">Redirects</a><a class="nav-tab" id="tab-url-tab" href="' . admin_url( 'admin.php?page=wpseo_redirects&tab=regex' ) . '">Regex Redirects</a><a class="nav-tab nav-tab-active" id="tab-url-tab" href="' . admin_url( 'admin.php?page=wpseo_redirects&tab=settings' ) . '">Settings</a>',
			$output
		);

		remove_filter( 'user_has_cap', array( $this , 'add_capability' ) );
	}

	/**
	 * Sets the 'rendering' of the settings tab for a user that has insufficient rights to see it.
	 */
	public function test_settings_tab_without_rights_for_seeing_it() {
		ob_start();

		$this->class_instance->display( 'settings' );

		$output = ob_get_clean();

		$this->assertNotContains( '<a class="nav-tab nav-tab-active" id="tab-url-tab" href="' . admin_url( 'admin.php?page=wpseo_redirects&tab=settings' ) . '">Settings</a>', $output );
	}

	/**
	 * Fakes the capability for manage options.
	 *
	 * @param array $capabilities The capabilities to extends.
	 *
	 * @return array The extended capabilities.
	 */
	public function add_capability( $capabilities ) {
		$capabilities['wpseo_manage_options'] = true;

		return $capabilities;
	}


}