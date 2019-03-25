<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 *
 * @group test
 */
class WPSEO_Subscription_Notifier_Test extends WPSEO_UnitTestCase {
	/**
	 * Tests if the correct subscription is return when calling get_first_expiring_subscription.
	 *
	 * @returns void
	 *
	 * @covers WPSEO_Subscription_Notifier::get_first_expiring_subscription
	 */
	public function test_get_first_expiring_subscription() {
		$addon_manager = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions_for_active_addons' ) )
			->getMock();

		$addon_manager
			->expects( $this->once() )
			->method( 'get_subscriptions_for_active_addons' )
			->will( $this->returnValue( array(
				(object) array(
					'product' => (object) array()
				),
				(object) array(
					'expiry_date' => '2001-01-01T00:00:00.000Z',
					'product' => (object) array(
						'name'        => 'Addon 1',
					),
				),
				(object) array(
					'expiry_date' => '2000-01-01T00:00:00.000Z',
					'product' => (object) array(
						'name'        => 'Addon 2',
					),
				),
				(object) array(
					'expiry_date' => '2002-01-01T00:00:00.000Z',
					'product' => (object) array(
						'name'        => 'Addon 3',
					),
				),
			) ) );

		$instance = $this
			->getMockBuilder( 'WPSEO_Subscription_Notifier_Double' )
			->setMethods( array( 'get_addon_manager' ) )
			->disableOriginalConstructor()
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_addon_manager' )
			->willReturn( $addon_manager );

		$instance->__construct();

		$expected = (object) array(
			'expiry_date' => '2000-01-01T00:00:00.000Z',
			'product' => (object) array(
				'name'        => 'Addon 2',
			),
		);

		$this->assertEquals(
			$expected,
			$instance->get_first_expiring_subscription()
		);
	}

	/**
	 * Tests the get_days_until_expiration function with a subscription that has expired in the last 24 hours.
	 *
	 * @returns void
	 *
	 * @covers WPSEO_Subscription_Notifier::get_days_until_expiration
	 */
	public function test_get_days_until_expiration_subscription_expired() {
		$instance = new WPSEO_Subscription_Notifier_Double();

		$expected = 0;

		$date_12_hours_ago = gmdate(DATE_ATOM, time() - ( 12 * HOUR_IN_SECONDS ) );
		$subscription = (object) array(
			'expiry_date' => $date_12_hours_ago,
		);

		$this->assertEquals(
			$expected,
			$instance->get_days_until_expiration( $subscription )
		);
	}

	/**
	 * Tests the get_days_until_expiration function with a subscription that will expire in the next 24 hours.
	 *
	 * @returns void
	 *
	 * @covers WPSEO_Subscription_Notifier::get_days_until_expiration
	 */
	public function test_get_days_until_expiration_subscription_active() {
		$instance = new WPSEO_Subscription_Notifier_Double();

		$expected = 1;

		$date_12_hours_from_now = gmdate(DATE_ATOM, time() + ( 12 * HOUR_IN_SECONDS ) );
		$subscription = (object) array(
			'expiry_date' => $date_12_hours_from_now,
		);

		$this->assertEquals(
			$expected,
			$instance->get_days_until_expiration( $subscription )
		);
	}

	/**
	 * Tests the get_days_until_expiration function with a subscription that will expire on the 7th day from now.
	 *
	 * @returns void
	 *
	 * @covers WPSEO_Subscription_Notifier::get_days_until_expiration
	 */
	public function test_get_days_until_expiration_subscription_active_1_week() {
		$instance = new WPSEO_Subscription_Notifier_Double();

		$expected = 7;

		$date_6_days_and_12_hours_from_now = gmdate(DATE_ATOM, time() + ( 6 * DAY_IN_SECONDS ) + ( 12 * HOUR_IN_SECONDS ) );
		$subscription = (object) array(
			'expiry_date' => $date_6_days_and_12_hours_from_now,
		);

		$this->assertEquals(
			$expected,
			$instance->get_days_until_expiration( $subscription )
		);
	}
}
