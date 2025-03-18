<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Application\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Dashboard_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;
use Yoast\WP\SEO\Dashboard\Domain\Time_Based_Seo_Metrics\Data_Source_Not_Available_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;
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
	 * The site kit configuration object.
	 *
	 * @var Site_Kit $site_kit_configuration
	 */
	private $site_kit_configuration;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter The adapter.
	 * @param Site_Kit                        $site_kit_configuration          The site kit configuration object.
	 */
	public function __construct(
		Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter,
		Site_Kit $site_kit_configuration
	) {
		$this->site_kit_search_console_adapter = $site_kit_search_console_adapter;
		$this->site_kit_configuration          = $site_kit_configuration;
	}

	/**
	 * Gets the top queries' data.
	 *
	 * @param Parameters $parameters The parameter to use for getting the top queries.
	 *
	 * @throws Data_Source_Not_Available_Exception When this repository is used without the needed prerequisites ready.
	 *
	 * @return Data_Container
	 */
	public function get_data( Parameters $parameters ): Data_Container {
		if ( ! $this->site_kit_configuration->is_onboarded() ) {
			throw new Data_Source_Not_Available_Exception( 'Top queries repository' );
		}

		return $this->site_kit_search_console_adapter->get_data( $parameters );
	}
}
