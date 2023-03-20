<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Admin;

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

	/**
	 * Test double for is_proxy_page.
	 *
	 * @return bool
	 */
	public function is_proxy_page() {
		return parent::is_proxy_page();
	}

	/**
	 * Test double for get_proxy_file.
	 *
	 * @return string
	 */
	public function get_proxy_file() {
		return parent::get_proxy_file();
	}

	/**
	 * Test double for get_plugin_version.
	 *
	 * @return string
	 */
	public function get_plugin_version() {
		return parent::get_plugin_version();
	}
}
