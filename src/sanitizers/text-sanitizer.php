<?php

namespace Yoast\WP\SEO\Sanitizers;

class Text_Sanitizer implements Sanitizer_Interface {
	public function sanitize( $value ) {
		return sanitize_text_field( $value );
	}
}
