<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internal
 */

/**
 * Class containing method for WPSEO Features.
 *
 * @deprecated 16.0
 */
class WPSEO_Features {

	/**
	 * Checks if the premium constant exists to make sure if plugin is the premium one.
	 *
	 * @deprecated 16.0
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function is_premium() {
		_deprecated_function( __FUNCTION__, '16.0', 'YoastSEO()->helpers->product->is_premium' );
		return YoastSEO()->helpers->product->is_premium();
	}

	/**
	 * Checks if using the free version of the plugin.
	 *
	 * @deprecated 16.0
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function is_free() {
		_deprecated_function( __FUNCTION__, '16.0', 'YoastSEO()->helpers->product->is_premium' );
		return true;
	}
}
