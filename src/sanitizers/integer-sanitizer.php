<?php

namespace Yoast\WP\SEO\Sanitizers;

class Integer_Sanitizer implements Sanitizer_Interface {
	public function sanitize( $value ) {
		return \WPSEO_Utils::validate_int( $value );
	}
}
