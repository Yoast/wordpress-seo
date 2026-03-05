<?php

// phpcs:disable WordPress.WP.CapitalPDangit.MisspelledClassName -- It is spelled like `Wordpress` because of Yoast's naming conventions for classes, which would otherwise break dependency injection in some cases.

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Wordpress_Helper;

/**
 * Conditional that is only met when WordPress is version 6.9 or higher.
 */
class WordPress_Version_Conditional implements Conditional {

	/**
	 * The minimum WordPress version required.
	 */
	private const REQUIRED_VERSION = '6.9';

	/**
	 * The WordPress helper.
	 *
	 * @var Wordpress_Helper
	 */
	private $wordpress_helper;

	/**
	 * Constructor.
	 *
	 * @param Wordpress_Helper $wordpress_helper The WordPress helper.
	 */
	public function __construct( Wordpress_Helper $wordpress_helper ) {
		$this->wordpress_helper = $wordpress_helper;
	}

	/**
	 * Returns `true` when WordPress meets the minimum version requirement.
	 *
	 * @return bool `true` when WordPress is version 6.9 or higher.
	 */
	public function is_met() {
		return \version_compare( $this->wordpress_helper->get_wordpress_version(), self::REQUIRED_VERSION, '>=' );
	}
}
