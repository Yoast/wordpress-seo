<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Application\Traffic;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Dashboard_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;
use Yoast\WP\SEO\Dashboard\Domain\Time_Based_Seo_Metrics\Data_Source_Not_Available_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;

/**
 * The data provider for organic sessions data.
 */
class Organic_Sessions_Repository implements Dashboard_Repository_Interface {

	/**
	 * The adapter.
	 *
	 * @var Site_Kit_Analytics_4_Adapter $site_kit_analytics_4_adapter
	 */
	private $site_kit_analytics_4_adapter;

	/**
	 * The site kit configuration object.
	 *
	 * @var Site_Kit $site_kit_configuration
	 */
	private $site_kit_configuration;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Analytics_4_Adapter $site_kit_analytics_4_adapter The adapter.
	 * @param Site_Kit                     $site_kit_configuration       The site kit configuration object.
	 */
	public function __construct(
		Site_Kit_Analytics_4_Adapter $site_kit_analytics_4_adapter,
		Site_Kit $site_kit_configuration
	) {
		$this->site_kit_analytics_4_adapter = $site_kit_analytics_4_adapter;
		$this->site_kit_configuration       = $site_kit_configuration;
	}

	/**
	 * Gets the organic sessions' data.
	 *
	 * @param Parameters $parameters The parameter to use for getting the organic sessions' data.
	 *
	 * @return Data_Container
	 *
	 * @throws Data_Source_Not_Available_Exception When this repository is used without the needed prerequisites ready.
	 */
	public function get_data( Parameters $parameters ): Data_Container {
		if ( ! $this->site_kit_configuration->is_onboarded() || ! $this->site_kit_configuration->is_ga_connected() ) {
			throw new Data_Source_Not_Available_Exception( 'Organic Sessions Repository' );
		}
		$organic_sessions_data = $this->site_kit_analytics_4_adapter->get_data( $parameters );

		return $organic_sessions_data;
	}
}
