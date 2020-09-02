<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use WPSEO_Admin_Asset_Manager;

/**
 * Adds customizations to the front end for breadcrumbs.
 */
class Elementor_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * Represents the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager             The asset manager.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager
	) {
		$this->asset_manager             = $asset_manager;
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public function register_hooks() {
		// $this->asset_manager->register_assets();
		\add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'init' ] );
		// \add_action( 'elementor/init', [ $this, 'init' ] );
	}
	
	/**
	 * Renders the breadcrumbs.
	 *
	 * @return string The rendered breadcrumbs.
	 */
	public function init() {
		$this->asset_manager->register_assets();
		$this->asset_manager->enqueue_script( 'elementor' );
		// \wp_enqueue_script( 'yoast_elementor', '/wp-content/plugins/wordpress-seo/js/src/elementor.js' );
	}
}
