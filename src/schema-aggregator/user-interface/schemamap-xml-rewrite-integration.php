<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use WP_Query;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
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
	 * The redirect helper.
	 *
	 * @var Redirect_Helper
	 */
	private $redirect_helper;

	/**
	 * Returns the conditionals for this integration.
	 *
	 * The front end conditional keeps the rewrite rule out of admin requests, where the schema map is
	 * never served. It also means the rule is absent while Yoast SEO is being deactivated, so no
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
	 * @param Redirect_Helper         $redirect_helper         The redirect helper.
	 */
	public function __construct( Schema_Map_Xml_Provider $schema_map_xml_provider, Redirect_Helper $redirect_helper ) {
		$this->schema_map_xml_provider = $schema_map_xml_provider;
		$this->redirect_helper         = $redirect_helper;
	}

	/**
	 * Registers the hooks for the integration.
	 *
	 * The schema map is rendered on `pre_get_posts` rather than `template_redirect`, the same way
	 * `WPSEO_Sitemaps::redirect()` renders sitemaps. That skips the main posts query, which this
	 * response never uses, and leaves fewer third-party callbacks able to echo ahead of the XML —
	 * anything printed before the document would stop it parsing as a sitemap.
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
		\add_action( 'pre_get_posts', [ $this, 'maybe_render_schema_map' ], 1 );
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
	 * Outputs the schema map when the main query is a request for it.
	 *
	 * @param WP_Query $query The query that is about to run.
	 *
	 * @return void
	 */
	public function maybe_render_schema_map( WP_Query $query ) {
		if ( ! $query->is_main_query() || ! $query->get( self::QUERY_VAR ) ) {
			return;
		}

		/*
		 * Without control over the headers the response cannot be typed as XML, and echoing the
		 * document into a half-written HTML body would produce neither a page nor a schema map.
		 */
		if ( $this->headers_already_sent() ) {
			return;
		}

		/*
		 * Build the document before committing any headers. Generating it hits the database and can
		 * throw, and a failure after the 200 and the cache headers were sent would let a proxy store
		 * an HTML error page at this path for the full max-age.
		 */
		$xml = $this->schema_map_xml_provider->get_xml();

		$this->send_headers();

		// DOMDocument::createTextNode() already escaped every value; escaping again would corrupt the XML.
		echo $xml; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Raw XML.

		$this->finish_request();
	}

	/**
	 * Sends the response headers for the schema map.
	 *
	 * These replace what `WP::send_headers()` already sent: the HTML content type, and the `Expires`
	 * and `Cache-Control` pair that `wp_get_nocache_headers()` adds for logged-in users.
	 *
	 * @return void
	 */
	protected function send_headers() {
		\status_header( 200 );
		// Prevent the search engines from indexing the schema map.
		$this->redirect_helper->set_header( 'X-Robots-Tag: noindex, follow' );
		$this->redirect_helper->set_header( 'Content-Type: application/xml; charset=UTF-8' );
		$this->redirect_helper->set_header( 'Cache-Control: public, max-age=300' );
		// The response is public, so the no-cache Expires date from wp_get_nocache_headers() must go.
		$this->redirect_helper->remove_header( 'Expires' );
	}

	/**
	 * Tells whether the response headers have already been sent.
	 *
	 * Wrapped in an overridable method so the unit tests can drive both branches of
	 * maybe_render_schema_map(); the test process cannot control what headers_sent() reports.
	 * Protected rather than private because Mockery cannot stub private methods.
	 *
	 * @codeCoverageIgnore It only wraps a PHP function.
	 *
	 * @return bool Whether the headers have already been sent.
	 */
	protected function headers_already_sent(): bool {
		return \headers_sent();
	}

	/**
	 * Ends the request after the schema map has been output.
	 *
	 * The exit() is wrapped in an overridable method so the unit tests can stub it out; executing it
	 * would terminate the test runner. Protected rather than private because Mockery cannot stub
	 * private methods.
	 *
	 * @codeCoverageIgnore It only wraps a language construct that terminates the request.
	 *
	 * @return void
	 */
	protected function finish_request() {
		exit();
	}
}
