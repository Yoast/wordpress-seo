<?php

class WPSEO_Nginx_Redirect_File extends WPSEO_Redirect_File {

	public function format_redirect( $old_url, $new_url ) {
		return "location " . $old_url . " { rewrite ^ " . $new_url . " permanent; }";
	}

}