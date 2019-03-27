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
	 * Gets the first add-on that will expire from the add-on manager.
	 *
	 * @return stdClass|null Object representing a subscription.
	 */
	public function determine_subscription_with_latest_expiry_date() {
		return parent::determine_subscription_with_latest_expiry_date();
	}

	/**
	 * Calculates the number of days until a subscription expires. 0 or below means the subscription has expired.
	 *
	 * @param stdClass $subscription Subscription to get the subscription expiration time for.
	 *
	 * @return int Number of days until expiration.
	 */
	public function calculate_days_until_expiration( $subscription ) {
		return parent::calculate_days_until_expiration( $subscription );
	}
}
