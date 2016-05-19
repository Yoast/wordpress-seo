<?php
/**
 * @package Yoast\Tests\Notifications
 */

/**
 * Class Test_Yoast_Notification
 */
class Test_Yoast_Notification extends WPSEO_UnitTestCase {

	/** @var array Test capability filters get set */
	private $verify_capability_filter_args = array();

	/** @var array Test filter capability match */
	private $verify_capability_match_filter_args = array();

	/**
	 * No ID is not persistent.
	 */
	public function test_not_persistent() {
		$subject = new Yoast_Notification( 'message', array() );
		$this->assertFalse( $subject->is_persistent() );
	}

	/**
	 * Test defaults.
	 */
	public function test_set_defaults() {
		$subject = new Yoast_Notification( 'message', array() );
		$test    = $subject->to_array();

		$this->assertEquals(
			array(
				'type'             => 'updated',
				'id'               => '',
				'nonce'            => null,
				'priority'         => 0.5,
				'data_json'        => array(),
				'dismissal_key'    => null,
				'capabilities'     => array(),
				'capability_check' => 'all',
			),
			$test['options']
		);
	}

	/**
	 * Verify invalid options
	 */
	public function test_verify_priority_boundary() {
		$options = array(
			'priority' => 2,
		);

		$subject = new Yoast_Notification( 'message', $options );

		$this->assertEquals( 1, $subject->get_priority() );
	}

	/**
	 * Test nonce when set
	 */
	public function test_nonce() {
		$subject = new Yoast_Notification( 'message', array( 'nonce' => 'nonce' ) );
		$this->assertEquals( 'nonce', $subject->get_nonce() );
	}

	/**
	 * Test nonce when not set as option
	 */
	public function test_nonce_not_set() {
		$subject = new Yoast_Notification( 'message', array( 'id' => 'id' ) );
		$nonce   = $subject->get_nonce();
		$this->assertTrue( wp_verify_nonce( $nonce, 'id' ) !== false );
	}

	/**
	 * Test type is set to default and retrievable
	 */
	public function test_type() {
		$subject = new Yoast_Notification( 'message', array() );
		$test    = $subject->to_array();

		$this->assertEquals( $test['options']['type'], $subject->get_type() );
	}

	/**
	 * Test type custom value
	 */
	public function test_type_custom() {
		$subject = new Yoast_Notification( 'message', array( 'type' => 'bla' ) );
		$this->assertEquals( 'bla', $subject->get_type() );
	}

	/**
	 * Test retrieval of dismissal key
	 */
	public function test_get_dismissal_key() {
		$subject = new Yoast_Notification( 'message', array( 'dismissal_key' => 'dis' ) );
		$this->assertEquals( 'dis', $subject->get_dismissal_key() );
	}

	/**
	 * Test retrieval of dismissal key when not set
	 */
	public function test_get_dismissal_key_not_set() {
		$subject = new Yoast_Notification( 'message', array( 'id' => 'id' ) );
		$this->assertEquals( 'id', $subject->get_dismissal_key() );
	}

	/**
	 * Non-persistent Notifications should always be displayed.
	 */
	public function test_not_persistent_always_show() {
		$subject = new Yoast_Notification( 'message', array() );
		$this->assertFalse( $subject->is_persistent() );
		$this->assertTrue( $subject->display_for_current_user() );

		$subject = new Yoast_Notification( 'message', array( 'capabilities' => array( 'foooooooo' ) ) );
		$this->assertFalse( $subject->is_persistent() );
		$this->assertTrue( $subject->display_for_current_user() );
	}

	/**
	 * Test any without matches.
	 */
	public function test_match_any_pass() {

		$this->add_cap( 'bla' );
		$this->remove_cap( 'foo' );

		$subject = new Yoast_Notification(
			'message',
			array(
				'id'               => 'id',
				'capabilities'     => array(
					'bla',
					'foo',
				),
				'capability_check' => 'any',
			)
		);

		$this->assertTrue( $subject->display_for_current_user() );

		$this->remove_cap( 'bla' );
	}

	/**
	 * Test any without matches.
	 */
	public function test_match_any_fail() {

		$this->remove_cap( 'bla' );
		$this->remove_cap( 'foo' );

		$subject = new Yoast_Notification(
			'message',
			array(
				'id'               => 'id',
				'capabilities'     => array(
					'bla',
					'foo',
				),
				'capability_check' => 'any',
			)
		);

		$this->assertFalse( $subject->display_for_current_user() );
	}

