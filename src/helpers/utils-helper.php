<?php

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Utils;

/**
 * A helper object for utils.
 */
class Utils_Helper {

	/**
	 * Emulate the WP native sanitize_text_field function in a %%variable%% safe way.
	 *
	 * @param string $value String value to sanitize.
	 *
	 * @return string
	 */
	public function sanitize_text_field( $value ) {
		return WPSEO_Utils::sanitize_text_field( $value );
	}
}
