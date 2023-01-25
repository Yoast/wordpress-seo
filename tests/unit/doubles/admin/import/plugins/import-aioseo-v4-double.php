<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Doubles\Admin\Import\Plugins;

use WPSEO_Import_AIOSEO_V4;

/**
 * Double for the WPSEO_Import_AIOSEO_V4 class, to be able to test its protected methods.
 */
class WPSEO_Import_AIOSEO_V4_Double extends WPSEO_Import_AIOSEO_V4 {

	/**
	 * Replaces the AiOSEO variables in our temporary table with Yoast variables (replace vars).
	 *
	 * @param array $replace_values Key value pair of values to replace with other values. This is only used in the base class but not here.
	 *                              That is because this class doesn't have any `convert` keys in `$clone_keys`.
	 *                              For that reason, we're overwriting the base class' `meta_key_clone_replace()` function without executing that base functionality.
	 *
	 * @return void
	 */
	public function meta_key_clone_replace( $replace_values ) {
		parent::meta_key_clone_replace( $replace_values );
	}
}
