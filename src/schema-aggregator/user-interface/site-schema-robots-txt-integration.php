<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use Yoast\WP\SEO\Helpers\Robots_Txt_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

/**
 * Integration to add site schema XML sitemap to robots.txt.
 */
class Site_Schema_Robots_Txt_Integration implements Integration_Interface {

	/**
	 * Returns the conditional for this route.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals() {
		return [ Schema_Aggregator_Conditional::class ];
	}

	/**
	 * Registers the hooks for this integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'Yoast\WP\SEO\register_robots_rules', [ $this, 'maybe_add_xml_schema_map' ], 10, 1 );
	}

	/**
	 * Adds the XML schema map to the robots.txt if the site is public.
	 *
	 * @param Robots_Txt_Helper $robots_txt_helper The robots.txt helper.
	 *
	 * @return void
	 */
	public function maybe_add_xml_schema_map( Robots_Txt_Helper $robots_txt_helper ) {
		if ( (string) \get_option( 'blog_public' ) === '0' ) {
			return;
		}

		if ( \apply_filters( 'wpseo_disable_robots_schemamap', false ) ) {
			return;
		}
		$robots_txt_helper->add_schemamap( \esc_url( \rest_url( Main::API_V1_NAMESPACE . '/' . Site_Schema_Aggregator_Xml_Route::ROUTE_PREFIX . '/get-xml' ) ) );
	}
}
