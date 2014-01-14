<?php

class WPSEO_GWT {

	public function __construct() {
		add_action( 'admin_init', array( $this, 'catch_authorization_code_post' ) );
	}

	public function get_authorization_code() {
		return ( ( isset( $_SESSION['wpseo']['gwt_authorization_code'] ) ) ? $_SESSION['wpseo']['gwt_authorization_code'] : null );
	}

	public function set_authorization_code( $authorization_code ) {
		$_SESSION['wpseo']['gwt_authorization_code'] = $authorization_code;
	}

	public function catch_authorization_code_post() {
		if ( isset ( $_POST['gwt']['authorization_code'] ) ) {
			$this->set_authorization_code( $_POST['gwt']['authorization_code'] );
		}
	}

}