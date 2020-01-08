<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Presentations\Generators
 */

namespace Yoast\WP\SEO\Presentations\Generators;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

interface Generator_Interface {

	/**
	 * Returns a string, or other Thing that the associated presenter can handle.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return mixed
	 */
	public function generate( Meta_Tags_Context $context );
}
