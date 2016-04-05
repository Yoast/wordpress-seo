<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Presenter for the quick edit
 */
class WPSEO_Redirect_Quick_Edit_Presenter {

	/**
	 * Displays the table
	 *
	 * @param array $display Data to display on the table.
	 */
	public function display( array $display = array() ) {

		// @codingStandardsIgnoreStart
		extract( $display );
		// @codingStandardsIgnoreEnd

		require( WPSEO_PATH . 'premium/classes/redirect/views/redirects-quick-edit.php' );
	}
}
