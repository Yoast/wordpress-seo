<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Provider_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Rankings\Search_Rankings_Parser;

/**
 * The data provider for search ranking related data.
 */
class Search_Rankings_Data_Provider implements Data_Provider_Interface {

	/**
	 * The adapter.
	 *
	 * @var Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter
	 */
	private $site_kit_search_console_adapter;

	/**
	 * The ranking parser.
	 *
	 * @var Search_Rankings_Parser $search_rankings_parser
	 */
	private $search_rankings_parser;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter The adapter.
	 * @param Search_Rankings_Parser          $search_rankings_parser          The parser.
	 */
	public function __construct( Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter, Search_Rankings_Parser $search_rankings_parser ) {
		$this->site_kit_search_console_adapter = $site_kit_search_console_adapter;
		$this->search_rankings_parser          = $search_rankings_parser;
	}

	/**
	 * Method to get search related data from a provider.
	 *
	 * @param Parameters $parameters The parameter to get the search data for.
	 *
	 * @return Data_Container
	 */
	public function get_data( Parameters $parameters ): Data_Container {

		$results = $this->site_kit_search_console_adapter->get_data( $parameters );

		return $this->search_rankings_parser->parse( $results );
	}
}
