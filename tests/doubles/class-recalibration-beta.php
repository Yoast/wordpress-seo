<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Recalibration_Beta_Double extends WPSEO_Recalibration_Beta {

	/**
	 * @inheritdoc
	 */
	public function subscribe_newsletter() {
		parent::subscribe_newsletter();
	}

	/**
	 * @inheritdoc
	 */
	public function get_option_value( $is_enabled ) {
		return parent::get_option_value( $is_enabled );
	}
}
