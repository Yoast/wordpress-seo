<?php
/**
 * @package WPSEO\Premium|Classes
 */

/**
 * The metabox for premium
 */
class WPSEO_Premium_Metabox implements WPSEO_WordPress_Integration {

	/**
	 * @var WPSEO_Metabox_Link_Suggestions
	 */
	protected $link_suggestions;

	/**
	 * Creates the meta box class.
	 *
	 * @param WPSEO_Metabox_Link_Suggestions|null $link_suggestions The link suggestions meta box.
	 */
	public function __construct( WPSEO_Metabox_Link_Suggestions $link_suggestions = null ) {
		if ( $link_suggestions === null ) {
			$link_suggestions = new WPSEO_Metabox_Link_Suggestions();
		}

		$this->link_suggestions = $link_suggestions;
	}

	/**
	 * Registers relevant hooks to WordPress
	 */
	public function register_hooks() {
		add_action( 'admin_init', array( $this, 'register_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		$this->link_suggestions->register_hooks();
	}

	/**
	 * Registers assets to WordPress
	 */
	public function register_assets() {
		wp_register_script(
			WPSEO_Admin_Asset_Manager::PREFIX . 'premium-metabox',
			plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/dist/wp-seo-premium-metabox-450' . WPSEO_CSSJS_SUFFIX . '.js',
			array( 'jquery', 'wp-util', 'underscore' ),
			WPSEO_VERSION
		);
		wp_register_style( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-metabox', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/css/dist/premium-metabox-440' . WPSEO_CSSJS_SUFFIX . '.css', array(), WPSEO_VERSION );
	}

	/**
	 * Enqueues assets when relevant
	 */
	public function enqueue_assets() {
		if ( WPSEO_Metabox::is_post_edit( $GLOBALS['pagenow'] ) ) {
			wp_enqueue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-metabox' );
			wp_enqueue_style( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-metabox' );

			$this->send_data_to_assets();
		}
	}

	/**
	 * Send data to assets by using wp_localize_script.
	 */
	public function send_data_to_assets() {
		$options = WPSEO_Options::get_option( 'wpseo' );
		$insights_enabled = ( isset( $options['enable_metabox_insights'] ) && $options['enable_metabox_insights'] );
		$link_suggestions_enabled = ( isset( $options['enable_link_suggestions'] ) && $options['enable_link_suggestions'] );

		$language_support = new WPSEO_Premium_Prominent_Words_Language_Support();

		if ( ! $language_support->is_language_supported( WPSEO_Utils::get_language( get_locale() ) ) ) {
			$insights_enabled = false;
			$link_suggestions_enabled = false;
		}

		$post = $this->get_post();
		$post_type = get_post_type_object( $post->post_type );

		$rest_base = isset( $post_type->rest_base ) ? $post_type->rest_base : '';

		$data = array(
			'insightsEnabled' => ( $insights_enabled ) ? 'enabled' : 'disabled',
			'postID' => $this->get_post_ID(),
			'restApi' => array(
				'available' => WPSEO_Utils::is_api_available(),
				'contentEndpointsAvailable' => WPSEO_Utils::are_content_endpoints_available(),
				'root' => esc_url_raw( rest_url() ),
				'nonce' => wp_create_nonce( 'wp_rest' ),
				'postTypeBase' => $rest_base,
			),
			'linkSuggestionsEnabled' => ( $link_suggestions_enabled ) ? 'enabled' : 'disabled',
			'linkSuggestionsAvailable' => $this->link_suggestions->is_available( $post->post_type ),
			'linkSuggestionsUnindexed' => $this->link_suggestions->is_site_unindexed() && current_user_can( 'manage_options' ),
			'linkSuggestions' => $this->link_suggestions->get_js_data(),
		);

		// Use an extra level in the array to preserve booleans. WordPress sanitizes scalar values in the first level of the array.
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-metabox', 'wpseoPremiumMetaboxData', array( 'data' => $data ) );
	}

	/**
	 * Returns the post for the current admin page.
	 *
	 * @return WP_Post The post for the current admin page.
	 */
	protected function get_post() {
		return get_post( $this->get_post_ID() );
	}

	/**
	 * Retrieves the post ID from the globals
	 *
	 * @return {int} The post ID.
	 */
	protected function get_post_ID() {
		return $GLOBALS['post_ID'];
	}
}
