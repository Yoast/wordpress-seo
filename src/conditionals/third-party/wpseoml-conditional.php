<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is met when the Yoast SEO Multilingual plugin,
 * a glue plugin developed by and for WPML, is active.
 */
class WPSEOML_Conditional implements Conditional {

	const PATH_TO_WPSEOML_PLUGIN_FILE = 'wp-seo-multilingual/plugin.php';

	/**
	 * Returns whether or not the Yoast SEO Multilingual plugin is active.
	 *
	 * @return boolean Whether or not the Yoast SEO Multilingual plugin is active.
	 */
	public function is_met() {
		return \is_plugin_active( self::PATH_TO_WPSEOML_PLUGIN_FILE );
	}
}
