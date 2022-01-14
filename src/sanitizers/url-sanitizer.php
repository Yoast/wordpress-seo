<?php

namespace Yoast\WP\SEO\Sanitizers;

class URL_Sanitizer implements Sanitizer_Interface {
	public function sanitize( $value ) {
		return \WPSEO_Utils::sanitize_url( $value );
	}
}
