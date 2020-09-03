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
		$this->metabox->enqueue();
		$this->asset_manager->enqueue_script( 'elementor' );
	}

	public function localizeScriptData() {
		$script_data = [
			'analysis'         => [
				'plugins' => [
					'shortcodes' => [
						'wpseo_filter_shortcodes_nonce' => wp_create_nonce( 'wpseo-filter-shortcodes' ),
						'wpseo_shortcode_tags'          => $this->get_valid_shortcode_tags(),
					],
				],
			],
			'metabox'          => $this->metabox->get_metabox_script_data(),
			'userLanguageCode' => WPSEO_Language_Utils::get_language( WPSEO_Language_Utils::get_user_locale() ),
			'isPost'           => true,
			'isBlockEditor'    => false,
		];

		if ( post_type_supports( get_post_type(), 'thumbnail' ) ) {
			$this->asset_manager->enqueue_style( 'featured-image' );

			// @todo replace this translation with JavaScript translations.
			$script_data['featuredImage'] = [
				'featured_image_notice' => __( 'SEO issue: The featured image should be at least 200 by 200 pixels to be picked up by Facebook and other social media sites.', 'wordpress-seo' ),
			];
		}

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'elementor', 'wpseoScriptData', $script_data );
	}

	/**
	 * Returns an array with shortcode tags for all registered shortcodes.
	 *
	 * @return array
	 */
	private function get_valid_shortcode_tags() {
		$shortcode_tags = [];

		foreach ( $GLOBALS['shortcode_tags'] as $tag => $description ) {
			$shortcode_tags[] = $tag;
		}

		return $shortcode_tags;
	}
}
