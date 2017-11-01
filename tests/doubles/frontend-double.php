<?php

class WPSEO_Frontend_Double extends WPSEO_Frontend {
	/**
	 * Get the singleton instance of this class
	 *
	 * This needs to be overrwritten to make sure it returns the Double version of this class.
	 *
	 * @return WPSEO_Frontend_Double
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * @inheritdoc
	 */
	public function redirect( $location, $status = 302 ) {
		// Intentionally left empty to remove actual redirection code to be able to test it.
	}
}
