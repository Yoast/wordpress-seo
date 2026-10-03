<?php

namespace Yoast\WP\SEO\Integrations\Frontend;

use Yoast\WP\SEO\Helpers\Robots_Txt_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

/**
 * Integration to add site schema XML sitemap to robots.txt.
 *
 * @deprecated 27.5
 * @codeCoverageIgnore
 */
class Site_Schema_Robots_Txt_Integration implements Integration_Interface {

	/**
	 * Returns the conditional for this route.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5' );
		return [ Schema_Aggregator_Conditional::class ];
	}

	/**
	 * Registers the hooks for this integration.
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5' );
	}

	/**
	 * Adds the XML schema map to the robots.txt if the site is public.
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 *
	 * @param Robots_Txt_Helper $robots_txt_helper The robots.txt helper.
	 *
	 * @return void
	 */
	public function maybe_add_xml_schema_map( Robots_Txt_Helper $robots_txt_helper ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5' );
	}
}
