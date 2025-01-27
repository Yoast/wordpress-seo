<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Application\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Dashboard_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Indexables\Top_Page_Indexable_Collector;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter;

/**
 * The data provider for search ranking related data.
 */
class Top_Page_Repository implements Dashboard_Repository_Interface {

	/**
	 * The adapter.
	 *
	 * @var Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter
	 */
	private $site_kit_search_console_adapter;

	/**
	 * The top page indexable collector.
	 *
	 * @var Top_Page_Indexable_Collector $top_page_indexable_collector
	 */
	private $top_page_indexable_collector;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter The adapter.
	 * @param Top_Page_Indexable_Collector    $top_page_indexable_collector    The top page indexable collector.
	 */
	public function __construct(
		Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter,
		Top_Page_Indexable_Collector $top_page_indexable_collector
	) {
		$this->site_kit_search_console_adapter = $site_kit_search_console_adapter;
		$this->top_page_indexable_collector    = $top_page_indexable_collector;
	}

	/**
	 * Gets the top pages' data.
	 *
	 * @param Parameters $parameters The parameter to use for getting the top pages.
	 *
	 * @return Data_Container
	 *
	 * @throws Exception When getting the top pages' data fails.
	 */
	public function get_data( Parameters $parameters ): Data_Container {

		$top_pages                 = $this->site_kit_search_console_adapter->get_data( $parameters );
		$top_pages_with_seo_scores = $this->top_page_indexable_collector->get_seo_scores( $top_pages );

		return $top_pages_with_seo_scores;
	}
}
