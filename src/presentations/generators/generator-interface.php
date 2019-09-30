<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators
 */

namespace Yoast\WP\Free\Presentations\Generators;

interface Generator_Interface {

	/**
	 * Returns an outputtable string.
	 *
	 * @return string
	 */
	public function generate();
}