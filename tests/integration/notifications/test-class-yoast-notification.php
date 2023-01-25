<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\Tests\Notifications
 */

/**
 * Class Yoast_Notification_Test.
 *
 * @covers Yoast_Notification
 */
class Yoast_Notification_Test extends WPSEO_UnitTestCase {

	/**
	 * Test capability filters get set.
	 *
	 * @var array
	 */
	private $verify_capability_filter_args = [];

	/**
	 * Test filter capability match.
	 *
	 * @var array
	 */
	private $verify_capability_match_filter_args = [];

	/**
	 * No ID is not persistent.
	 */
	public function test_not_persistent() {
		$subject = new Yoast_Notification( 'message', [] );
		$this->assertFalse( $subject->is_persistent() );
	}

	/**
	 * Test defaults.
	 */
	public function test_set_defaults() {
		$subject = new Yoast_Notification( 'message', [] );
		$test    = $subject->to_array();

		$this->assertEquals(
			[
				'type'             => 'updated',
				'id'               => '',
				'user'             => wp_get_current_user(),
				'nonce'            => null,
				'priority'         => 0.5,
				'data_json'        => [],
				'dismissal_key'    => null,
				'capabilities'     => [ 'wpseo_manage_options' ],
				'capability_check' => 'all',
				'yoast_branding'   => false,
			],
			$test['options']
		);
	}

	/**
	 * Verify invalid options.
	 */
	public function test_verify_priority_boundary() {
		$options = [
			'priority' => 2,
		];

		$subject = new Yoast_Notification( 'message', $options );

		$this->assertEquals( 1, $subject->get_priority() );
	}

	/**
	 * Test nonce when set.
	 */
	public function test_nonce() {
		$subject = new Yoast_Notification( 'message', [ 'nonce' => 'nonce' ] );
		$this->assertEquals( 'nonce', $subject->get_nonce() );
	}

	/**
	 * Test nonce when not set as option.
	 */
	public function test_nonce_not_set() {
		$subject = new Yoast_Notification( 'message', [ 'id' => 'id' ] );
		$nonce   = $subject->get_nonce();
		$this->assertTrue( wp_verify_nonce( $nonce, 'id' ) !== false );
	}

	/**
	 * Test type is set to default and retrievable.
	 */
	public function test_type() {
		$subject = new Yoast_Notification( 'message', [] );
		$test    = $subject->to_array();

		$this->assertEquals( $test['options']['type'], $subject->get_type() );
	}

	/**
	 * Test type custom value.
	 */
	public function test_type_custom() {
		$subject = new Yoast_Notification( 'message', [ 'type' => 'bla' ] );
		$this->assertEquals( 'bla', $subject->get_type() );
	}

	/**
	 * Test setting and retrieving JSON.
	 */
	public function test_json() {
		$data = [ 'bla' ];

		$subject = new Yoast_Notification( 'message', [ 'data_json' => $data ] );
		$this->assertEquals( $subject->get_json(), WPSEO_Utils::format_json_encode( $data ) );

		$subject = new Yoast_Notification( 'message', [ 'data_json' => '' ] );
		$this->assertEquals( $subject->get_json(), '' );
	}

	/**
	 * Test retrieval of dismissal key.
	 */
	public function test_get_dismissal_key() {
		$subject = new Yoast_Notification( 'message', [ 'dismissal_key' => 'dis' ] );
		$this->assertEquals( 'dis', $subject->get_dismissal_key() );
	}

	/**
	 * Test retrieval of dismissal key when not set.
	 */
	public function test_get_dismissal_key_not_set() {
		$subject = new Yoast_Notification( 'message', [ 'id' => 'id' ] );
		$this->assertEquals( 'id', $subject->get_dismissal_key() );
	}

	/**
	 * Non-persistent Notifications should always be displayed.
	 */
	public function test_not_persistent_always_show() {
		$subject = new Yoast_Notification( 'message', [] );
		$this->assertFalse( $subject->is_persistent() );
		$this->assertTrue( $subject->display_for_current_user() );

		$subject = new Yoast_Notification( 'message', [ 'capabilities' => [ 'foooooooo' ] ] );
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
			[
				'id'               => 'id',
				'capabilities'     => [
					'bla',
					'foo',
				],
				'capability_check' => 'any',
			]
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
			[
				'id'               => 'id',
				'capabilities'     => [
					'bla',
					'foo',
				],
				'capability_check' => 'any',
			]
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
			[
				'id'               => 'id',
				'capabilities'     => [
					'bla',
					'foo',
				],
				'capability_check' => 'all',
			]
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
			[
				'id'               => 'id',
				'capabilities'     => [
					'bla',
					'foo',
				],
				'capability_check' => 'all',
			]
		);

		$this->add_cap( 'bla' );

		$this->assertFalse( $subject->display_for_current_user() );
	}

	/**
	 * Verify capability filter arguments.
	 *
	 * @param array              $capabilities Capabilities.
	 * @param Yoast_Notification $notification Notification.
	 *
	 * @return mixed
	 */
	public function verify_wpseo_notification_capabilities_filter( $capabilities, $notification ) {
		$test = [ $capabilities, $notification ];
		$this->assertEquals( $this->verify_capability_filter_args, $test );

		return $capabilities;
	}

	/**
	 * Invalid filter return value.
	 */
	public function test_invalid_filter_return_values() {
		$subject = new Yoast_Notification(
			'message',
			[
				'id'           => 'id',
				'capabilities' => 'not_an_array',
			]
		);
		$this->assertFalse( $subject->display_for_current_user() );
	}

	/**
	 * Test notification filter.
	 *
	 * @param array $current_capabilities Input.
	 *
	 * @return array
	 */
	public function add_wpseo_notification_capabilities( $current_capabilities = [] ) {
		return [ 'jip', 'janneke' ];
	}

	/**
	 * Wrapper for WP_User::add_cap().
	 *
	 * @param string $capability Capability to add.
	 */
	private function add_cap( $capability ) {
		// Capabilities have been changed in 4.2: code doesn't fail, just the test.
		if ( version_compare( $GLOBALS['wp_version'], '4.2', '<' ) ) {
			$this->markTestSkipped( 'Test requires WP 4.2 or higher' );
		}

		$me = wp_get_current_user();
		if ( ! empty( $me ) ) {
			$me->add_cap( $capability );
		}
	}

	/**
	 * Wrapper for WP_User::remove_cap().
	 *
	 * @param string $capability Capability to remove.
	 */
	private function remove_cap( $capability ) {
		// Capabilities have been changed in 4.2: code doesn't fail, just the test.
		if ( version_compare( $GLOBALS['wp_version'], '4.2', '<' ) ) {
			$this->markTestSkipped( 'Test requires WP 4.2 or higher' );
		}

		$me = wp_get_current_user();
		if ( ! empty( $me ) ) {
			$me->remove_cap( $capability );
		}
	}
}
