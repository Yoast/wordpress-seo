<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is met when the CoAuthors Plus plugin is installed and activated.
 *
 * @deprecated 19.11
 */
class CoAuthors_Plus_Activated_Conditional implements Conditional {

	/**
	 * Checks if the CoAuthors Plus plugin is installed and activated.
	 *
	 * @deprecated 19.11
	 *
	 * @return bool `true` when the CoAuthors Plus plugin is installed and activated.
	 */
	public function is_met() {
		return \defined( 'COAUTHORS_PLUS_VERSION' );
	}
}
