<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WP_Post;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Metabox_Analysis_Inclusive_Language;
use WPSEO_Metabox_Analysis_Readability;
use WPSEO_Metabox_Analysis_SEO;
use Yoast\WP\SEO\Conditionals\Admin\Site_Editor_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;

/**
 * Integrates the Yoast SEO metabox in the site editor.
 */
class Site_Editor_Integration implements Integration_Interface {

	/**
	 * Represents the post.
	 *
	 * @var WP_Post|null
	 */
	protected $post;

	/**
	 * Represents the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Represents the options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * Represents the capability helper.
	 *
	 * @var Capability_Helper
	 */
	protected $capability;

	/**
	 * Holds whether the socials are enabled.
	 *
	 * @var bool
	 */
	protected $social_is_enabled;

	/**
	 * Holds whether the advanced settings are enabled.
	 *
	 * @var bool
	 */
	protected $is_advanced_metadata_enabled;

	/**
	 * Helper to determine whether or not the SEO analysis is enabled.
	 *
	 * @var WPSEO_Metabox_Analysis_SEO
	 */
	protected $seo_analysis;

	/**
	 * Helper to determine whether or not the readability analysis is enabled.
	 *
	 * @var WPSEO_Metabox_Analysis_Readability
	 */
	protected $readability_analysis;

	/**
	 * Helper to determine whether or not the inclusive language analysis is enabled.
	 *
	 * @var WPSEO_Metabox_Analysis_Inclusive_Language
	 */
	protected $inclusive_language_analysis;

	/**
	 * Holds the promotion manager.
	 *
	 * @var Promotion_Manager
	 */
	protected $promotion_manager;

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
	 * @param Options_Helper            $options       The options helper.
	 * @param Capability_Helper         $capability    The capability helper.
	 * @param Promotion_Manager         $promotion_manager The promotion manager.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Options_Helper $options,
		Capability_Helper $capability,
		Promotion_Manager $promotion_manager
	) {
		$this->asset_manager     = $asset_manager;
		$this->options           = $options;
		$this->capability        = $capability;
		$this->promotion_manager = $promotion_manager;

		$this->seo_analysis                 = new WPSEO_Metabox_Analysis_SEO();
		$this->readability_analysis         = new WPSEO_Metabox_Analysis_Readability();
		$this->inclusive_language_analysis  = new WPSEO_Metabox_Analysis_Inclusive_Language();
		$this->social_is_enabled            = $this->options->get( 'opengraph', false ) || $this->options->get( 'twitter', false );
		$this->is_advanced_metadata_enabled = $this->capability->current_user_can( 'wpseo_edit_advanced_metadata' ) || $this->options->get( 'disableadvanced_meta' ) === false;
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
		$this->asset_manager->enqueue_script( 'site-editor' );
	}
}
