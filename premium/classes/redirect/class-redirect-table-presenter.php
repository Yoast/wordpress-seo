<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Table_Presenter
 */
class WPSEO_Redirect_Table_Presenter extends WPSEO_Redirect_Tab_Presenter {

	/**
	 * Adding the redirect table to the view vars
	 *
	 * @param WPSEO_Redirect_Manager $redirect_manager The redirect manager.
	 */
	public function set_table( WPSEO_Redirect_Manager $redirect_manager ) {
		$this->view_vars['redirect_table'] = new WPSEO_Redirect_Table( $this->view, $this->get_first_column_value(), $redirect_manager );
	}

	/**
	 * Getting the variables for the view
	 *
	 * @return array
	 */
	protected function get_view_vars() {
		return array_merge(
			$this->view_vars,
			array(
				'redirect_types' => $this->get_redirect_types(),
				'old_url'        => $this->get_old_url(),
			)
		);
	}

	/**
	 * Get the old url from the URL
	 *
	 * @return string
	 */
	private function get_old_url() {
		// Check if there's an old URL set.
		$old_url = filter_input( INPUT_GET, 'old_url', FILTER_DEFAULT, array( 'default' => '' ) );
		if ( $old_url !== '' ) {
			return esc_attr( rawurldecode( $old_url ) );
		}

		return $old_url;
	}

	/**
	 * Getting array with the available redirect types
	 *
	 * @return array|void
	 */
	private function get_redirect_types() {
		$redirect_types = array(
			'301' => __( '301 Moved Permanently', 'wordpress-seo-premium' ),
			'302' => __( '302 Found', 'wordpress-seo-premium' ),
			'307' => __( '307 Temporary Redirect', 'wordpress-seo-premium' ),
			'410' => __( '410 Content Deleted', 'wordpress-seo-premium' ),
		);

		return apply_filters( 'wpseo_premium_redirect_types', $redirect_types );
	}

	/**
	 * Return the value of the first column based on the table type
	 *
	 * @return string|void
	 */
	private function get_first_column_value() {
		if ( $this->view === 'regex' ) {
			return  __( 'Regular Expression', 'wordpress-seo-premium' );
		}

		return __( 'Old URL', 'wordpress-seo-premium' );
	}

}
