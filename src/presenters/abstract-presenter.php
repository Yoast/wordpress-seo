<?php
/**
 * Abstract presenter class.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

/**
 * Abstract_Presenter class.
 */
abstract class Abstract_Presenter {

	/**
	 * Return the output as string.
	 *
	 * @return string The output.
	 */
	abstract public function present();

	/**
	 * Return the output as string.
	 *
	 * @return string The output.
	 */
	public function __toString() {
		return $this->present();
	}
}
