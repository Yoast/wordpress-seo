<?php

namespace Yoast\WP\SEO\Conditionals\Admin;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is only met when on a post overview page or during an ajax request.
 */
class Elementor_Edit_Conditional implements Conditional {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		global $pagenow;

		return $pagenow === 'post.php' && isset( $_GET['action'] ) && $_GET['action'] === 'elementor';
	}
}
