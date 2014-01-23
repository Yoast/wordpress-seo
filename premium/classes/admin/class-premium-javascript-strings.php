<?php

class WPSEO_Premium_Javascript_Strings {
	private static $strings = null;

	private static function fill() {
		self::$strings = array(
				'error_old_url'   => __( "Old URL can't be empty.", 'wordpress-seo' ),
				'error_new_url'   => __( "New URL can't be empty.", 'wordpress-seo' ),
				'unsaved_redirects'   => __( "You have unsaved redirects, are you sure you want to leave?", 'wordpress-seo' ),
		);
	}

	public static function strings() {
		if ( self::$strings === null ) {
			self::fill();
		}
		return self::$strings;
	}
}