<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\AIOSEO_V4_Importer_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

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
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [
			AIOSEO_V4_Importer_Conditional::class,
			Yoast_Tools_Page_Conditional::class,
		];
	}

	/**
	 * Import Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager      $asset_manager        The asset manager.
	 * @param AIOSEO_V4_Importer_Conditional $importer_conditional The AIOSEO V4 Importer conditional.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		AIOSEO_V4_Importer_Conditional $importer_conditional
	) {
		$this->asset_manager        = $asset_manager;
		$this->importer_conditional = $importer_conditional;
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
		$this->asset_manager->enqueue_script( 'import' );
	}
}
