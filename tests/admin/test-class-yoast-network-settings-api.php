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
	 * Tests registering a setting.
	 *
	 * @covers Yoast_Network_Settings_API::register_setting()
	 */
	public function test_register_setting() {
		$api = new Yoast_Network_Settings_API();

		$api->register_setting( 'yst_ms_group', 'yst_ms_option', array(
			'sanitize_callback' => 'absint',
			'default'           => 1,
		) );

		$this->assertInternalType( 'int', has_filter( 'sanitize_option_yst_ms_option', array( $api, 'filter_sanitize_option' ) ) );
		$this->assertInternalType( 'int', has_filter( 'default_site_option_yst_ms_option', array( $api, 'filter_default_option' ) ) );
	}

	/**
	 * Tests getting registered settings.
	 *
	 * @covers Yoast_Network_Settings_API::get_registered_settings()
	 */
	public function test_get_registered_settings() {
		$group = 'yst_ms_group';
		$name  = 'yst_ms_option';
		$args  = array(
			'sanitize_callback' => 'absint',
			'default'           => 1,
		);

		$api = new Yoast_Network_Settings_API();
		$api->register_setting( $group, $name, $args );

		$args     = array_merge( array( 'group' => $group ), $args );
		$expected = array( $name => $args );

		$this->assertSame( $expected, $api->get_registered_settings() );
	}

	/**
	 * Tests getting whitelisted options.
	 *
	 * @covers Yoast_Network_Settings_API::get_whitelist_options()
	 */
	public function test_get_whitelist_options() {
		$registered_group   = 'yst_ms_group';
		$unregistered_group = 'yst_ms_unregistered_group';

		$options = array( 'my_option1', 'my_option2' );

		$api = new Yoast_Network_Settings_API();
		foreach ( $options as $option ) {
			$api->register_setting( $registered_group, $option );
		}

		$this->assertEmpty( $api->get_whitelist_options( $unregistered_group ) );
		$this->assertSame( $options, $api->get_whitelist_options( $registered_group ) );
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
		$api->register_setting( 'yst_ms_group', 'yst_ms_option', array( 'sanitize_callback' => 'absint' ) );
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
		$api = new Yoast_Network_Settings_API();

		$this->assertSame( is_multisite(), $api->meets_requirements() );
	}
}
