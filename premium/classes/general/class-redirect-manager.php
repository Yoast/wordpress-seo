<?php

class WPSEO_Redirect_Manager {

	public function __construct() {

	}

	public static function ajax_handle_redirects_save() {

		// Check nonce
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		// Permission check
		if ( ! current_user_can( 'edit_posts' ) ) {
			echo '0';
			exit;
		}

		// Save redirects in database
		update_option( 'wpseo-premium-redirects', $_POST['redirects'] );

		// Response
		echo '1';
		exit;

	}

}
