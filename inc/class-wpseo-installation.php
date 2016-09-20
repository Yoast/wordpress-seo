<?php

/**
 * This class checks if the wpseo option doesn't exists. In the case it doesn't it will set a property that is
 * accessible via a method to check if the installation is fresh.
 */
class WPSEO_Installation {

	/** @var bool */
	private static $is_first_install = false;

	/**
	 * Checks if Yoast SEO is installed for the first time.
	 */
	public function __construct() {
		self::$is_first_install = $this->is_first_install();
	}

	/**
	 * Returns the value of $is_first_install.
	 *
	 * @return bool
	 */
	public static function get_first_install(  ) {
		return self::$is_first_install;
	}

	/**
	 * When the option doesn't exists, it should be a new install.
	 *
	 * @return bool
	 */
	private function is_first_install() {
		// When the site is not multisite and the options does not exists.
		$is_multisite = is_multisite();
		if ( ! $is_multisite || ( $is_multisite && ms_is_switched() ) ) {
			return ( get_option( 'wpseo' ) === false );
		}

		return false;
	}

}
