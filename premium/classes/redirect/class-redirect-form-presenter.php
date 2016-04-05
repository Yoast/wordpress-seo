<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * The presenter for the form, this form will be used for adding and updating the redirects.
 */
class WPSEO_Redirect_Form_Presenter {

	/**
	 * @var array
	 */
	private $view_vars;

	/**
	 * Setting up the view_vars
	 *
	 * @param array $view_vars The variables to pass into the view.
	 */
	public function __construct( array $view_vars ) {
		$this->view_vars = $view_vars;

		$this->view_vars['redirect_types'] = $this->get_redirect_types();

	}

	/**
	 * Display the form
	 *
	 * @param array $display Additional display variables.
	 */
	public function display( array $display = array() ) {

		// @codingStandardsIgnoreStart
		extract( array_merge_recursive( $this->view_vars, $display ) );
		// @codingStandardsIgnoreEnd

		require( WPSEO_PATH . 'premium/classes/redirect/views/redirects-form.php' );
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
			'451' => __( '451 Unavailable For Legal Reasons', 'wordpress-seo-premium' ),
		);

		return apply_filters( 'wpseo_premium_redirect_types', $redirect_types );
	}
}
