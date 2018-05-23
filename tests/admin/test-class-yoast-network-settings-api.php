<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class Yoast_Network_Settings_API_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests output for hidden settings fields.
	 *
	 * @covers Yoast_Network_Settings_API::settings_fields()
	 */
	public function test_settings_fields() {
		$api = new Yoast_Network_Settings_API();

		$group = 'yst_ms_group';

		ob_start();
		$api->settings_fields( $group );
		$output = ob_get_clean();

		$this->assertTrue( (bool) strpos( $output, 'name="network_option_group" value="' . $group . '"' ) );
		$this->assertTrue( (bool) strpos( $output, 'name="action" value="yoast_handle_network_options"' ) );
		$this->assertTrue( preg_match( '/name="_wpnonce" value="([a-z0-9]+)"/', $output, $matches ) );
		$this->assertTrue( wp_verify_nonce( $matches[1], $group . '-network-options' ) );
	}

	/**
	 * Tests registering a setting.
	 *
	 * @covers Yoast_Network_Settings_API::register_setting()
	 */
	public function test_register_setting() {
		$api = new Yoast_Network_Settings_API();

		$api->register_setting( 'yst_ms_group', 'yst_ms_option', array(
			'santize_callback' => 'absint',
			'default'          => 1,
		) );

		$this->assertInternalType( 'int', has_filter( 'sanitize_option_yst_ms_option', array( $api, 'filter_sanitize_option' ) ) );
		$this->assertInternalType( 'int', has_filter( 'default_site_option_yst_ms_option', array( $api, 'filter_default_option' ) ) );
	}

	/**
	 * Tests filtering setting sanitization.
	 *
	 * @covers Yoast_Network_Settings_API::filter_sanitize_option()
	 */
	public function test_filter_sanitize_option() {
		$api = new Yoast_Network_Settings_API();

		// Option not registered.
		$this->assertSame( '2', $api->filter_sanitize_option( '2', 'yst_ms_unregistered_option' ) );

		// Option registered.
		$api->register_setting( 'yst_ms_group', 'yst_ms_option', array( 'santize_callback' => 'absint' ) );
		$this->assertSame( 2, $api->filter_sanitize_option( '2', 'yst_ms_option' ) );
	}

	/**
	 * Tests filtering setting default.
	 *
	 * @covers Yoast_Network_Settings_API::filter_default_option()
	 */
	public function test_filter_default_option() {
		$api = new Yoast_Network_Settings_API();

		// Option not registered.
		$this->assertSame( false, $api->filter_default_option( false, 'yst_ms_unregistered_option' ) );

		// Option registered.
		$api->register_setting( 'yst_ms_group', 'yst_ms_option', array( 'default' => 2 ) );
		$this->assertSame( 2, $api->filter_default_option( false, 'yst_ms_option' ) );

		// Option registered, but specific default requested.
		$this->assertSame( 4, $api->filter_default_option( 4, 'yst_ms_option' ) );
	}

	/**
	 * Tests registering main hooks.
	 *
	 * @covers Yoast_Network_Settings_API::register_hooks()
	 */
	public function test_register_hooks() {
		$api = new Yoast_Network_Settings_API();

		// Hook should be present after first call.
		$api->register_hooks();
		$this->assertInternalType( 'int', has_action( 'admin_action_yoast_handle_network_options', array( $api, 'handle_update_options_request' ) ) );

		// Remove the hook again manually.
		remove_action( 'admin_action_yoast_handle_network_options', array( $api, 'handle_update_options_request' ) );

		// Hook should not be added again because of restriction.
		$api->register_hooks();
		$this->assertFalse( has_action( 'admin_action_yoast_handle_network_options', array( $api, 'handle_update_options_request' ) ) );
	}

	/**
	 * Tests the singleton getter.
	 *
	 * @covers Yoast_Network_Settings_API::get()
	 */
	public function test_get() {
		$this->assertInstanceOf( 'Yoast_Network_Settings_API', Yoast_Network_Settings_API::get() );
	}

	/**
	 * Tests checking requirements for the network settings API.
	 *
	 * @covers Yoast_Network_Settings_API::meets_requirements()
	 */
	public function test_meets_requirements() {

		// It's impossible to simulate `is_network_admin()` to be true in tests.
		$this->assertFalse( Yoast_Network_Settings_API::meets_requirements() );
	}
}
