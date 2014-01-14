<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

class WPSEO_Apache_Redirect_File extends WPSEO_Redirect_File {

	public function format_redirect( $old_url, $new_url ) {
		return "Redirect 301 " . $old_url . " " . $new_url;
	}

}