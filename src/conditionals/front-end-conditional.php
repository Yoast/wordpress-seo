<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when in the admin.
 */
class Front_End_Conditional implements Conditional {

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		return ! \is_admin();
	}
}
