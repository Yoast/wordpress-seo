<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Application\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Dashboard_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter;

/**
 * The data provider for search ranking related data.
 */
class Top_Query_Repository implements Dashboard_Repository_Interface {

	/**
	 * The adapter.
	 *
	 * @var Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter
	 */
	private $site_kit_search_console_adapter;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter The adapter.
	 */
	public function __construct( Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter ) {
		$this->site_kit_search_console_adapter = $site_kit_search_console_adapter;
	}

	/**
	 * Method to get search related data from a provider.
	 *
	 * @param Parameters $parameters The parameter to get the search data for.
	 *
	 * @return Data_Container
	 */
	public function get_data( Parameters $parameters ): Data_Container {

		return $this->site_kit_search_console_adapter->get_data( $parameters );
	}
}
