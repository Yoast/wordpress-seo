<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4;

use Google\Site_Kit\Core\Modules\Module;
use Google\Site_Kit\Core\Modules\Modules;
use Google\Site_Kit\Modules\Analytics_4;
use Google\Site_Kit\Plugin;
use Yoast\WP\SEO\Dashboard\Domain\Analytics_4\Failed_Request_Exception;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Traffic\Comparison_Traffic_Data;
use Yoast\WP\SEO\Dashboard\Domain\Traffic\Daily_Traffic_Data;
use Yoast\WP\SEO\Dashboard\Domain\Traffic\Traffic_Data;

/**
 * The site API adapter to make calls to the Analytics 4 API, via the Site_Kit plugin.
 */
class Site_Kit_Analytics_4_Adapter {

	/**
	 * The Analytics 4 module class from Site kit.
	 *
	 * @var Module
	 */
	private static $analytics_4_module;

	/**
	 * The register method that sets the instance in the adapter.
	 *
	 * @return void
	 */
	public function __construct() {
		if ( \class_exists( 'Google\Site_Kit\Plugin' ) ) {
			$site_kit_plugin          = Plugin::instance();
			$modules                  = new Modules( $site_kit_plugin->context() );
			self::$analytics_4_module = $modules->get_module( Analytics_4::MODULE_SLUG );
		}
	}

	/**
	 * The wrapper method to do a Site Kit API request for Analytics 4.
	 *
	 * @param Analytics_4_Parameters $parameters The parameters.
	 *
	 * @return Data_Container The Site Kit API response.
	 *
	 * @throws Failed_Request_Exception When the query of getting score results fails.
	 */
	public function get_data( Analytics_4_Parameters $parameters ): Data_Container {
		$api_parameters = $this->build_parameters( $parameters );
		$response       = self::$analytics_4_module->get_data( 'report', $api_parameters );

		if ( \is_wp_error( $response ) ) {
			$error_data        = $response->get_error_data();
			$error_status_code = ( $error_data['status'] ?? 500 );
			throw new Failed_Request_Exception( \wp_kses_post( $response->get_error_message() ), (int) $error_status_code );
		}

		if ( $this->is_comparison_request( $parameters ) ) {
			return $this->parse_comparison_response( $response );

		}

		return $this->parse_response( $response );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint  -- Reason: Parameter comes from Site Kit, no control over it.

	/**
	 * Parses a response for a Site Kit API request for Analytics 4.
	 *
	 * @param mixed $response The response to parse.
	 *
	 * @return Data_Container The parsed response.
	 */
	protected function parse_response( $response ): Data_Container {
		$data_container = new Data_Container();
		$metric         = $response->metricHeaders[0]->name;

		foreach ( $response->rows as $daily_traffic ) {
			$traffic_data = new Traffic_Data();

			if ( $metric === 'sessions' ) {
				// @TODO: Maybe use class methods like getValue() instead of this.
				$traffic_data->set_sessions( (int) $daily_traffic->metricValues[0]->value );
			}
			$data_container->add_data( new Daily_Traffic_Data( $daily_traffic->dimensionValues[0]->value, $traffic_data ) );
		}

		return $data_container;
	}

	/**
	 * Parses a response for a Site Kit API request for Analytics 4 that compares data ranges.
	 *
	 * @param mixed $response The response to parse.
	 *
	 * @return Data_Container The parsed response.
	 */
	protected function parse_comparison_response( $response ): Data_Container {
		$data_container        = new Data_Container();
		$metric                = $response->metricHeaders[0]->name;
		$current_traffic_data  = new Traffic_Data();
		$previous_traffic_data = new Traffic_Data();

		if ( $metric === 'sessions' ) {
			$current_traffic_data->set_sessions( (int) $response->rows[0]->metricValues[0]->value );
			$previous_traffic_data->set_sessions( (int) $response->rows[1]->metricValues[0]->value );
		}

		$data_container->add_data( new Comparison_Traffic_Data( $current_traffic_data, $previous_traffic_data ) );

		return $data_container;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Builds the parameters to be used in the Site Kit API request.
	 *
	 * @param Analytics_4_Parameters $parameters The parameters.
	 *
	 * @return array<string, array<string, string>> The Site Kit API parameters.
	 */
	protected function build_parameters( $parameters ): array {
		$api_parameters = [
			'slug'       => 'analytics-4',
			'datapoint'  => 'report',
			'startDate'  => $parameters->get_start_date(),
			'endDate'    => $parameters->get_end_date(),
		];

		if ( ! empty( $parameters->get_dimension_filters() ) ) {
			$api_parameters['dimensionFilters'] = $parameters->get_dimension_filters();
		}

		if ( ! empty( $parameters->get_dimensions() ) ) {
			$api_parameters['dimensions'] = $parameters->get_dimensions();
		}

		if ( ! empty( $parameters->get_metrics() ) ) {
			$api_parameters['metrics'] = $parameters->get_metrics();
		}

		if ( ! empty( $parameters->get_order_by() ) ) {
			$api_parameters['orderby'] = $parameters->get_order_by();
		}

		if ( ! empty( $parameters->get_compare_start_date() && ! empty( $parameters->get_compare_end_date() ) ) ) {
			$api_parameters['compareStartDate'] = $parameters->get_compare_start_date();
			$api_parameters['compareEndDate']   = $parameters->get_compare_end_date();
		}

		return $api_parameters;
	}

	/**
	 * Builds the parameters to be used in the Site Kit API request.
	 *
	 * @param Analytics_4_Parameters $parameters The parameters.
	 *
	 * @return bool Whether it's a comparison request.
	 */
	protected function is_comparison_request( $parameters ): bool {
		if ( ! empty( $parameters->get_compare_start_date() && ! empty( $parameters->get_compare_end_date() ) ) ) {
			return true;
		}

		return false;
	}
}
