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
	public function determine_subscription_with_earliest_expiry_date() {
		return parent::determine_subscription_with_earliest_expiry_date();
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

	/**
	 * Gets the URL for the expiration notification message.
	 *
	 * For implementation details see https://github.com/Yoast/wordpress-seo/pull/11170#issuecomment-477026724.
	 *
	 * @return string Escaped URL string.
	 */
	public function get_url() {
		return parent::get_url();
	}
}
