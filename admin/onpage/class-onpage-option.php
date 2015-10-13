<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class handles the data for the option where the OnPage.org data is stored.
 */
class WPSEO_OnPage_Option {

	/**
	 * @var array The OnPage.org option stored in the database.
	 */
	private $onpage_option;

	/**
	 * Setting the object by setting the properties
	 */
	public function __construct() {
		$this->onpage_option = $this->get_option();
	}

	/**
	 * Getting a value from the OnPage.org option
	 *
	 * @param string $option_key The needed key from the option.
	 * @param string $default    The default value, when the key doesn't exist.
	 *
	 * @return string
	 */
	public function get( $option_key, $default = '' ) {
		if ( array_key_exists( $option_key, $this->onpage_option ) ) {
			return $this->onpage_option[ $option_key ];
		}

		return $default;
	}

	/**
	 * Setting a value to the OnPage.org option
	 *
	 * @param string $option_key   The key which will be stored.
	 * @param string $option_value The value that has to be stored.
	 */
	public function set( $option_key, $option_value ) {
		$this->onpage_option[ $option_key ] = $option_value;

		$this->save_option();
	}

	/**
	 * Check if the last fetch is within the time of 60 minutes
	 *
	 * @return bool
	 */
	public function can_fetch() {
		return ( ( time() - $this->onpage_option['last_fetch'] ) > HOUR_IN_SECONDS );
	}

	/**
	 * Returns the indexable status of the website.
	 *
	 * @return bool
	 */
	public function is_indexable() {
		return ! empty( $this->onpage_option['status'] );
	}

	/**
	 * Getting the option with the OnPage.org data
	 *
	 * @return array
	 */
	private function get_option() {
		return get_site_option( 'wpseo_onpage', array( 'status' => null, 'last_fetch' => 0 ) );
	}

	/**
	 * Saving the option with the current data
	 */
	public function save_option() {
		update_site_option( 'wpseo_onpage', $this->onpage_option );
	}

}
