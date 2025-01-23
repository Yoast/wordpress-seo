<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Top_Query_Repository;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;

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
	 * @param Top_Query_Repository $top_query_repository The data provider.
	 */
	public function __construct( Top_Query_Repository $top_query_repository ) {
		$this->set_request_parameters( new Search_Console_Parameters( [ 'query' ] ) );

		parent::__construct( $top_query_repository );
	}
}
