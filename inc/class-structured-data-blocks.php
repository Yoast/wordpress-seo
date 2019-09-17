<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class to load assets required for structured data blocks.
 */
class WPSEO_Structured_Data_Blocks implements WPSEO_WordPress_Integration {
	/**
	 * An instance of the WPSEO_Admin_Asset_Manager class.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Registers hooks for Structured Data Blocks with WordPress.
	 */
	public function register_hooks() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		add_filter( 'block_categories', array( $this, 'add_block_category' ) );
	}

	/**
	 * Checks whether the Structured Data Blocks are disabled.
	 *
	 * @return boolean
	 */
	private function check_enabled() {
		/**
		 * Filter: 'wpseo_enable_structured_data_blocks' - Allows disabling Yoast's schema blocks entirely.
		 *
		 * @api bool If false, our structured data blocks won't show.
		 */
		$enabled = apply_filters( 'wpseo_enable_structured_data_blocks', true );

		return $enabled;
	}

	/**
	 * Enqueue Gutenberg block assets for backend editor.
	 */
	public function enqueue_block_editor_assets() {
		if ( ! $this->check_enabled() ) {
			return;
		}

		if ( ! $this->asset_manager ) {
			$this->asset_manager = new WPSEO_Admin_Asset_Manager();
		}

		$this->asset_manager->enqueue_script( 'structured-data-blocks' );
		$this->asset_manager->enqueue_style( 'structured-data-blocks' );
	}

	/**
	 * Adds the structured data blocks category to the Gutenberg categories.
	 *
	 * @param array $categories The current categories.
	 *
	 * @return array The updated categories.
	 */
	public function add_block_category( $categories ) {
		if ( $this->check_enabled() ) {
			$categories[] = array(
				'slug'  => 'yoast-structured-data-blocks',
				'title' => sprintf(
				/* translators: %1$s expands to Yoast. */
					__( '%1$s Structured Data Blocks', 'wordpress-seo' ),
					'Yoast'
				),
			);
		}

		return $categories;
	}
}
