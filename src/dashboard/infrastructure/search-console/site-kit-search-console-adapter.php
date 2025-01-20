<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console;

use Google\Site_Kit\Core\Modules\Module;
use Google\Site_Kit\Core\Modules\Modules;
use Google\Site_Kit\Modules\Search_Console;
use Google\Site_Kit\Plugin;
use Google\Site_Kit_Dependencies\Google\Service\SearchConsole\ApiDataRow;
use WP_Error;

/**
 * The site API adapter to make calls via the Site_Kit plugin.
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
	 * The wrapper method to add our parameters to a Site Kit API request.
	 *
	 * @param Search_Console_Parameters $parameters The parameters.
	 *
	 * @return ApiDataRow[]|WP_Error Data on success, or WP_Error on failure.
	 */
	public function get_data( Search_Console_Parameters $parameters ) {
		$api_parameters = [
			'slug'       => 'search-console',
			'datapoint'  => 'searchanalytics',
			'startDate'  => $parameters->get_start_date(),
			'endDate'    => $parameters->get_end_date(),
			'limit'      => $parameters->get_limit(),
			'dimensions' => $parameters->get_dimensions(),
		];

		return self::$search_console_module->get_data( 'searchanalytics', $api_parameters );
	}
}
