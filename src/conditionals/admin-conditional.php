<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\Free\Conditionals;

/**
 * Conditional that is only met when in the admin.
 */
class Admin_Conditional implements Conditional {

	/**
	 * @inheritdoc
	 */
	public function is_met() {
		return \is_admin();
	}
}
