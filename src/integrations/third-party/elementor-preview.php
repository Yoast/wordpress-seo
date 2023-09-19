<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Elementor integration on the preview.
 */
class Elementor_Preview implements Integration_Interface {

	/**
	 * Represents the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * ElementorPreview constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The asset manager.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager
	) {
		$this->asset_manager = $asset_manager;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return string[]
	 */
	public static function get_conditionals() {
		return [ Elementor_Activated_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'elementor/preview/enqueue_styles', [ $this, 'add_preview_styles' ] );
	}

	/**
	 * Adds CSS specifically for the Elementor preview.
	 *
	 * @return void
	 */
	public function add_preview_styles() {
		$this->asset_manager->register_assets();
		$this->asset_manager->enqueue_style( 'inside-editor' );
	}
}
