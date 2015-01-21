<?php

class WPSEO_Premium_Javascript_Strings {
	private static $strings = null;

	private static function fill() {
		self::$strings = array(
			'ajaxurl'               => admin_url( 'admin-ajax.php' ),
			'error_circular'        => __( "You can't redirect a URL to itself.", 'wordpress-seo-premium' ),
			'error_old_url'         => __( "The old URL field can't be empty.", 'wordpress-seo-premium' ),
			'error_regex'           => __( "The REGEX field can't be empty.", 'wordpress-seo-premium' ),
			'error_new_url'         => __( "The new URL field can't be empty.", 'wordpress-seo-premium' ),
			'error_saving_redirect' => __( "Error while saving this redirect", 'wordpress-seo-premium' ),
			'error_new_type'        => __( "New type can't be empty.", 'wordpress-seo-premium' ),
			'unsaved_redirects'     => __( "You have unsaved redirects, are you sure you want to leave?", 'wordpress-seo-premium' ),
			'enter_new_url'         => __( "Please enter the new URL", 'wordpress-seo-premium' ),
			'redirect_saved'        => __( "Redirect saved!", 'wordpress-seo-premium' ),
			'redirect_possibly_bad' => __( "Possibly bad redirect.", 'wordpress-seo-premium' ),
			'redirect_not_ok'       => __( "The URL you entered returned a HTTP code different than 200(OK).", 'wordpress-seo-premium' ),
		);
	}

	public static function strings() {
		if ( self::$strings === null ) {
			self::fill();
		}

		return self::$strings;
	}
}