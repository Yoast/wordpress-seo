<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Application\Traffic;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Dashboard_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter;

/**
 * The data provider for daily organic sessions data.
 */
class Organic_Sessions_Daily_Repository implements Dashboard_Repository_Interface {

	/**
	 * The adapter.
	 *
	 * @var Site_Kit_Analytics_4_Adapter $site_kit_analytics_4_adapter
	 */
	private $site_kit_analytics_4_adapter;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Analytics_4_Adapter $site_kit_analytics_4_adapter The adapter.
	 */
	public function __construct(
		Site_Kit_Analytics_4_Adapter $site_kit_analytics_4_adapter
	) {
		$this->site_kit_analytics_4_adapter = $site_kit_analytics_4_adapter;
	}

	/**
	 * Gets daily organic sessions' data.
	 *
	 * @param Parameters $parameters The parameter to use for getting the daily organic sessions' data.
	 *
	 * @return Data_Container
	 *
	 * @throws Exception When getting the daily organic sessions' data fails.
	 */
	public function get_data( Parameters $parameters ): Data_Container {

		return $this->site_kit_analytics_4_adapter->get_daily_data( $parameters );
	}
}
