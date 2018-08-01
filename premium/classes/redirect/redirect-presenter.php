<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Presenter
 */
class WPSEO_Redirect_Presenter {

	/**
	 * Function that outputs the redirect page
	 *
	 * @param string $tab_to_display The tab that will be shown.
	 */
	public function display( $tab_to_display ) {
		$tab_presenter = $this->get_tab_presenter( $tab_to_display );
		$redirect_tabs = $this->navigation_tabs( $tab_to_display );

		include WPSEO_PREMIUM_PATH . 'classes/redirect/views/redirects.php';
	}

	/**
	 * Returns a tab presenter.
	 *
	 * @param string $tab_to_display The tab that will be shown.
	 *
	 * @return null|WPSEO_Redirect_Tab_Presenter
	 */
	private function get_tab_presenter( $tab_to_display ) {
		$tab_presenter = null;
		switch ( $tab_to_display ) {
			case 'plain':
			case 'regex':
				$redirect_manager = new WPSEO_Redirect_Manager( $tab_to_display );
				$tab_presenter    = new WPSEO_Redirect_Table_Presenter( $tab_to_display, $this->get_view_vars() );
				$tab_presenter->set_table( $redirect_manager->get_redirects() );
				break;
			case 'settings':
				if ( current_user_can( 'wpseo_manage_options' ) ) {
					$tab_presenter = new WPSEO_Redirect_Settings_Presenter( $tab_to_display, $this->get_view_vars() );
				}
				break;
		}

		return $tab_presenter;
	}

	/**
	 * Returning the anchors html for the tabs
	 *
	 * @param string $active_tab The tab that will be active.
	 *
	 * @return array
	 */
	private function navigation_tabs( $active_tab ) {
		$tabs = array(
			'plain'    => __( 'Redirects', 'wordpress-seo-premium' ),
			'regex'    => __( 'Regex Redirects', 'wordpress-seo-premium' ),
		);

		if ( current_user_can( 'wpseo_manage_options' ) ) {
			$tabs['settings'] = __( 'Settings', 'wordpress-seo-premium' );
		}

		return array(
			'tabs'        => $tabs,
			'current_tab' => $active_tab,
			'page_url'    => admin_url( 'admin.php?page=wpseo_redirects&tab=' ),
		);
	}

	/**
	 * Getting the variables for the view
	 *
	 * @return array
	 */
	private function get_view_vars() {
		return array(
			'nonce' => wp_create_nonce( 'wpseo-redirects-ajax-security' ),
		);
	}
}
