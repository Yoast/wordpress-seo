<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Subscription_Notifier_Double extends WPSEO_Subscription_Notifier {

	/**
	 * Gets the first add-on that will expire from teh add-on manager.
	 *
	 * @returns stdClass Object representing a subscription.
	 */
	public function get_first_expiring_subscription() {
		return parent::get_first_expiring_subscription();
	}

	/**
	 * Get the number of days until a subscription expires. 0 means the subscription has expired.
	 *
	 * @param stdClass $subscription Subscription to get the subscription expiration time for.
	 *
	 * @return int Number of days until expiration.
	 */
	public function get_days_until_expiration( $subscription ) {
		return parent::get_days_until_expiration( $subscription );
	}
}
