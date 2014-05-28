<?php

class WPSEO_Premium_Javascript_Strings {
	private static $strings = null;

	private static function fill() {
		self::$strings = array(
			'ajaxurl'               => admin_url( 'admin-ajax.php' ),
			'error_old_url'         => __( "The old URL field can't be empty.", 'wordpress-seo' ),
			'error_regex'           => __( "The REGEX field can't be empty.", 'wordpress-seo' ),
			'error_new_url'         => __( "The new URL field can't be empty.", 'wordpress-seo' ),
			'error_saving_redirect' => __( "Error while saving this redirect", 'wordpress-seo' ),
			'error_new_type'        => __( "New type can't be empty.", 'wordpress-seo' ),
			'unsaved_redirects'     => __( "You have unsaved redirects, are you sure you want to leave?", 'wordpress-seo' ),
			'enter_new_url'         => __( "Please enter the new URL", 'wordpress-seo' ),
			'redirect_saved'        => __( "Redirect saved!", 'wordpress-seo' ),
			'redirect_possibly_bad' => __( "Possibly bad redirect.", 'wordpress-seo' ),
			'redirect_not_ok'       => __( "The URL you entered returned a HTTP code different than 200(OK).", 'wordpress-seo' ),
		);
	}

	public static function strings() {
		if ( self::$strings === null ) {
			self::fill();
		}

		return self::$strings;
	}
}