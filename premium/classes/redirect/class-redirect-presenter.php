<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Presenter
 */
class WPSEO_Redirect_Presenter {

	/**
	 * @var string
	 */
	private $current_tab = '';

	/**
	 * @var WPSEO_Redirect_Manager
	 */
	private $redirect_manager;

	/**
	 * Constructor
	 *
	 * @param string                 $current_tab 	   The tab which is active at the moment.
	 * @param WPSEO_Redirect_Manager $redirect_manager The redirect manager for getting the data.
	 */
	public function __construct( $current_tab, WPSEO_Redirect_Manager $redirect_manager ) {
		$this->current_tab      = $current_tab;
		$this->redirect_manager = $redirect_manager;
	}

	/**
	 * Function that outputs the redirect page
	 */
	public function display() {
		switch ( $this->current_tab ) {
			case 'plain' :
			case 'regex' :
				$tab_presenter = new WPSEO_Redirect_Table_Presenter( $this->current_tab, $this->get_view_vars() );
				$tab_presenter->set_table( $this->redirect_manager );
				break;
			case 'settings' :
				$tab_presenter = new WPSEO_Redirect_Settings_Presenter( $this->current_tab, $this->get_view_vars() );
				break;
		}

		$redirect_tabs = $this->navigation_tabs();

		require_once( WPSEO_PATH . 'premium/classes/redirect/views/redirects.php' );
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

	/**
	 * Returning the anchors html for the tabs
	 *
	 * @return string
	 */
	private function navigation_tabs() {
		$tabs     = array(
			'plain'    => __( 'Redirects', 'wordpress-seo-premium' ),
			'regex'    => __( 'Regex Redirects', 'wordpress-seo-premium' ),
			'settings' => __( 'Settings', 'wordpress-seo-premium' ),
		);

		$page_url   = admin_url( 'admin.php?page=wpseo_redirects&tab=' );
		$return     = '';
		foreach ( $tabs as $tab_url => $tab_value ) {
			$active = '';
			if ( $this->current_tab === $tab_url ) {
				$active = ' nav-tab-active';
			}

			$return .= '<a class="nav-tab' . $active . '" id="tab-url-tab" href="' . $page_url . $tab_url . '">' . $tab_value . '</a>';
		}

		return $return;
	}

}
