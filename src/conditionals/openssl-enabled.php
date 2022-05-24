<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when OpenSSL is enabled.
 */
class OpenSSL_Enabled implements Conditional {

	/**
	 * Returns `true` when the OpenSSL library is enabled within this PHP installation.
	 *
	 * @return bool `true` when OpenSSL is enabled.
	 */
	public function is_met() {
		return \extension_loaded( 'openssl' );
	}
}
