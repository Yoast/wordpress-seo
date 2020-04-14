<?php
/**
 * Abstract presenter class.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

/**
 * Abstract_Presenter class
 */
abstract class Abstract_Presenter {

	/**
	 * Return the output as string.
	 *
	 * @return string
	 */
	abstract public function present();

	/**
	 * Return the output as string.
	 *
	 * @return string
	 */
	public function __toString() {
		return $this->present();
	}
}
