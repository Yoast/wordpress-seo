<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Search_Rankings_Data_Provider;
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
	 * @param Search_Rankings_Data_Provider $search_rankings_data_provider The data provider.
	 */
	public function __construct( Search_Rankings_Data_Provider $search_rankings_data_provider ) {
		$this->set_request_parameters( new Search_Console_Parameters( [ 'query' ] ) );

		parent::__construct( $search_rankings_data_provider );
	}
}
