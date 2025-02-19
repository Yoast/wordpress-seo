<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console;

use Google\Site_Kit\Core\Modules\Module;
use Google\Site_Kit\Core\Modules\Modules;
use Google\Site_Kit\Modules\Search_Console;
use Google\Site_Kit\Plugin;
use Google\Site_Kit_Dependencies\Google\Service\SearchConsole\ApiDataRow;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Search_Console\Failed_Request_Exception;
use Yoast\WP\SEO\Dashboard\Domain\Search_Console\Unexpected_Response_Exception;
use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Search_Ranking_Data;

/**
 * The site API adapter to make calls to the Search Console API, via the Site_Kit plugin.
 */
class Site_Kit_Search_Console_Adapter {

	/**
	 * The search console module class from Site kit.
	 *
	 * @var Module
	 */
	private static $search_console_module;

	/**
	 * The register method that sets the instance in the adapter.
	 *
	 * @return void
	 */
	public function __construct() {
		if ( \class_exists( 'Google\Site_Kit\Plugin' ) ) {
			$site_kit_plugin             = Plugin::instance();
			$modules                     = new Modules( $site_kit_plugin->context() );
			self::$search_console_module = $modules->get_module( Search_Console::MODULE_SLUG );
		}
	}

	/**
	 * The wrapper method to do a Site Kit API request for Search Console.
	 *
	 * @param Search_Console_Parameters $parameters The parameters.
	 *
	 * @return Data_Container The Site Kit API response.
	 *
	 * @throws Failed_Request_Exception      When the request responds with an error from Site Kit.
	 * @throws Unexpected_Response_Exception When the request responds with an unexpected format.
	 */
	public function get_data( Search_Console_Parameters $parameters ): Data_Container {
		$api_parameters = [
			'slug'       => 'search-console',
			'datapoint'  => 'searchanalytics',
			'startDate'  => $parameters->get_start_date(),
			'endDate'    => $parameters->get_end_date(),
			'limit'      => $parameters->get_limit(),
			'dimensions' => $parameters->get_dimensions(),
		];

		$response = self::$search_console_module->get_data( 'searchanalytics', $api_parameters );

		if ( \is_wp_error( $response ) ) {
			$error_data        = $response->get_error_data();
			$error_status_code = ( $error_data['status'] ?? 500 );
			throw new Failed_Request_Exception( \wp_kses_post( $response->get_error_message() ), (int) $error_status_code );
		}

		if ( ! \is_array( $response ) ) {
			throw new Unexpected_Response_Exception();
		}

		return $this->parse_response( $response );
	}

	/**
	 * Parses a response for a Site Kit API request for Search Analytics.
	 *
	 * @param ApiDataRow[] $response The response to parse.
	 *
	 * @return Data_Container The parsed Site Kit API response.
	 *
	 * @throws Unexpected_Response_Exception When the request responds with an unexpected format.
	 */
	protected function parse_response( array $response ): Data_Container {
		$search_ranking_data_container = new Data_Container();

		foreach ( $response as $ranking ) {

			if ( ! \is_a( $ranking, ApiDataRow::class ) ) {
				throw new Unexpected_Response_Exception();
			}

			/**
			 * Filter: 'wpseo_transform_dashboard_subject_for_testing' - Allows overriding subjects like URLs for the dashboard, to facilitate testing in local environments.
			 *
			 * @internal
			 *
			 * @param string $url The subject to be transformed.
			 */
			$subject = \apply_filters( 'wpseo_transform_dashboard_subject_for_testing', $ranking->getKeys()[0] );

			$search_ranking_data_container->add_data( new Search_Ranking_Data( $ranking->getClicks(), $ranking->getCtr(), $ranking->getImpressions(), $ranking->getPosition(), $subject ) );
		}

		return $search_ranking_data_container;
	}
}
