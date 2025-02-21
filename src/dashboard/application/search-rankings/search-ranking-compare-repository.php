<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Application\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Dashboard_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter;
use Yoast\WP\SEO\Dashboard\Infrastructure\Indexables\Top_Page_Indexable_Collector;

/**
 * The data provider for comparing search ranking related data.
 */
class Search_Ranking_Compare_Repository implements Dashboard_Repository_Interface {

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
	public function __construct(
		Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter
	) {
		$this->site_kit_search_console_adapter = $site_kit_search_console_adapter;
	}

	/**
	 * Gets the comparing search ranking data.
	 *
	 * @param Parameters $parameters The parameter to use for getting the comparing search ranking data.
	 *
	 * @return Data_Container
	 *
	 * @throws Exception When getting the comparing search ranking data fails.
	 */
	public function get_data( Parameters $parameters ): Data_Container {

		$compare_search_ranking_data = $this->site_kit_search_console_adapter->get_data( $parameters );

		return $compare_search_ranking_data;
	}
}
