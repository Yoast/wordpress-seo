<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Helpers\Schema
 */

namespace Yoast\WP\Free\Helpers\Schema;

/**
 * Class HTML_Helper
 *
 * @package Yoast\WP\Free\Helpers\Schema
 */
class HTML_Helper {

	/**
	 * Sanitizes a HTML string by stripping all tags except headings, breaks, lists, links, paragraphs and formatting.
	 *
	 * @param string $html The original HTML.
	 *
	 * @return string The sanitized HTML.
	 */
	public function sanitize( $html ) {
		return \strip_tags( $html, '<h1><h2><h3><h4><h5><h6><br><ol><ul><li><a><p><b><strong><i><em>' );
	}
}
