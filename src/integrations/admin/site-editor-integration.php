<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Metabox;
use WPSEO_Meta_Columns;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin\Site_Editor_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;


/**
 * Integrates the Yoast SEO metabox in the site editor.
 */
class Site_Editor_Integration implements Integration_Interface {

	/**
	 * Represents the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Site_Editor_Conditional::class ];
	}

	/**
	 * Constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The asset manager.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
	) {
		$this->asset_manager = $asset_manager;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ] );
	}

	/**
	 * Enqueue Gutenberg block assets for backend editor.
	 */
	public function enqueue_block_editor_assets() {
		$this->asset_manager->enqueue_script( 'block-editor' );
        global $post;
        $post_id =2;
        $post = get_post($post_id); 
        setup_postdata($post);
        
        
        $GLOBALS['wpseo_metabox']      = new WPSEO_Metabox();
		$GLOBALS['wpseo_meta_columns'] = new WPSEO_Meta_Columns();
	}
}