	/**
	 * Test any without matches.
	 */
	public function test_match_all_pass() {

		$this->add_cap( 'bla' );
		$this->add_cap( 'foo' );

		$subject = new Yoast_Notification(
			'message',
			array(
				'id'               => 'id',
				'capabilities'     => array(
					'bla',
					'foo',
				),
				'capability_check' => 'all',
			)
		);

		$this->assertTrue( $subject->display_for_current_user() );

		$this->remove_cap( 'bla' );
		$this->remove_cap( 'foo' );
	}

	/**
	 * Test any without matches.
	 */
	public function test_match_all_fail() {

		$subject = new Yoast_Notification(
			'message',
			array(
				'id'               => 'id',
				'capabilities'     => array(
					'bla',
					'foo',
				),
				'capability_check' => 'all',
			)
		);

		$this->add_cap( 'bla' );

		$this->assertFalse( $subject->display_for_current_user() );
	}

	/**
	 * Test capability if we recieve the expected arguments.
	 */
	public function test_filter_capability_arguments() {

		$capabilities = array( 'caps' );
		$id           = 'my_id';

		$notification = new Yoast_Notification( 'message', array( 'id' => $id, 'capabilities' => $capabilities ) );

		$this->verify_capability_filter_args = array(
			$capabilities,
			$notification,
		);

		apply_filters(
			'wpseo_notification_capabilities',
			array( $this, 'verify_wpseo_notification_capabilities_filter' ),
			10,
			2
		);

		unset( $this->verify_capability_filter_args );
	}

	/**
	 * Verify capability filter arguments
	 *
	 * @param array              $capabilities Capabilities.
	 * @param Yoast_Notification $notification Notification.
	 *
	 * @return mixed
	 */
	public function verify_wpseo_notification_capabilities_filter( $capabilities, $notification ) {
		$test = array( $capabilities, $notification );
		$this->assertEquals( $this->verify_capability_filter_args, $test );

		return $capabilities;
	}

	/**
	 * Test capability_check if we recieve the expected arguments.
	 */
	public function test_filter_capability_check_arguments() {

		$capabilities = array( 'caps' );
		$id           = 'my_id';

		$notification = new Yoast_Notification( 'message', array( 'id' => $id, 'capabilities' => $capabilities ) );

		$this->verify_capability_match_filter_args = array(
			Yoast_Notification::MATCH_ALL,
			$notification,
		);

		apply_filters(
			'wpseo_notification_capability_check',
			array( $this, 'verify_wpseo_notification_capability_check_filter' ),
			10,
			2
		);

		unset( $this->verify_capability_match_filter_args );
	}

	/**
	 * Verify capability_check filter arguments.
	 *
	 * @param string             $check        Type of the check.
	 * @param Yoast_Notification $notification Notification.
	 *
	 * @return mixed
	 */
	public function verify_wpseo_notification_capability_check_filter( $check, $notification ) {
		$test = array( $check, $notification );
		$this->assertEquals( $this->verify_capability_match_filter_args, $test );

		return $check;
	}

	/**
	 * Invalid filter return value
	 */
	public function test_invalid_filter_return_values() {
		$subject = new Yoast_Notification( 'message', array( 'id' => 'id', 'capabilities' => 'not_an_array' ) );
		$this->assertTrue( $subject->display_for_current_user() );
	}

	/**
	 * Test notification filter
	 *
	 * @param array $current_capabilities Input.
	 *
	 * @return array
	 */
	public function add_wpseo_notification_capabilities( $current_capabilities = array() ) {
		return array( 'jip', 'janneke' );
	}

	/**
	 * Any
	 *
	 * @param array $current_capabilities Input.
	 *
	 * @return string
	 */
	public function add_wpseo_notification_capability_check( $current_capabilities = array() ) {
		return 'any';
	}

	/**
	 * Wrapper for WP_User::add_cap()
	 *
	 * @param string $capability Capability to add.
	 */
	private function add_cap( $capability ) {
		// Capabilities have been changed in 4.2: code doesn't fail, just the test.
		if ( version_compare( $GLOBALS['wp_version'], '4.2', '<' ) ) {
			$this->markTestSkipped();
		}

		$me = wp_get_current_user();
		if ( ! empty( $me ) ) {
			$me->add_cap( $capability );
		}
	}

	/**
	 * Wrapper for WP_User::remove_cap()
	 *
	 * @param string $capability Capability to remove.
	 */
	private function remove_cap( $capability ) {
		// Capabilities have been changed in 4.2: code doesn't fail, just the test.
		if ( version_compare( $GLOBALS['wp_version'], '4.2', '<' ) ) {
			$this->markTestSkipped();
		}

		$me = wp_get_current_user();
		if ( ! empty( $me ) ) {
			$me->remove_cap( $capability );
		}
	}
}
