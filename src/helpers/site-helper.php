<?php

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Utils;

/**
 * A helper object for site options.
 */
class Site_Helper {

	/**
	 * Represents the yoast helper.
	 *
	 * @var Yoast_Helper
	 */
	protected $yoast_helper;

	/**
	 * Site_Helper constructor.
	 *
	 * @param Yoast_Helper $yoast_helper
	 */
	public function __construct( Yoast_Helper $yoast_helper ) {
		$this->yoast_helper = $yoast_helper;
	}

	/**
	 * Retrieves the site name.
	 *
	 * @return string
	 */
	public function get_site_name() {
		return wp_strip_all_tags( get_bloginfo( 'name' ), true );
	}

	/**
	 * Checks if the current installation is a multisite and there has been a switch
	 * between the set multisites.
	 *
	 * @codeCoverageIgnore It wraps WordPress functions.
	 *
	 * @return bool True when there was a switch between the multisites.
	 */
	public function is_multisite_and_switched() {
		return \is_multisite() && \ms_is_switched();
	}
}
