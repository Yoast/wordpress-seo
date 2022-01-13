<?php

namespace Yoast\WP\SEO\Validators;

class Url_Validator implements Validator_Interface {
	public function validate( $value ) {
		return \WPSEO_Utils::sanitize_url( $value );
	}
}
