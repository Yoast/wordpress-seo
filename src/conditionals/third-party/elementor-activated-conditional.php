<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is met when the Elementor plugin is installed and activated.
 */
class Elementor_Activated_Conditional implements Conditional {

	/**
	 * The path to the elementor plugin file relative to the plugins directory.
	 *
	 * @internal
	 */
	const PATH_TO_ELEMENTOR_PLUGIN_FILE = 'elementor/elementor.php';

	/**
	 * Checks if the Elementor plugins is installed and activated.
	 *
	 * @return bool `true` when the Elementor plugin is installed and activated.
	 */
	public function is_met() {
		return \is_plugin_active( self::PATH_TO_ELEMENTOR_PLUGIN_FILE );
	}
}
