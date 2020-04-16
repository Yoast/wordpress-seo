<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 *
 * @deprecated xx.x
 */
class WPSEO_Post_Type_Archive_Notification_Handler_Double extends WPSEO_Post_Type_Archive_Notification_Handler {

	/**
	 * Checks if the notice should be shown.
	 *
	 * @deprecated xx.x
	 *
	 * @return bool True when applicable.
	 */
	public function is_applicable() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return parent::is_applicable();
	}
}
