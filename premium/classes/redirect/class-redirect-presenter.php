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
	 * @param string                 $current_tab
	 * @param WPSEO_Redirect_Manager $redirect_manager
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
			case 'url' :
			case 'regex' :
				$view_vars                   = $this->get_view_vars();
				$view_vars['redirect_table'] = new WPSEO_Redirect_Table( $this->current_tab, $this->redirect_manager );

				$tab_presenter = new WPSEO_Redirect_Table_Presenter( $this->current_tab, $view_vars );
				break;
			case 'settings' :
				$tab_presenter = new WPSEO_Redirect_Settings_Presenter( $this->current_tab, $this->get_view_vars() );
				break;
		}

		$redirect_tabs = $this->navigation_tabs();

		require_once( WPSEO_PATH . 'premium/views/redirects.php' );
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
			'url'      => __( 'Redirects', 'wordpress-seo-premium' ),
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
