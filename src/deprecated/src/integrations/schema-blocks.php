<?php

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Conditionals\Schema_Blocks_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;

/**
 * Loads schema block templates into Gutenberg.
 *
 * @deprecated 20.5
 * @codeCoverageIgnore
 */
class Schema_Blocks implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The registered templates.
	 *
	 * @var string[]
	 */
	protected $templates = [];

	/**
	 * Contains the asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Represents the schema blocks conditional.
	 *
	 * @var Schema_Blocks_Conditional
	 */
	protected $blocks_conditional;

	/**
	 * Represents the short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Schema_Blocks constructor.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager      The asset manager.
	 * @param Schema_Blocks_Conditional $blocks_conditional The schema blocks conditional.
	 * @param Short_Link_Helper         $short_link_helper  The short link helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Schema_Blocks_Conditional $blocks_conditional,
		Short_Link_Helper $short_link_helper
	) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		$this->asset_manager      = $asset_manager;
		$this->blocks_conditional = $blocks_conditional;
		$this->short_link_helper  = $short_link_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
	}

	/**
	 * Registers a schema template.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param string $template The template to be registered.
	 *                         If starting with a / is assumed to be an absolute path.
	 *                         If not starting with a / is assumed to be relative to WPSEO_PATH.
	 *
	 * @return void
	 */
	public function register_template( $template ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
	}

	/**
	 * Loads all schema block templates and the required JS library for them.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function load() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
	}

	/**
	 * Outputs the set templates.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function output() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
	}
}
