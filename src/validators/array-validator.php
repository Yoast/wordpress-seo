<?php

namespace Yoast\WP\SEO\Validators;

class Array_Validator implements Validator_Interface {
	public function validate( $value ) {
		 return \is_array( $value );
	}
}
