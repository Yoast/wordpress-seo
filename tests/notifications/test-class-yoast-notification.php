<?php
/**
 * @package Yoast\Tests\Notifications
 */

/**
 * Class Test_Yoast_Notification
 */
class Test_Yoast_Notification extends WPSEO_UnitTestCase {
	/**
	 * Tests:
	 *  - Set options
	 *  - Verify options
	 *  - Apply filter 'wpseo_notification_capabilities'
	 *  - Apply filter 'wpseo_notification_capability_check'
	 *  - Match capabilities
	 *  display_for_current_user
	 *  is_persistent
	 *  get_dismissal_key
	 *  get_priority
	 */

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
				'wpseo_page_only'  => false,
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

		$me = wp_get_current_user();
		$me->add_cap( 'bla' );
		$me->remove_cap( 'foo' );

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

		$me->remove_cap( 'bla' );
	}

	/**
	 * Test any without matches.
	 */
	public function test_match_any_fail() {

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

		$me = wp_get_current_user();
		$me->add_cap( 'bla' );
		$me->add_cap( 'foo' );

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

		$me->remove_cap( 'bla' );
		$me->remove_cap( 'foo' );
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

		$me = wp_get_current_user();
		$me->add_cap( 'bla' );

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
			$id,
			$notification,
		);

		apply_filters(
			'wpseo_notification_capabilities',
			array( $this, 'verify_wpseo_notification_capabilities_filter' ),
			10,
			3
		);

		unset( $this->verify_capability_filter_args );
	}

	/**
	 * Verify capability filter arguments
	 *
	 * @param array              $capabilities Capabilities.
	 * @param string             $id           ID of the Notification.
	 * @param Yoast_Notification $notification Notification.
	 *
	 * @return mixed
	 */
	public function verify_wpseo_notification_capabilities_filter( $capabilities, $id, $notification ) {
		$test = array( $capabilities, $id, $notification );
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
			$id,
			$notification,
		);

		apply_filters(
			'wpseo_notification_capability_check',
			array( $this, 'verify_wpseo_notification_capability_check_filter' ),
			10,
			3
		);

		unset( $this->verify_capability_match_filter_args );
	}

	/**
	 * Verify capability_check filter arguments.
	 *
	 * @param string             $check        Type of the check.
	 * @param string             $id           ID of the notification.
	 * @param Yoast_Notification $notification Notification.
	 *
	 * @return mixed
	 */
	public function verify_wpseo_notification_capability_check_filter( $check, $id, $notification ) {
		$test = array( $check, $id, $notification );
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
	 * @param array $input Input.
	 *
	 * @return array
	 */
	public function add_wpseo_notification_capabilities( $input = array() ) {
		return array( 'jip', 'janneke' );
	}

	/**
	 * Any
	 *
	 * @param array $input Input.
	 *
	 * @return string
	 */
	public function add_wpseo_notification_capability_check( $input = array() ) {
		return 'any';
	}
}
