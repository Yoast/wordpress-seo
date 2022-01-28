<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\AIOSEO_V4_Importer_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Conditionals\Import_Tool_Selected_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;
use Yoast\WP\SEO\Services\Importing\Importable_Detector;
use Yoast\WP\SEO\Routes\Importing_Route;

/**
 * Loads import script when on the Tool's page.
 */
class Import_Integration implements Integration_Interface {

	/**
	 * Contains the asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Represents the AIOSEO V4 Importer conditional.
	 *
	 * @var AIOSEO_V4_Importer_Conditional
	 */
	protected $importer_conditional;

	/**
	 * The Importable Detector service.
	 *
	 * @var Importable_Detector
	 */
	protected $importable_detector;

	/**
	 * The Importing Route class.
	 *
	 * @var Importing_Route
	 */
	protected $importing_route;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [
			AIOSEO_V4_Importer_Conditional::class,
			Import_Tool_Selected_Conditional::class,
			Yoast_Tools_Page_Conditional::class,
		];
	}

	/**
	 * Import Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager      $asset_manager        The asset manager.
	 * @param AIOSEO_V4_Importer_Conditional $importer_conditional The AIOSEO V4 Importer conditional.
	 * @param Importable_Detector            $importable_detector  The importable detector.
	 * @param Importing_Route                $importing_route      The importing route.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		AIOSEO_V4_Importer_Conditional $importer_conditional,
		Importable_Detector $importable_detector,
		Importing_Route $importing_route
	) {
		$this->asset_manager        = $asset_manager;
		$this->importer_conditional = $importer_conditional;
		$this->importable_detector  = $importable_detector;
		$this->importing_route      = $importing_route;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_import_script' ] );
	}

	/**
	 * Enqueues the Import script.
	 */
	public function enqueue_import_script() {
		\wp_enqueue_style( 'dashicons' );
		$this->asset_manager->enqueue_script( 'import' );

		$import_failure_alert = $this->get_import_failure_alert();

		$data = [
			'restApi' => [
				'root'                => \esc_url_raw( \rest_url() ),
				'importing_endpoints' => $this->get_importing_endpoints(),
				'nonce'               => \wp_create_nonce( 'wp_rest' ),
			],
			'assets'  => [
				'loading_msg'        => \esc_html__( 'The import can take a long time depending on your site\'s size.', 'wordpress-seo' ),
				'select_placeholder' => \esc_html__( 'Select SEO plugin', 'wordpress-seo' ),
				'no_data_msg'        => \esc_html__( 'No data found from other SEO plugins.', 'wordpress-seo' ),
				'import_failure'     => $import_failure_alert,
				'spinner'            => \admin_url( 'images/loading.gif' ),
			],
		];

		/**
		 * Filter: 'wpseo_importing_data' Filter to adapt the data used in the import process.
		 *
		 * @param array $data The import data to adapt.
		 */
		$data = \apply_filters( 'wpseo_importing_data', $data );

		$this->asset_manager->localize_script( 'import', 'yoastImportData', $data );
	}

	/**
	 * Retrieves a list of the importing endpoints to use.
	 *
	 * @return array The endpoints.
	 */
	protected function get_importing_endpoints() {
		$available_actions   = $this->importable_detector->detect();
		$importing_endpoints = [];

		foreach ( $available_actions as $plugin => $types ) {
			foreach ( $types as $type ) {
				$importing_endpoints[ $plugin ][] = $this->importing_route->get_endpoint( $plugin, $type );
			}
		}

		return $importing_endpoints;
	}

	/**
	 * Gets the import failure alert using the Alert_Presenter.
	 *
	 * @return string The import failure alert.
	 */
	protected function get_import_failure_alert() {
		$content  = \esc_html__( 'Import failed with the following error:', 'wordpress-seo' );
		$content .= '<br/><br/>';
		$content .= \esc_html( '%s' );

		$import_failure_alert = new Alert_Presenter( $content, 'error' );

		return $import_failure_alert->present();
	}
}
