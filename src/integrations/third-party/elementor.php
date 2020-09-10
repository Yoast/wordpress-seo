<?php

namespace Yoast\WP\SEO\Integrations;

use WP_Post;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Metabox;
use WPSEO_Utils;
use Yoast\WP\SEO\Conditionals\Admin\Elementor_Edit_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Admin\Meta_Fields_Presenter;

/**
 * Adds customizations to the front end for breadcrumbs.
 */
class Elementor_Integration implements Integration_Interface {

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
	 * Represents the metabox.
	 *
	 * @var WPSEO_Metabox
	 */
	protected $metabox;

	/**
	 * Represents the options helper.
	 *
	 * @var \Yoast\WP\SEO\Helpers\Options_Helper
	 */
	protected $options;

	/**
	 * Represents the capability helper.
	 *
	 * @var \Yoast\WP\SEO\Helpers\Capability_Helper
	 */
	protected $capability;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Elementor_Edit_Conditional::class ];
	}

	/**
	 * Constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The asset manager.
	 * @param Options_Helper            $options       The options helper.
	 * @param Capability_Helper         $capability    The capability helper.
	 */
	public function __construct( WPSEO_Admin_Asset_Manager $asset_manager, Options_Helper $options, Capability_Helper $capability ) {
		$this->asset_manager = $asset_manager;
		$this->options       = $options;
		$this->capability    = $capability;
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
		$this->metabox->enqueue( 'post.php', true );
		echo $this->render_hidden_fields();
		echo '<div id="wpseo_meta"></div>';
	}

	/**
	 * Renders the metabox hidden fields.
	 *
	 * @return string The hidden fields.
	 */
	protected function render_hidden_fields() {
		$social_is_enabled            = $this->options->get( 'opengraph', false ) || $this->options->get( 'twitter', false );
		$is_advanced_metadata_enabled = $this->capability->current_user_can( 'wpseo_edit_advanced_metadata' ) || $this->options->get( 'disableadvanced_meta' ) === false;

		$html = \wp_nonce_field( 'yoast_free_metabox', 'yoast_free_metabox_nonce', true, false );
		$html .= new Meta_Fields_Presenter( $this->get_metabox_post(), 'general' );

		if ( $is_advanced_metadata_enabled ) {
			$html .= new Meta_Fields_Presenter( $this->get_metabox_post(), 'advanced' );
		}

		$html .= new Meta_Fields_Presenter( $this->get_metabox_post(), 'schema', $this->get_metabox_post()->post_type );

		if ( $social_is_enabled ) {
			$html .= new Meta_Fields_Presenter( $this->get_metabox_post(), 'social' );
		}

		/**
		 * Filter: 'wpseo_content_meta_section_content' - Allow filtering the metabox content before outputting.
		 *
		 * @api string $post_content The metabox content string.
		 */
		$html .= \apply_filters( 'wpseo_content_meta_section_content', '' );

		return $html;
	}

	/**
	 * Returns post in metabox context.
	 *
	 * @returns WP_Post|null
	 */
	protected function get_metabox_post() {
		if ( $this->post !== null ) {
			return $this->post;
		}

		$post = filter_input( INPUT_GET, 'post' );
		if ( ! empty( $post ) ) {
			$post_id = (int) WPSEO_Utils::validate_int( $post );

			$this->post = get_post( $post_id );

			return $this->post;
		}

		if ( isset( $GLOBALS['post'] ) ) {
			$this->post = $GLOBALS['post'];

			return $this->post;
		}

		return null;
	}
}
