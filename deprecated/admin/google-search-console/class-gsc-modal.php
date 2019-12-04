<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Represents the Google Search Console modal.
 *
 * @deprecated 12.5
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Modal {

	/**
	 * Sets the required attributes for this object.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $view      The file with the view content.
	 * @param int    $height    The height that the modal will get.
	 * @param array  $view_vars The attributes to use in the view.
	 */
	public function __construct( $view, $height, array $view_vars = [] ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Returns the height of the modal.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return int The set height.
	 */
	public function get_height() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
		return 0;
	}

	/**
	 * Loads the view of the modal.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $unique_id An unique identifier for the modal.
	 */
	public function load_view( $unique_id ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}
}
