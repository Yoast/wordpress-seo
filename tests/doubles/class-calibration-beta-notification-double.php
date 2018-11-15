<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Recalibration_Beta_Notification_Double extends WPSEO_Recalibration_Beta_Notification {

	/**
	 * @inheritdoc
	 */
	public function is_applicable() {
		return parent::is_applicable();
	}
}
