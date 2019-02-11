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
	public function is_applicable( $is_beta_enabled, $was_ever_enabled ) {
		return parent::is_applicable( $is_beta_enabled, $was_ever_enabled );
	}
}
