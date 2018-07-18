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
	 * @var int Network administrator user ID.
	 */
	protected static $network_administrator;

	/**
	 * Sets up a network administrator user to use for tests.
	 *
	 * @param WP_UnitTest_Factory $factory Unit test factory instance.
	 *
	 * @return void
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$network_administrator = $factory->user->create( array( 'role' => 'administrator' ) );
		grant_super_admin( self::$network_administrator );
	}

	/**
	 * Deletes the network administrator user used in tests.
	 *
	 * @return void
	 */
	public static function wpTearDownAfterClass() {
		revoke_super_admin( self::$network_administrator );
		self::delete_user( self::$network_administrator );
	}

	/**
	 * Tests that the network admin class implements the required interfaces.
	 */
	public function test_implements_interfaces() {
		$admin = new Yoast_Network_Admin();

		$this->assertInstanceOf( 'WPSEO_WordPress_Integration', $admin );
		$this->assertInstanceOf( 'WPSEO_WordPress_AJAX_Integration', $admin );
	}

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
	 * Tests getting a site's states.
	 *
	 * @group ms-required
	 * @covers Yoast_Network_Admin::get_site_states()
	 */
	public function test_get_site_states() {
		$admin = new Yoast_Network_Admin();

		$active_states = array(
			'public' => '1',
			'mature' => '1',
			'spam'   => '1',
		);

		$site_id = self::factory()->blog->create();
		update_blog_details( $site_id, $active_states );

		$site_states = $admin->get_site_states( get_site( $site_id ) );
		$this->assertSame( array_keys( $active_states ), array_keys( $site_states ) );
	}

	/**
	 * Tests handling a request to update options.
	 *
	 * @covers Yoast_Network_Admin::handle_update_options_request()
	 */
	public function test_handle_update_options_request() {
		$admin = $this
			->getMockBuilder( 'Yoast_Network_Admin' )
			->setMethods( array( 'verify_request', 'terminate_request' ) )
			->getMock();

		$admin
			->expects( $this->once() )
			->method( 'verify_request' )
			->with( '-network-options' );

		$admin
			->expects( $this->once() )
			->method( 'terminate_request' );

		$admin->handle_update_options_request();
	}

	/**
	 * Tests handling a request to restore a site's settings.
	 *
	 * @covers Yoast_Network_Admin::handle_restore_site_request()
	 */
	public function test_handle_restore_site_request() {
		$admin = $this
			->getMockBuilder( 'Yoast_Network_Admin' )
			->setMethods( array( 'verify_request', 'terminate_request' ) )
			->getMock();

		$admin
			->expects( $this->once() )
			->method( 'verify_request' )
			->with( 'wpseo-network-restore', 'restore_site_nonce' );

		$admin
			->expects( $this->once() )
			->method( 'terminate_request' );

		$admin->handle_restore_site_request();
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
			->will( $this->returnValue( true ) );

		$admin->register_hooks();
		$this->assertInternalType( 'int', has_action( 'admin_action_' . Yoast_Network_Admin::UPDATE_OPTIONS_ACTION, array( $admin, 'handle_update_options_request' ) ) );
		$this->assertInternalType( 'int', has_action( 'admin_action_' . Yoast_Network_Admin::RESTORE_SITE_ACTION, array( $admin, 'handle_restore_site_request' ) ) );
	}

	/**
	 * Tests registering AJAX hooks.
	 *
	 * @covers Yoast_Network_Admin::register_ajax_hooks()
	 */
	public function test_register_ajax_hooks() {
		$admin = new Yoast_Network_Admin();

		$admin->register_ajax_hooks();
		$this->assertInternalType( 'int', has_action( 'wp_ajax_' . Yoast_Network_Admin::UPDATE_OPTIONS_ACTION, array( $admin, 'handle_update_options_request' ) ) );
		$this->assertInternalType( 'int', has_action( 'wp_ajax_' . Yoast_Network_Admin::RESTORE_SITE_ACTION, array( $admin, 'handle_restore_site_request' ) ) );
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

	/**
	 * Tests verifying a request with an invalid nonce.
	 *
	 * @covers Yoast_Network_Admin::verify_request()
	 * @expectedException WPDieException
	 */
	public function test_verify_request_with_invalid_nonce() {
		$admin = new Yoast_Network_Admin();

		$_REQUEST['_wp_http_referer'] = admin_url();
		$_REQUEST['_wpnonce']         = '';

		try {
			$admin->verify_request( 'my_action' );
		} catch ( WPDieException $e ) {
			$this->assertContains( 'The link you followed has expired.', $e->getMessage() );
			throw $e;
		}
	}

	/**
	 * Tests verifying a request with a valid nonce, but lacking capabilities.
	 *
	 * @covers Yoast_Network_Admin::verify_request()
	 * @expectedException WPDieException
	 */
	public function test_verify_request_with_valid_nonce_but_lacking_caps() {
		$admin = new Yoast_Network_Admin();

		$_REQUEST['_wp_http_referer'] = admin_url();
		$_REQUEST['_wpnonce']         = wp_create_nonce( 'my_action' );

		try {
			$admin->verify_request( 'my_action' );
		} catch ( WPDieException $e ) {
			$this->assertEquals( 'You are not allowed to perform this action.', $e->getMessage() );
			throw $e;
		}
	}

	/**
	 * Tests verifying a request with a valid nonce and the required capabilities.
	 *
	 * @covers Yoast_Network_Admin::verify_request()
	 */
	public function test_verify_request_with_valid_nonce_and_caps() {
		$admin = new Yoast_Network_Admin();

		wp_set_current_user( self::$network_administrator );
		wp_get_current_user()->add_cap( 'wpseo_manage_network_options' );

		$_REQUEST['_wp_http_referer'] = admin_url();
		$_REQUEST['_wpnonce']         = wp_create_nonce( 'my_action' );

		$e = null;
		try {
			$admin->verify_request( 'my_action' );
		} catch ( WPDieException $e ) {
		}

		$this->assertNull( $e );
	}

	/**
	 * Tests verifying an AJAX request with an invalid nonce.
	 *
	 * @covers Yoast_Network_Admin::verify_request()
	 * @expectedException WPDieException
	 */
	public function test_verify_request_ajax_with_invalid_nonce() {
		$admin = new Yoast_Network_Admin();

		add_filter( 'wp_doing_ajax', '__return_true' );
		add_filter( 'wp_die_ajax_handler', array( $this, 'get_wp_die_handler' ) );

		$_REQUEST['_wpnonce'] = '';

		try {
			$admin->verify_request( 'my_action' );
		} catch ( WPDieException $e ) {
			$this->assertEquals( -1, $e->getMessage() );
			throw $e;
		}
	}

	/**
	 * Tests verifying an AJAX request with a valid nonce, but lacking capabilities.
	 *
	 * @covers Yoast_Network_Admin::verify_request()
	 * @expectedException WPDieException
	 */
	public function test_verify_request_ajax_with_valid_nonce_but_lacking_caps() {
		$admin = new Yoast_Network_Admin();

		add_filter( 'wp_doing_ajax', '__return_true' );
		add_filter( 'wp_die_ajax_handler', array( $this, 'get_wp_die_handler' ) );

		$_REQUEST['_wpnonce'] = wp_create_nonce( 'my_action' );

		$admin->verify_request( 'my_action' );
	}

	/**
	 * Tests verifying an AJAX request with a valid nonce and the required capabilities.
	 *
	 * @covers Yoast_Network_Admin::verify_request()
	 */
	public function test_verify_request_ajax_with_valid_nonce_and_caps() {
		$admin = new Yoast_Network_Admin();

		add_filter( 'wp_doing_ajax', '__return_true' );
		add_filter( 'wp_die_ajax_handler', array( $this, 'get_wp_die_handler' ) );

		wp_set_current_user( self::$network_administrator );
		wp_get_current_user()->add_cap( 'wpseo_manage_network_options' );

		$_REQUEST['_wpnonce'] = wp_create_nonce( 'my_action' );

		$e = null;
		try {
			$admin->verify_request( 'my_action' );
		} catch ( WPDieException $e ) {
		}

		$this->assertNull( $e );
	}

	/**
	 * Tests terminating a request.
	 *
	 * @covers Yoast_Network_Admin::terminate_request()
	 */
	public function test_terminate_request() {
		$admin = $this
			->getMockBuilder( 'Yoast_Network_Admin' )
			->setMethods( array( 'persist_settings_errors', 'redirect_back' ) )
			->getMock();

		$admin
			->expects( $this->once() )
			->method( 'persist_settings_errors' );

		$admin
			->expects( $this->once() )
			->method( 'redirect_back' )
			->with( array( 'settings-updated' => 'true' ) );

		$admin->terminate_request();
	}

	/**
	 * Tests terminating an AJAX request.
	 *
	 * @covers Yoast_Network_Admin::terminate_request()
	 * @expectedException WPDieException
	 */
	public function test_terminate_request_ajax() {
		$admin = new Yoast_Network_Admin();

		add_filter( 'wp_doing_ajax', '__return_true' );
		add_filter( 'wp_die_ajax_handler', array( $this, 'get_wp_die_handler' ) );

		$_REQUEST['_wpnonce'] = wp_create_nonce( 'my_action' );

		ob_start();

		try {
			$admin->terminate_request();
		} catch ( WPDieException $e ) {
			$this->assertArrayHasKey( 'success', json_decode( ob_get_clean(), true ) );
			throw $e;
		}

		$this->assertArrayHasKey( 'success', json_decode( ob_get_clean(), true ) );
	}
}
