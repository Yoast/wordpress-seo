<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class Yoast_Network_Admin_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests getting site choices.
	 *
	 * @group ms-required
	 * @covers Yoast_Network_Admin::get_site_choices()
	 */
	public function test_get_site_choices() {
		$admin = new Yoast_Network_Admin();

		$site_ids = array_map( 'strval', array_merge( array( get_current_blog_id() ), self::factory()->blog->create_many( 5 ) ) );

		$choices = $admin->get_site_choices();
		$this->assertSame( $site_ids, array_map( 'strval', array_keys( $choices ) ) );

		array_unshift( $site_ids, '-' );

		$choices = $admin->get_site_choices( true );
		$this->assertSame( $site_ids, array_map( 'strval', array_keys( $choices ) ) );
	}

	/**
	 * Tests output for hidden settings fields.
	 *
	 * @covers Yoast_Network_Admin::settings_fields()
	 */
	public function test_settings_fields() {
		$admin = new Yoast_Network_Admin();

		$group = 'yst_ms_group';

		ob_start();
		$admin->settings_fields( $group );
		$output = ob_get_clean();

		$this->assertTrue( (bool) strpos( $output, 'name="network_option_group" value="' . $group . '"' ) );
		$this->assertTrue( (bool) strpos( $output, 'name="action" value="' . Yoast_Network_Admin::UPDATE_OPTIONS_ACTION . '"' ) );
		$this->assertTrue( (bool) preg_match( '/name="_wpnonce" value="([a-z0-9]+)"/', $output, $matches ) );
		$this->assertTrue( (bool) wp_verify_nonce( $matches[1], $group . '-network-options' ) );
	}

	/**
	 * Tests registering main hooks.
	 *
	 * @covers Yoast_Network_Admin::register_hooks()
	 */
	public function test_register_hooks() {
		$admin = $this->getMockBuilder( 'Yoast_Network_Admin' )
			->setMethods( array( 'meets_requirements' ) )
			->getMock();

		$admin
			->expects( $this->once() )
			->method( 'meets_requirements' )
			->willReturn( true );

		$admin->register_hooks();
		$this->assertInternalType( 'int', has_action( 'admin_action_' . Yoast_Network_Admin::UPDATE_OPTIONS_ACTION, array( $admin, 'handle_update_options_request' ) ) );
		$this->assertInternalType( 'int', has_action( 'admin_action_' . Yoast_Network_Admin::RESTORE_SITE_ACTION, array( $admin, 'handle_restore_site_request' ) ) );
	}

	/**
	 * Tests the singleton getter.
	 *
	 * @covers Yoast_Network_Admin::get()
	 */
	public function test_get() {
		$this->assertInstanceOf( 'Yoast_Network_Admin', Yoast_Network_Admin::get() );
	}

	/**
	 * Tests checking requirements for the network settings API.
	 *
	 * @covers Yoast_Network_Admin::meets_requirements()
	 */
	public function test_meets_requirements() {
		$admin = new Yoast_Network_Admin();

		// It's impossible to simulate `is_network_admin()` to be true in tests.
		$this->assertFalse( $admin->meets_requirements() );
	}
}
