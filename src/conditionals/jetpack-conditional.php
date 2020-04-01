<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when Jetpack exists.
 */
class Jetpack_Conditional implements Conditional {

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		return \class_exists( 'Jetpack' );
	}
}
