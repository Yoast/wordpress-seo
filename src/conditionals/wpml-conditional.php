<?php namespace Yoast\WP\Free\Conditionals;

/**
 * Class WPML_Conditional
 * @package Yoast\WP\Free\Conditionals
 */
class WPML_Conditional implements Conditional {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		return function_exists( 'icl_object_id' );
	}
}
