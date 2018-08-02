<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class to load assets required for structured data blocks.
 */
class WPSEO_Structured_Data_Blocks {
	/**
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * WPSEO_Structured_Data_Blocks constructor.
	 */
	public function __construct() {
		$this->asset_manager = new WPSEO_Admin_Asset_Manager();

		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		add_filter( 'block_categories', array( $this, 'add_block_category' ) );
	}

	/**
	 * Enqueue Gutenberg block assets for backend editor.
	 */
	public function enqueue_block_editor_assets() {
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
		$categories[] = array(
			'slug'  => 'yoast-structured-data-blocks',
			'title' => __( 'Structured Data Blocks', 'wordpress-seo' ),
		);

		return $categories;
	}
}
