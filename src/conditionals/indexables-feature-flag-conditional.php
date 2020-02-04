<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional for the indexables feature flag.
 */
class Indexables_Feature_Flag_Conditional extends Feature_Flag_Conditional {

	/**
	 * @inheritdoc
	 */
	protected function get_feature_flag() {
		return 'indexables';
	}
}
