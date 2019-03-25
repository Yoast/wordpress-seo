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
}
