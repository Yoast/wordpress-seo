<?php

namespace Yoast\WP\Free\Tests\Doubles\Admin;

use WPSEO_MyYoast_Proxy;

/**
 * Test Helper Class.
 */
class MyYoast_Proxy_Double extends WPSEO_MyYoast_Proxy {

	/**
	 * Determines the proxy options based on the file and plugin version arguments.
	 *
	 * When the file is known it returns an array like this:
	 * <code>
	 * $array = array(
	 *  'content_type' => 'the content type'
	 *  'url'          => 'the url, possibly with the plugin version'
	 * )
	 * </code>
	 *
	 * @return array Empty for an unknown file. See format above for known files.
	 */
	public function determine_proxy_options() {
		return parent::determine_proxy_options();
	}
}
