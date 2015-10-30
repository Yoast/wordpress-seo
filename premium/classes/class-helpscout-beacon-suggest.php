<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Getting suggest for a current opened page.
 */
class WPSEO_HelpScout_Beacon_Suggest {

	/**
	 * Getting an array with suggested HelpScout IDs for the current.
	 *
	 * This method will look for a method prefixed with get_ and suffixed with the currently openened page. If the method
	 * does not exist, it won't return an array.
	 *
	 * @param string $current_page The currently opened page, without the prefix.
	 *
	 * @return array
	 */
	public function get_suggest( $current_page ) {
		$method = 'get_'.$current_page;

		if ( method_exists( $this, $method ) ) {
			return $this->$method();
		}

		return array();
	}

	/**
	 * The config tor the xml pages
	 *
	 * @return array
	 */
	public function get_xml() {
		return array(
			'5375e852e4b03c6512282d5a',
			'5375e110e4b0d833740d5700',
		);
	}

}
