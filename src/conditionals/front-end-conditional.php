<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when NOT in the admin.
 */
class Front_End_Conditional implements Conditional {

	/**
	 * Returns `true` when NOT on an admin page.
	 *
	 * @returns boolean `true` when NOT on an admin page.
	 */
	public function is_met() {
		return ! \is_admin();
	}
}
