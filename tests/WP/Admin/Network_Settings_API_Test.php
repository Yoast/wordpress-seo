<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast_Network_Settings_API;

/**
 * Unit Test Class.
 */
final class Network_Settings_API_Test extends TestCase {

	/**
	 * Tests registering a setting.
	 *
	 * @covers Yoast_Network_Settings_API::register_setting
	 *
	 * @return void
	 */
	public function test_register_setting() {
		$api = new Yoast_Network_Settings_API();

		$setting_args = [
			'sanitize_callback' => 'absint',
			'default'           => 1,
		];
		$api->register_setting( 'yst_ms_group', 'yst_ms_option', $setting_args );

		$this->assertIsInt( \has_filter( 'sanitize_option_yst_ms_option', [ $api, 'filter_sanitize_option' ] ) );
		$this->assertIsInt( \has_filter( 'default_site_option_yst_ms_option', [ $api, 'filter_default_option' ] ) );
	}

	/**
	 * Tests getting registered settings.
	 *
	 * @covers Yoast_Network_Settings_API::get_registered_settings
	 *
	 * @return void
	 */
	public function test_get_registered_settings() {
		$group = 'yst_ms_group';
		$name  = 'yst_ms_option';
		$args  = [
			'sanitize_callback' => 'absint',
			'default'           => 1,
		];

		$api = new Yoast_Network_Settings_API();
		$api->register_setting( $group, $name, $args );

		$args     = \array_merge( [ 'group' => $group ], $args );
		$expected = [ $name => $args ];

		$this->assertSame( $expected, $api->get_registered_settings() );
	}

	/**
	 * Tests getting whitelisted options.
	 *
	 * @covers Yoast_Network_Settings_API::get_whitelist_options
	 *
	 * @return void
	 */
	public function test_get_whitelist_options() {
		$registered_group   = 'yst_ms_group';
		$unregistered_group = 'yst_ms_unregistered_group';

		$options = [ 'my_option1', 'my_option2' ];

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
	 * @covers Yoast_Network_Settings_API::filter_sanitize_option
	 *
	 * @return void
	 */
	public function test_filter_sanitize_option() {
		$api = new Yoast_Network_Settings_API();

		// Option not registered.
		$this->assertSame( '2', $api->filter_sanitize_option( '2', 'yst_ms_unregistered_option' ) );

		// Option registered.
		$api->register_setting( 'yst_ms_group', 'yst_ms_option', [ 'sanitize_callback' => 'absint' ] );
		$this->assertSame( 2, $api->filter_sanitize_option( '2', 'yst_ms_option' ) );
	}

	/**
	 * Tests filtering setting default.
	 *
	 * @covers Yoast_Network_Settings_API::filter_default_option
	 *
	 * @return void
	 */
	public function test_filter_default_option() {
		$api = new Yoast_Network_Settings_API();

		// Option not registered.
		$this->assertSame( false, $api->filter_default_option( false, 'yst_ms_unregistered_option' ) );

		// Option registered.
		$api->register_setting( 'yst_ms_group', 'yst_ms_option', [ 'default' => 2 ] );
		$this->assertSame( 2, $api->filter_default_option( false, 'yst_ms_option' ) );

		// Option registered, but specific default requested.
		$this->assertSame( 4, $api->filter_default_option( 4, 'yst_ms_option' ) );
	}

	/**
	 * Tests the singleton getter.
	 *
	 * @covers Yoast_Network_Settings_API::get
	 *
	 * @return void
	 */
	public function test_get() {
		$this->assertInstanceOf( Yoast_Network_Settings_API::class, Yoast_Network_Settings_API::get() );
	}

	/**
	 * Tests checking requirements for the network settings API.
	 *
	 * @covers Yoast_Network_Settings_API::meets_requirements
	 *
	 * @return void
	 */
	public function test_meets_requirements() {
		$api = new Yoast_Network_Settings_API();

		$this->assertSame( \is_multisite(), $api->meets_requirements() );
	}
}
