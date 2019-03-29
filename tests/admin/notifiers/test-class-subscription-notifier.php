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
	 * @param $subscriptions
	 *
	 * @return WPSEO_Subscription_Notifier_Double Subscription notifier instance.
	 */
	private function initialize_with_subscriptions( $subscriptions ) {
		$addon_manager = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions_for_active_addons' ) )
			->getMock();

		$addon_manager
			->expects( $this->any() )
			->method( 'get_subscriptions_for_active_addons' )
			->will( $this->returnValue( $subscriptions ) );

		$instance = $this
			->getMockBuilder( 'WPSEO_Subscription_Notifier_Double' )
			->setMethods( array( 'get_addon_manager' ) )
			->disableOriginalConstructor()
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_addon_manager' )
			->will(
				$this->returnValue( $addon_manager )
			);

		$instance->__construct();

		$instance->init();

		return $instance;
	}

	private function get_offset_date( $offset ) {
		return gmdate( DATE_ATOM, time() + $offset );
	}

	/**
	 * Tests if the correct subscription is return when calling get_first_expiring_subscription.
	 *
	 * @covers WPSEO_Subscription_Notifier::determine_subscription_with_earliest_expiry_date
	 */
	public function test_get_first_expiring_subscription() {
		$subscriptions = array(
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
		);

		$instance = $this->initialize_with_subscriptions( $subscriptions );

		$expected = (object) array(
			'expiry_date' => '2000-01-01T00:00:00.000Z',
			'product' => (object) array(
				'name'        => 'Addon 2',
			),
		);

		$this->assertEquals(
			$expected,
			$instance->determine_subscription_with_earliest_expiry_date()
		);
	}

	/**
	 * Tests if the correct subscription is return when calling get_first_expiring_subscription.
	 *
	 * @covers WPSEO_Subscription_Notifier::determine_subscription_with_earliest_expiry_date
	 */
	public function test_get_first_expiring_subscription_one_subscription() {
		$subscriptions = array(
			(object) array(
				'expiry_date' => '2000-01-01T00:00:00.000Z',
				'product' => (object) array(
					'name'        => 'Addon 2',
				),
			),
		);

		$instance = $this->initialize_with_subscriptions( $subscriptions );

		$expected = (object) array(
			'expiry_date' => '2000-01-01T00:00:00.000Z',
			'product' => (object) array(
				'name'        => 'Addon 2',
			),
		);

		$this->assertEquals(
			$expected,
			$instance->determine_subscription_with_earliest_expiry_date()
		);
	}

	/**
	 * Tests the calculate_days_until_expiration function with a subscription that has expired in the last 24 hours.
	 *
	 * @covers WPSEO_Subscription_Notifier::calculate_days_until_expiration
	 */
	public function test_get_days_until_expiration_subscription_expired() {
		$instance = new WPSEO_Subscription_Notifier_Double();

		$expected = 0;

		$date_12_hours_ago = gmdate( DATE_ATOM, time() - ( 12 * HOUR_IN_SECONDS ) );
		$subscription = (object) array(
			'expiry_date' => $date_12_hours_ago,
		);

		$this->assertEquals(
			$expected,
			$instance->calculate_days_until_expiration( $subscription )
		);
	}

	/**
	 * Tests the calculate_days_until_expiration function with a subscription that will expire in the next 24 hours.
	 *
	 * @covers WPSEO_Subscription_Notifier::calculate_days_until_expiration
	 */
	public function test_get_days_until_expiration_subscription_active() {
		$instance = new WPSEO_Subscription_Notifier_Double();

		$expected = 1;

		$date_12_hours_from_now = gmdate( DATE_ATOM, time() + ( 12 * HOUR_IN_SECONDS ) );
		$subscription = (object) array(
			'expiry_date' => $date_12_hours_from_now,
		);

		$this->assertEquals(
			$expected,
			$instance->calculate_days_until_expiration( $subscription )
		);
	}

	/**
	 * Tests the calculate_days_until_expiration function with a subscription that will expire on the 7th day from now.
	 *
	 * @covers WPSEO_Subscription_Notifier::calculate_days_until_expiration
	 */
	public function test_get_days_until_expiration_subscription_active_1_week() {
		$instance = new WPSEO_Subscription_Notifier_Double();

		$expected = 7;

		$date_6_days_and_12_hours_from_now = gmdate( DATE_ATOM, time() + ( 6 * DAY_IN_SECONDS ) + ( 12 * HOUR_IN_SECONDS ) );
		$subscription = (object) array(
			'expiry_date' => $date_6_days_and_12_hours_from_now,
		);

		$this->assertEquals(
			$expected,
			$instance->calculate_days_until_expiration( $subscription )
		);
	}

	/**
	 * Test the URL that would get rendered in case of subscriptions without a renewal URL.
	 *
	 * @dataProvider provider_get_url_no_renewal_url
	 *
	 * @param stdClass $subscription Subscription to test again.
	 * @param string   $expected     Expected URL.
	 *
	 * @covers WPSEO_Subscription_Notifier::get_url
	 */
	public function test_get_url_no_renewal_url( $subscription, $expected ) {
		delete_option( WPSEO_Subscription_Notifier_Double::NOTIFICATION_ID );

		$instance = $this->initialize_with_subscriptions( array( $subscription ) );

		$this->assertEquals(
			$expected,
			$instance->get_url()
		);
	}

	/**
	 * Data provider for test_get_url_no_renewal_url().
	 *
	 * @return array Data for test.
	 */
	public function provider_get_url_no_renewal_url() {
		return array(
			array(
				'subscription' => (object) array(
					'expiry_date' => $this->get_offset_date( DAY_IN_SECONDS * 10 ),
					'product' => (object) array(
						'name' => 'Addon 1',
					),
				),
				'expected_url' => esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3me' ) ),
			),
			array(
				'subscription' => (object) array(
					'expiry_date' => $this->get_offset_date( DAY_IN_SECONDS * 3 ),
					'product' => (object) array(
						'name' => 'Addon 1',
					),
				),
				'expected_url' => esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3mf' ) ),
			),
			array(
				'subscription' => (object) array(
					'expiry_date' => $this->get_offset_date( DAY_IN_SECONDS * 1 ),
					'product' => (object) array(
						'name' => 'Addon 1',
					),
				),
				'expected_url' => esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3mg' ) ),
			),
			array(
				'subscription' => (object) array(
					'expiry_date' => $this->get_offset_date( DAY_IN_SECONDS * 0 ),
					'product' => (object) array(
						'name' => 'Addon 1',
					),
				),
				'expected_url' => esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3mh' ) ),
			),
			array(
				'subscription' => (object) array(
					'expiry_date' => $this->get_offset_date( DAY_IN_SECONDS * -1 ),
					'product' => (object) array(
						'name' => 'Addon 1',
					),
				),
				'expected_url' => esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3mi' ) ),
			),
		);
	}

	/**
	 * Test the URL that would get rendered in case of subscriptions with a renewal URL.
	 *
	 * @dataProvider provider_get_url_with_renewal_url
	 *
	 * @param stdClass $subscription Subscription to test again.
	 * @param string   $expected     Expected URL.
	 *
	 * @covers WPSEO_Subscription_Notifier::get_url
	 */
	public function test_get_url_with_renewal_url( $subscription, $expected ) {
		delete_option( WPSEO_Subscription_Notifier_Double::NOTIFICATION_ID );

		$instance = $this->initialize_with_subscriptions( array( $subscription ) );

		$this->assertEquals(
			$expected,
			$instance->get_url()
		);
	}

	/**
	 * Data provider for test_get_url_with_renewal_url().
	 *
	 * @return array Data for test.
	 */
	public function provider_get_url_with_renewal_url() {
		return array(
			array(
				'subscription' => (object) array(
					'expiry_date' => $this->get_offset_date( DAY_IN_SECONDS * 10 ),
					'renewal_url' => 'http://example.com',
					'product' => (object) array(
						'name' => 'Addon 1',
					),
				),
				'expected_url' => esc_url( WPSEO_Shortlinker::get( 'http://example.com#utm_source=yoast-seo&utm_medium=software&utm_content=renewal-notification&utm_campaign=wordpress-ad&utm_term=4-weeks-before' ) ),
			),
			array(
				'subscription' => (object) array(
					'expiry_date' => $this->get_offset_date( DAY_IN_SECONDS * 3 ),
					'renewal_url' => 'http://example.com',
					'product' => (object) array(
						'name' => 'Addon 1',
					),
				),
				'expected_url' => esc_url( WPSEO_Shortlinker::get( 'http://example.com#utm_source=yoast-seo&utm_medium=software&utm_content=renewal-notification&utm_campaign=wordpress-ad&utm_term=1-week-before' ) ),
			),
			array(
				'subscription' => (object) array(
					'expiry_date' => $this->get_offset_date( DAY_IN_SECONDS * 1 ),
					'renewal_url' => 'http://example.com',
					'product' => (object) array(
						'name' => 'Addon 1',
					),
				),
				'expected_url' => esc_url( WPSEO_Shortlinker::get( 'http://example.com#utm_source=yoast-seo&utm_medium=software&utm_content=renewal-notification&utm_campaign=wordpress-ad&utm_term=1-day-before' ) ),
			),
			array(
				'subscription' => (object) array(
					'expiry_date' => $this->get_offset_date( DAY_IN_SECONDS * 0 ),
					'renewal_url' => 'http://example.com',
					'product' => (object) array(
						'name' => 'Addon 1',
					),
				),
				'expected_url' => esc_url( WPSEO_Shortlinker::get( 'http://example.com#utm_source=yoast-seo&utm_medium=software&utm_content=renewal-notification&utm_campaign=wordpress-ad&utm_term=1-day-after' ) ),
			),
			array(
				'subscription' => (object) array(
					'expiry_date' => $this->get_offset_date( DAY_IN_SECONDS * -1 ),
					'renewal_url' => 'http://example.com',
					'product' => (object) array(
						'name' => 'Addon 1',
					),
				),
				'expected_url' => esc_url( WPSEO_Shortlinker::get( 'http://example.com#utm_source=yoast-seo&utm_medium=software&utm_content=renewal-notification&utm_campaign=wordpress-ad&utm_term=29-days-after' ) ),
			),
		);
	}
}
