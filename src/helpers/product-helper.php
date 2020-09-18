<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object to retrieve the product name.
 */
class Product_Helper {

	/**
	 * Represents the yoast helper.
	 *
	 * @var Yoast_Helper
	 */
	protected $yoast_helper;

	/**
	 * Site_Helper constructor.
	 *
	 * @param Yoast_Helper $yoast_helper The yoast helper.
	 */
	public function __construct( Yoast_Helper $yoast_helper ) {
		$this->yoast_helper = $yoast_helper;
	}

	/**
	 * Get the product name in the head section.
	 *
	 * @return string
	 */
	public function get_name() {
		if ( $this->yoast_helper->is_premium() ) {
			return 'Yoast SEO Premium plugin';
		}

		return 'Yoast SEO plugin';
	}
}
