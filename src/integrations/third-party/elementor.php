<?php

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Language_Utils;
use WPSEO_Metabox;
use Yoast\WP\SEO\Conditionals\No_Conditionals;

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
	 * Represents the metabox.
	 *
	 * @var WPSEO_Metabox
	 */
	protected $metabox;

	/**
	 * Constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The asset manager.
	 */
	public function __construct( WPSEO_Admin_Asset_Manager $asset_manager ) {
		$this->asset_manager = $asset_manager;
		$this->metabox       = new WPSEO_Metabox();
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'init' ] );
	}

	/**
	 * Renders the breadcrumbs.
	 *
	 * @return string The rendered breadcrumbs.
	 */
	public function init() {
		$this->asset_manager->register_assets();
		// @TODO: Prevent post-edit script enqueue.
		$this->metabox->enqueue( true );
//		$this->asset_manager->enqueue_script( 'elementor' );
	}
}
