<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console;

use Google\Site_Kit\Core\Modules\Module;
use Google\Site_Kit\Core\Modules\Modules;
use Google\Site_Kit\Modules\Search_Console;
use Google\Site_Kit\Plugin;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Search_Console\Failed_Request_Exception;
use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Search_Data;

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
	 * @return Data_Container The Site Kit API response.
	 *
	 * @throws Failed_Request_Exception When the query of getting score results fails.
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

		$data_rows = self::$search_console_module->get_data( 'searchanalytics', $api_parameters );

		if ( \is_wp_error( $data_rows ) ) {
			$error_data        = $data_rows->get_error_data();
			$error_status_code = ( $error_data['status'] ?? 500 );
			throw new Failed_Request_Exception( \wp_kses_post( $data_rows->get_error_message() ), (int) $error_status_code );
		}

		$search_data_container = new Data_Container();
		foreach ( $data_rows as $ranking ) {
			/**
			 * Filter: 'wpseo_transform_dashboard_subject_for_testing' - Allows overriding subjects like URLs for the dashboard, to facilitate testing in local environments.
			 *
			 * @internal
			 *
			 * @param string $url The subject to be transformed.
			 */
			$subject = \apply_filters( 'wpseo_transform_dashboard_subject_for_testing', $ranking->keys[0] );

			$search_data_container->add_data( new Search_Data( $ranking->clicks, $ranking->ctr, $ranking->impressions, $ranking->position, $subject ) );
		}

		return $search_data_container;
	}
}
