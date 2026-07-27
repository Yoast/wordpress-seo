<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;
use Yoast_Dynamic_Rewrites;

/**
 * Serves the schema map at the `schemamap.xml` path of the site.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Schemamap_Xml_Rewrite_Integration implements Integration_Interface {

	/**
	 * The query variable that flags a request for the schema map.
	 *
	 * @var string
	 */
	public const QUERY_VAR = 'yoast_schemamap';

	/**
	 * The schema map XML provider.
	 *
	 * @var Schema_Map_Xml_Provider
	 */
	private $schema_map_xml_provider;

	/**
	 * Returns the conditionals for this integration.
	 *
	 * The front end conditional keeps the rewrite rule out of admin requests, where `template_redirect`
	 * never fires anyway. It also means the rule is absent while Yoast SEO is being deactivated, so no
	 * equivalent of the `Deactivating_Yoast_Seo_Conditional` guard in `WPSEO_Sitemaps_Router` is needed.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals() {
		return [ Schema_Aggregator_Conditional::class, Front_End_Conditional::class ];
	}

	/**
	 * Schemamap_Xml_Rewrite_Integration constructor.
	 *
	 * @param Schema_Map_Xml_Provider $schema_map_xml_provider The schema map XML provider.
	 */
	public function __construct( Schema_Map_Xml_Provider $schema_map_xml_provider ) {
		$this->schema_map_xml_provider = $schema_map_xml_provider;
	}

	/**
	 * Registers the hooks for the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		/*
		 * Integrations register their hooks on `init` priority 10, which is after
		 * `yoast_add_dynamic_rewrite_rules` has already fired on `init` priority 1. The rule is
		 * therefore added directly, the same way `WPSEO_Sitemaps::register_sitemap()` does for
		 * sitemaps registered during `init`. Rewrite rules are not read until `WP::parse_request()`,
		 * so this is still in time.
		 */
		$this->add_rewrite_rules( Yoast_Dynamic_Rewrites::instance() );

		\add_filter( 'query_vars', [ $this, 'add_query_vars' ] );
		\add_filter( 'redirect_canonical', [ $this, 'redirect_canonical' ] );
		\add_action( 'template_redirect', [ $this, 'maybe_render_schema_map' ], 0 );
	}

	/**
	 * Adds the rewrite rule for the schema map.
	 *
	 * @param Yoast_Dynamic_Rewrites $dynamic_rewrites Dynamic rewrites handler instance.
	 *
	 * @return void
	 */
	public function add_rewrite_rules( Yoast_Dynamic_Rewrites $dynamic_rewrites ) {
		$dynamic_rewrites->add_rule( 'schemamap\.xml$', 'index.php?' . self::QUERY_VAR . '=1', 'top' );
	}

	/**
	 * Adds the query variable for the schema map.
	 *
	 * @param array<string> $query_vars List of query variables to filter.
	 *
	 * @return array<string> Filtered query variables.
	 */
	public function add_query_vars( $query_vars ) {
		$query_vars[] = self::QUERY_VAR;

		return $query_vars;
	}

	/**
	 * Stops trailing slashes from being added to the schema map URL.
	 *
	 * @param string $redirect The redirect URL currently determined.
	 *
	 * @return bool|string False when this is a schema map request, the unchanged redirect otherwise.
	 */
	public function redirect_canonical( $redirect ) {
		if ( \get_query_var( self::QUERY_VAR ) ) {
			return false;
		}

		return $redirect;
	}

	/**
	 * Outputs the schema map when the current request is for it.
	 *
	 * @return void
	 */
	public function maybe_render_schema_map() {
		if ( ! \get_query_var( self::QUERY_VAR ) ) {
			return;
		}

		$this->send_headers();

		// DOMDocument::createTextNode() already escaped every value; escaping again would corrupt the XML.
		echo $this->schema_map_xml_provider->get_xml(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Raw XML.

		$this->finish_request();
	}

	/**
	 * Sends the response headers for the schema map.
	 *
	 * The headers replace the ones `WP::send_headers()` already sent: the HTML content type, and the
	 * no-cache headers that are added for logged-in users.
	 *
	 * @return void
	 */
	protected function send_headers() {
		if ( \headers_sent() ) {
			return;
		}

		// Guards against a 200 body being served under the 404 status of a `?yoast_schemamap=1` request.
		\status_header( 200 );
		// Prevent the search engines from indexing the schema map.
		\header( 'X-Robots-Tag: noindex, follow', true );
		\header( 'Content-Type: application/xml; charset=UTF-8', true );
		\header( 'Cache-Control: public, max-age=300', true );
	}

	/**
	 * Ends the request after the schema map has been output.
	 *
	 * @codeCoverageIgnore Terminates the request, so it cannot be executed under test.
	 *
	 * @return void
	 */
	protected function finish_request() {
		exit();
	}
}
