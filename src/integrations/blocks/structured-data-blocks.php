<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

namespace Yoast\WP\SEO\Integrations\Blocks;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class to load assets required for structured data blocks.
 */
class Structured_Data_Blocks implements Integration_Interface {

	/**
	 * An instance of the WPSEO_Admin_Asset_Manager class.
	 *
	 * @var \WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Structured_Data_Blocks constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The asset manager.
	 */
	public function __construct( WPSEO_Admin_Asset_Manager $asset_manager ) {
		$this->asset_manager = $asset_manager;
	}

	/**
	 * Registers hooks for Structured Data Blocks with WordPress.
	 */
	public function register_hooks() {
		\add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ] );
	}

	/**
	 * Enqueue Gutenberg block assets for backend editor.
	 */
	public function enqueue_block_editor_assets() {
		/**
		 * Filter: 'wpseo_enable_structured_data_blocks' - Allows disabling Yoast's schema blocks entirely.
		 *
		 * @api bool If false, our structured data blocks won't show.
		 */
		if ( ! \apply_filters( 'wpseo_enable_structured_data_blocks', true ) ) {
			return;
		}

		$this->asset_manager->enqueue_script( 'structured-data-blocks' );
		$this->asset_manager->enqueue_style( 'structured-data-blocks' );
	}
}
