<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Post_Type_Archive_Notification_Handler_Double extends WPSEO_Post_Type_Archive_Notification_Handler {

	/**
	 * @inheritdoc
	 */
	public function is_applicable() {
		return parent::is_applicable();
	}
}
