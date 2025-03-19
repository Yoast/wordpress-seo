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
use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Comparison_Search_Ranking_Data;
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
	 * Sets the search console module. Used for tests.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Module $module The search console module.
	 *
	 * @return void
	 */
	public static function set_search_console_module( $module ): void {
		self::$search_console_module = $module;
	}

	/**
	 * Gets the search console module. Used for tests.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return Module The search console module.
	 */
	public static function get_search_console_module() {
		return self::$search_console_module;
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
		$api_parameters = $this->build_parameters( $parameters );

		$response = self::$search_console_module->get_data( 'searchanalytics', $api_parameters );

		$this->validate_response( $response );

		return $this->parse_response( $response );
	}

	/**
	 * The wrapper method to do a comparison Site Kit API request for Search Console.
	 *
	 * @param Search_Console_Parameters $parameters The parameters.
	 *
	 * @return Data_Container The Site Kit API response.
	 *
	 * @throws Failed_Request_Exception      When the request responds with an error from Site Kit.
	 * @throws Unexpected_Response_Exception When the request responds with an unexpected format.
	 */
	public function get_comparison_data( Search_Console_Parameters $parameters ): Data_Container {
		$api_parameters = $this->build_parameters( $parameters );

		// Since we're doing a comparison request, we need to increase the date range to the start of the previous period. We'll later split the data into two periods.
		$api_parameters['startDate'] = $parameters->get_compare_start_date();

		$response = self::$search_console_module->get_data( 'searchanalytics', $api_parameters );

		$this->validate_response( $response );

		return $this->parse_comparison_response( $response, $parameters->get_compare_end_date() );
	}

	/**
	 * Builds the parameters to be used in the Site Kit API request.
	 *
	 * @param Search_Console_Parameters $parameters The parameters.
	 *
	 * @return array<string, array<string, string>> The Site Kit API parameters.
	 */
	private function build_parameters( Search_Console_Parameters $parameters ): array {
		$api_parameters = [
			'slug'       => 'search-console',
			'datapoint'  => 'searchanalytics',
			'startDate'  => $parameters->get_start_date(),
			'endDate'    => $parameters->get_end_date(),
			'dimensions' => $parameters->get_dimensions(),
		];

		if ( $parameters->get_limit() !== 0 ) {
			$api_parameters['limit'] = $parameters->get_limit();
		}

		return $api_parameters;
	}

	/**
	 * Parses a response for a comparison Site Kit API request for Search Analytics.
	 *
	 * @param ApiDataRow[] $response         The response to parse.
	 * @param string       $compare_end_date The compare end date.
	 *
	 * @return Data_Container The parsed comparison Site Kit API response.
	 *
	 * @throws Unexpected_Response_Exception When the comparison request responds with an unexpected format.
	 */
	private function parse_comparison_response( array $response, ?string $compare_end_date ): Data_Container {
		$data_container                 = new Data_Container();
		$comparison_search_ranking_data = new Comparison_Search_Ranking_Data();

		foreach ( $response as $ranking_date ) {

			if ( ! \is_a( $ranking_date, ApiDataRow::class ) ) {
				throw new Unexpected_Response_Exception();
			}

			$ranking_data = new Search_Ranking_Data( $ranking_date->getClicks(), $ranking_date->getCtr(), $ranking_date->getImpressions(), $ranking_date->getPosition(), $ranking_date->getKeys()[0] );

			// Now split the data into two periods.
			if ( $ranking_date->getKeys()[0] <= $compare_end_date ) {
				$comparison_search_ranking_data->add_previous_traffic_data( $ranking_data );
			}
			else {
				$comparison_search_ranking_data->add_current_traffic_data( $ranking_data );
			}
		}

		$data_container->add_data( $comparison_search_ranking_data );

		return $data_container;
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
	private function parse_response( array $response ): Data_Container {
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

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- We have no control over the response (in fact that's why this function exists).

	/**
	 * Validates the response coming from Search Console.
	 *
	 * @param mixed $response The response we want to validate.
	 *
	 * @return void.
	 *
	 * @throws Failed_Request_Exception      When the request responds with an error from Site Kit.
	 * @throws Unexpected_Response_Exception When the request responds with an unexpected format.
	 */
	private function validate_response( $response ): void {
		if ( \is_wp_error( $response ) ) {
			$error_data        = $response->get_error_data();
			$error_status_code = ( $error_data['status'] ?? 500 );
			throw new Failed_Request_Exception( \wp_kses_post( $response->get_error_message() ), (int) $error_status_code );
		}

		if ( ! \is_array( $response ) ) {
			throw new Unexpected_Response_Exception();
		}
	}

	// phpcs:enable
}
