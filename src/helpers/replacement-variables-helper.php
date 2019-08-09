<?php
/**
 * A helper object for replacement variables.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use WPSEO_Replace_Vars;

class Replacement_Variables_Helper extends WPSEO_Replace_Vars {

	/**
	 * Replace `%%variable_placeholders%%` with their real value based on the current requested page/post/cpt/etc.
	 *
	 * @param string $string The string to replace the variables in.
	 * @param array  $args   The object some of the replacement values might come from,
	 *                       could be a post, taxonomy or term.
	 * @param array  $omit   Variables that should not be replaced by this function.
	 *
	 * @return string
	 */
	public function replace( $string, $args, $omit = array() ) {
		return parent::replace( $string, $args, $omit );
	}
}
