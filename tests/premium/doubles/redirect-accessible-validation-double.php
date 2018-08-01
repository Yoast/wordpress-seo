<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Class WPSEO_Redirect_Accessible_Validation_Double
 *
 * Create double class so we can test against the parse_target function.
 */
class WPSEO_Redirect_Accessible_Validation_Double extends WPSEO_Redirect_Accessible_Validation {

	/**
	 * Check if the target is relative, if so just parse a full URL.
	 *
	 * @param string $target The target to pars.
	 *
	 * @return string
	 */
	public function return_parse_target( $target ) {
		return $this->parse_target( $target );
	}
}
