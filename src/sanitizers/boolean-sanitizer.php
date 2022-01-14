<?php

namespace Yoast\WP\SEO\Sanitizers;

class Boolean_Sanitizer implements Sanitizer_Interface {
	public function sanitize( $value ) {
		return \WPSEO_Utils::validate_bool( $value );
	}
}
