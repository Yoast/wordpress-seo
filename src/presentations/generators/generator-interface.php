<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators
 */

namespace Yoast\WP\Free\Presentations\Generators;

interface Generator_Interface {

	/**
	 * Returns a string, or other Thing that the associated presenter can handle.
	 *
	 * @return mixed
	 */
	public function generate();
}