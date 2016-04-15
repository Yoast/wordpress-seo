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
	 * @param WPSEO_Redirect[] $redirects The redirect for the table.
	 */
	public function set_table( $redirects ) {
		$this->view_vars['redirect_table'] = new WPSEO_Redirect_Table(
			$this->view,
			$this->get_first_column_value(),
			$redirects
		);
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
				'origin_from_url'  => $this->get_old_url(),
				'quick_edit_table' => new WPSEO_Redirect_Quick_Edit_Presenter(),
				'form_presenter'   => new WPSEO_Redirect_Form_Presenter(
					array(
						'origin_label_value' => $this->get_first_column_value(),
					)
				),
			)
		);
	}

	/**
	 * Get the old URL from the URL
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
