<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Table_Presenter
 */
class WPSEO_Redirect_Tab_Presenter {

	/**
	 * @var string
	 */
	protected $view;

	/**
	 * @var array
	 */
	protected $view_vars = array();

	/**
	 * @param string $view
	 * @param array  $view_vars
	 */
	public function __construct( $view, $view_vars ) {
		$this->view      = $view;
		$this->view_vars = $view_vars;
	}

	/**
	 * Displaying the table url or regex. Depends on the current active tab.
	 */
	public function display() {
		// @codingStandardsIgnoreStart
		extract( $this->get_view_vars() );
		// @codingStandardsIgnoreEnd

		require_once( WPSEO_PATH . 'premium/views/redirects-tab-' . $this->view . '.php' );
	}

}
