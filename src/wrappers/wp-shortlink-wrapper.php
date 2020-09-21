<?php

namespace Yoast\WP\SEO\Wrappers;

use WPSEO_Shortlinker;

class WP_Shortlink_Wrapper {

	public function get ( $url ) {
		return WPSEO_Shortlinker::get( $url );
	}
}