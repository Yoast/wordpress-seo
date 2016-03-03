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

		$this->assertFalse( $subject->display_for_current_user() );
	}

	/**
	 * Test capability filter
	 */
	public function test_wpseo_notification_capabilities() {
		$filter_function = array( $this, 'add_wpseo_notification_capabilities' );

		$me = wp_get_current_user();

		$capabilities = $this->add_wpseo_notification_capabilities();
		foreach ( $capabilities as $capability ) {
			$me->add_cap( $capability );
		}

		$me->remove_cap( 'manage_options' );

		$subject = new Yoast_Notification( 'message', array( 'id' => 'id', 'capabilities' => 'manage_options' ) );

		$this->assertFalse( $subject->display_for_current_user() );

		add_filter( 'wpseo_notification_capabilities', $filter_function );
		$this->assertTrue( $subject->display_for_current_user() );
		remove_filter( 'wpseo_notification_capabilities', $filter_function );
	}

	/**
	 * Test capability filter
	 */
	public function test_wpseo_notification_capability_match() {
		$filter_function = array( $this, 'add_wpseo_notification_capabilities' );
		$match_function  = array( $this, 'add_wpseo_notification_capability_check' );

		// Only add 1 of the provided capabilities. We need 'any' to match this.
		$capabilities = $this->add_wpseo_notification_capabilities();

		$me = wp_get_current_user();
		$me->add_cap( $capabilities[0] );
		$me->remove_cap( $capabilities[1] );

		$me->remove_cap( 'manage_options' );

		$subject = new Yoast_Notification( 'message', array( 'id' => 'id', 'capabilities' => array( 'manage_options' ) ) );

		$this->assertFalse( $subject->display_for_current_user() );

		add_filter( 'wpseo_notification_capability_check', $match_function );
		add_filter( 'wpseo_notification_capabilities', $filter_function );
		$this->assertTrue( $subject->display_for_current_user() );
		remove_filter( 'wpseo_notification_capabilities', $filter_function );
		remove_filter( 'wpseo_notification_capability_check', $match_function );
	}

	/**
	 * Invalid filter return value
	 */
	public function test_invalid_filter_return_values() {
		$match_function = array( $this, 'empty_output' );

		$subject = new Yoast_Notification( 'message', array( 'id' => 'id', 'capabilities' => array( 'xijwe' ) ) );

		add_filter( 'wpseo_notification_capability_check', $match_function );
		add_filter( 'wpseo_notification_capabilities', $match_function );
		$this->assertTrue( $subject->display_for_current_user() );
		remove_filter( 'wpseo_notification_capabilities', $match_function );
		remove_filter( 'wpseo_notification_capability_check', $match_function );
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

	/**
	 * Return invalid output
	 *
	 * @param null $input Input.
	 *
	 * @return string
	 */
	public function empty_output( $input = null ) {
		return '';
	}
}
