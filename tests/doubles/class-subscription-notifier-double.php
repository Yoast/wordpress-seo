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
	 * Returns the XSL URL
	 *
	 * @return string
	 */
	public function get_first_expiring_subscription() {
		return parent::get_first_expiring_subscription();
	}
}
