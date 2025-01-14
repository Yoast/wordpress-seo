<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Request_Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Rankings\Search_Rankings_Parser;

/**
 * Registers a route to get the top search queries.
 */
class Top_Query_Route extends Abstract_Ranking_Route {

	/**
	 * The prefix of the route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/top_queries';

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter The adapter.
	 * @param Search_Rankings_Parser          $search_rankings_parser          The parser.
	 */
	public function __construct( Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter, Search_Rankings_Parser $search_rankings_parser ) {
		$this->set_request_parameters( new Request_Parameters( [ 'query' ] ) );

		parent::__construct( $site_kit_search_console_adapter, $search_rankings_parser );
	}
}
