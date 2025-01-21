<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Google_Analytics;

use Google\Site_Kit\Core\Modules\Module;
use Google\Site_Kit\Core\Modules\Modules;
use Google\Site_Kit\Modules\Search_Console;
use Google\Site_Kit\Plugin;
use Google\Site_Kit_Dependencies\Google\Service\SearchConsole\ApiDataRow;
use WP_Error;

/**
 * The site API adapter to make calls via the Site_Kit plugin.
 */
class Site_Kit_Google_Analytics_Adapter {

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
	 * The wrapper method to add our parameters to a Site Kit API request.
	 *
	 * @param Google_Analytics_Parameters $parameters The parameters.
	 *
	 * @return ApiDataRow[]|WP_Error Data on success, or WP_Error on failure.
	 */
	public function get_data( Google_Analytics_Parameters $parameters ) {
		$api_parameters = [
			'slug'             => "analytics-4",
			'datapoint'        => 'report',
			'startDate'        => $parameters->get_start_date(),
			'endDate'          => $parameters->get_end_date(),
			'limit'            => $parameters->get_limit(),
			'dimensionFilters' => $parameters->get_dimension_filters(),
			'metrics'          => [ $parameters->get_metrics() ],
		];

		return self::$search_console_module->get_data( 'report', $api_parameters );
	}
}
