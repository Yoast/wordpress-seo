<?php

namespace Yoast\WP\SEO\Woocommerce_Editor\User_Interface;

use Automattic\WooCommerce\Admin\Features\Features;
use Automattic\WooCommerce\Admin\Features\ProductBlockEditor\BlockRegistry;
use Automattic\WooCommerce\Admin\Features\ProductBlockEditor\ProductTemplates\GroupInterface;
use Automattic\WooCommerce\Utilities\FeaturesUtil;
use WP_Post;
use WP_Screen;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Admin_Recommended_Replace_Vars;
use WPSEO_Language_Utils;
use WPSEO_Metabox_Formatter;
use WPSEO_Plugin_Availability;
use WPSEO_Post_Metabox_Formatter;
use WPSEO_Replace_Vars;
use WPSEO_Utils;
use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Asset_Helper;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\Wincher_Helper;
use Yoast\WP\SEO\Initializers\Initializer_Interface;
use Yoast\WP\SEO\Integrations\Feature_Flag_Integration;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;

/**
 * Initializes our WooCommerce product editor integration.
 *
 * Note: `initialize` needs to have run before the `init` hook with priority 4,
 * otherwise the WooCommerce product post type will not be registered yet.
 */
class Woocommerce_Editor_Initializer implements Initializer_Interface {

	const PAGE = 'wc-admin';

	const ASSET_HANDLE = 'woocommerce-editor';

	const BLOCKS = [
		'seo',
	];

	/**
	 * Holds the Alert_Dismissal_Action.
	 *
	 * @var Alert_Dismissal_Action
	 */
	private $alert_dismissal_action;

	/**
	 * Holds the Asset_Helper.
	 *
	 * @var Asset_Helper
	 */
	private $asset_helper;

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Holds the Capability_Helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the Feature_Flag_Integration.
	 *
	 * @var Feature_Flag_Integration
	 */
	private $feature_flag_integration;

	/**
	 * Holds the Options_Helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Holds the WPSEO_Plugin_Availability.
	 *
	 * @var WPSEO_Plugin_Availability
	 */
	private $plugin_availability;

	/**
	 * Holds the Product_Helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the Promotion_Manager.
	 *
	 * @var Promotion_Manager
	 */
	private $promotion_manager;

	/**
	 * Holds the WPSEO_Admin_Recommended_Replace_Vars.
	 *
	 * @var WPSEO_Admin_Recommended_Replace_Vars
	 */
	private $recommended_replace_vars;

	/**
	 * Holds the WPSEO_Replace_Vars.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * Holds the Short_Link_Helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $shortlink_helper;

	/**
	 * Holds the Wincher_Helper.
	 *
	 * @var Wincher_Helper
	 */
	private $wincher_helper;

	/**
	 * Holds the Wistia_Embed_Permission_Repository.
	 *
	 * @var Wistia_Embed_Permission_Repository
	 */
	private $wistia_embed_permission_repository;

	/**
	 * Constructs Woocommerce_Editor_Integration.
	 *
	 * @param Alert_Dismissal_Action             $alert_dismissal_action             The Alert_Dismissal_Action.
	 * @param Asset_Helper                       $asset_helper                       The Asset_Helper.
	 * @param WPSEO_Admin_Asset_Manager          $asset_manager                      The WPSEO_Admin_Asset_Manager.
	 * @param Capability_Helper                  $capability_helper                  The Capability_Helper.
	 * @param Current_Page_Helper                $current_page_helper                The Current_Page_Helper.
	 * @param Options_Helper                     $options_helper                     The Options_Helper.
	 * @param Product_Helper                     $product_helper                     The Product_Helper.
	 * @param Promotion_Manager                  $promotion_manager                  The Promotion_Manager.
	 * @param WPSEO_Replace_Vars                 $replace_vars                       The WPSEO_Replace_Vars.
	 * @param Short_Link_Helper                  $shortlink_helper                   The Short_Link_Helper.
	 * @param Wincher_Helper                     $wincher_helper                     The Wincher_Helper.
	 * @param Wistia_Embed_Permission_Repository $wistia_embed_permission_repository The
	 *                                                                               Wistia_Embed_Permission_Repository.
	 */
	public function __construct(
		Alert_Dismissal_Action $alert_dismissal_action,
		Asset_Helper $asset_helper,
		WPSEO_Admin_Asset_Manager $asset_manager,
		Capability_Helper $capability_helper,
		Current_Page_Helper $current_page_helper,
		Feature_Flag_Integration $feature_flag_integration,
		Options_Helper $options_helper,
		Product_Helper $product_helper,
		Promotion_Manager $promotion_manager,
		WPSEO_Replace_Vars $replace_vars,
		Short_Link_Helper $shortlink_helper,
		Wincher_Helper $wincher_helper,
		Wistia_Embed_Permission_Repository $wistia_embed_permission_repository
	) {
		$this->alert_dismissal_action             = $alert_dismissal_action;
		$this->asset_helper                       = $asset_helper;
		$this->asset_manager                      = $asset_manager;
		$this->capability_helper                  = $capability_helper;
		$this->current_page_helper                = $current_page_helper;
		$this->feature_flag_integration           = $feature_flag_integration;
		$this->options_helper                     = $options_helper;
		$this->plugin_availability                = new WPSEO_Plugin_Availability();
		$this->product_helper                     = $product_helper;
		$this->promotion_manager                  = $promotion_manager;
		$this->recommended_replace_vars           = new WPSEO_Admin_Recommended_Replace_Vars();
		$this->replace_vars                       = $replace_vars;
		$this->shortlink_helper                   = $shortlink_helper;
		$this->wincher_helper                     = $wincher_helper;
		$this->wistia_embed_permission_repository = $wistia_embed_permission_repository;

	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array The conditionals that must be met to load this.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class, WooCommerce_Conditional::class ];
	}

	/**
	 * Runs this initializer.
	 *
	 * @return void
	 */
	public function initialize() {
		//		\add_filter( 'woocommerce_rest_prepare_product_object', [ $this, 'prepare_product_data' ], 10, 3 );
		//		\add_action( 'woocommerce_rest_insert_product_object', [ $this, 'save_product_data' ], 10, 3 );

		//		global $wp_scripts;
		//		// Loop over all registered scripts.
		//		foreach ( $wp_scripts->registered as $handle => $script ) {
		//			// Check if the handle starts with 'wc-'.
		//			if ( \strpos( $handle, 'wc-' ) !== 0 ) {
		//				continue;
		//			}
		//			var_dump($handle);
		//		}
		//		die;

		// Specific "conditional" checks: current page and feature enabled.
		if ( ! $this->is_on_page() || ! $this->is_product_block_editor_enabled() ) {
			//			return;
		}

		/**
		 * The template area is from the SimpleProductTemplate->get_area(), which is 'product-form'.
		 * The block names are found in SimpleProductTemplate::GROUP_IDS, we are adding our block after the 'general' group.
		 */
		\add_action(
			'woocommerce_block_template_area_product-form_after_add_block_general',
			[ $this, 'add_seo_group' ]
		);

		\add_action( 'admin_init', [ $this, 'register_blocks' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Enqueues all the needed JS and CSS.
	 */
	public function enqueue_assets() {
		$post = $this->get_post();
		if ( ! $post instanceof WP_Post ) {
			return;
		}

		//		\register_post_meta(
		//			'post',
		//			\WPSEO_Meta::$meta_prefix . 'focuskw',
		//			[
		//				'show_in_rest' => true,
		//				'single'       => true,
		//				'type'         => 'string',
		//				'sanitize_callback' => [ \WPSEO_Meta::class, 'sanitize_post_meta' ],
		//				'default' => '',
		//			]
		//		);
		//		var_dump( \apply_filters( "default_post_metadata", [], $post->ID, '', false, 'post' ) );
		//		var_dump( \get_post_meta( $post->ID, '_yoast_wpseo_focuskw', true ) );
		//		die;

		$this->asset_manager->enqueue_script( self::ASSET_HANDLE );
		$this->asset_manager->enqueue_style( 'tailwind' );
		$this->asset_manager->enqueue_style( 'monorepo' );
		//		$this->asset_manager->enqueue_style( 'admin-global' );
		// Needed for the score icons.
		$this->asset_manager->enqueue_style( 'metabox-css' );
		//		$this->asset_manager->enqueue_style( 'scoring' );
		//		$this->asset_manager->enqueue_style( 'admin-css' );
		//		$this->asset_manager->enqueue_style( 'ai-generator' );
		//		$this->asset_manager->enqueue_style( 'featured-image' );
		$this->asset_manager->localize_script( self::ASSET_HANDLE, 'wpseoScriptData', $this->get_script_data( $post ) );
		$this->asset_manager->localize_script( self::ASSET_HANDLE, 'wpseoAdminGlobalL10n', $this->wincher_helper->get_admin_global_links() );
		$this->asset_manager->localize_script( self::ASSET_HANDLE, 'wpseoAdminL10n', $this->get_admin_l10n( $post->post_type ) );
		$this->asset_manager->localize_script( self::ASSET_HANDLE, 'wpseoFeaturesL10n', $this->feature_flag_integration->get_enabled_features() );
	}

	/**
	 * Registers the blocks using the metadata loaded from the `block.json` file.
	 * Behind the scenes, it registers also all assets so they can be enqueued
	 * through the block editor in the corresponding context.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	public function register_blocks() {
		//		\register_post_meta(
		//			'product',
		//			'_yoast_wpseo_focuskw',
		//			[
		//				'show_in_rest' => true,
		//				'single'       => true,
		//				'type'         => 'string',
		//			]
		//		);

		foreach ( self::BLOCKS as $block ) {
			BlockRegistry::get_instance()
				->register_block_type_from_metadata( \WPSEO_PATH . 'packages/js/src/woocommerce-editor/blocks/' . $block );
		}
	}

	/**
	 * Adds our SEO group or tab.
	 *
	 * @param \Automattic\WooCommerce\Admin\Features\ProductBlockEditor\ProductTemplates\GroupInterface $general_group The WC general group.
	 *
	 * @return void
	 */
	public function add_seo_group( GroupInterface $general_group ) {
		$parent = $general_group->get_parent();
		if ( ! $parent ) {
			return;
		}

		$seo_group   = $parent->add_group(
			[
				'id'         => 'seo',
				'order'      => $general_group->get_order() + 5,
				'attributes' => [
					'title' => __( 'SEO', 'wordpress-seo' ),
				],
			]
		);
		$seo_section = $seo_group->add_section(
			[
				'id'         => 'yoast-seo-search-engine-optimization',
				'order'      => 10,
				'attributes' => [
					'title' => __( 'Search engine optimization', 'wordpress-seo' ),
				],
			]
		);
		//		$seo_section->add_block(
		//			[
		//				'id'         => 'yoast-seo-seo-product-text-field',
		//				'blockName'  => 'woocommerce/product-text-field',
		//				'order'      => 10,
		//				'attributes' => [
		//					'name'      => 'yoast-seo-seo-product-text-field',
		//					'autoFocus' => true,
		//					'property'  => 'description',
		//				],
		//			]
		//		);
		$seo_section->add_block(
			[
				'id'         => 'yoast-seo-seo',
				'blockName'  => 'yoast-seo/seo',
				'order'      => 10,
				'attributes' => [],
			]
		);
	}

	/**
	 * Adds our data to the WooCommerce REST API product request.
	 *
	 * @param \WP_REST_Response $response The response.
	 * @param \WC_Data          $data     The data.
	 * @param \WP_REST_Request  $request  The request.
	 *
	 * @return mixed
	 */
	public function prepare_product_data( $response, $data, $request ) {
		$id = $data->get_id();

		$response->data['focuskw'] = \get_post_meta( $id, '_yoast_wpseo_focuskw', true );

		return $response;
	}

	/**
	 * Saves our product data when receiving a WooCommerce REST API product request.
	 *
	 * @param \WC_Data         $data     The data.
	 * @param \WP_REST_Request $request  The request.
	 * @param bool             $creating Whether this is a create or insert request.
	 */
	public function save_product_data( $data, $request, $creating = true ) {
		var_dump( $data );
		var_dump( $request->get_params() );
		die;
	}

	/**
	 * Tries to retrieve the post object.
	 *
	 * @return WP_Post|null
	 */
	private function get_post(): ?WP_Post {
		$post_id = \get_queried_object_id();
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
		if ( empty( $post_id ) && isset( $_GET['path'] ) && \is_string( $_GET['path'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
			$path = \sanitize_text_field( \wp_unslash( $_GET['path'] ) );
			if ( \strpos( $path, '/product/' ) === 0 ) {
				$post_id = (int) WPSEO_Utils::validate_int( \substr( $path, 9 ) );
			}
		}

		return \get_post( $post_id );
	}

	/**
	 * Creates the script data.
	 *
	 * @return array The script data.
	 */
	private function get_script_data( WP_Post $post ): array {
		try {
			$wistia_embed_permission = $this->wistia_embed_permission_repository->get_value_for_user( \get_current_user_id() );
		} catch ( \Exception $e ) {
			$wistia_embed_permission = false;
		}

		return [
			'media'                 => [ 'choose_image' => \__( 'Use Image', 'wordpress-seo' ) ],
			'metabox'               => $this->get_metabox_script_data( $post ),
			'userLanguageCode'      => WPSEO_Language_Utils::get_language( \get_user_locale() ),
			'isPost'                => true,
			'isBlockEditor'         => WP_Screen::get()->is_block_editor(),
			'isElementorEditor'     => false,
			'isWooCommerceActive'   => true,
			'woocommerceUpsell'     => ! $this->plugin_availability->is_active( 'wpseo-woocommerce/wpseo-woocommerce.php' ),
			'postId'                => $post->ID,
			'postStatus'            => $post->post_status,
			'postType'              => $post->post_type,
			'analysis'              => [
				'plugins' => [
					'replaceVars' => [
						'no_parent_text'           => \__( '(no parent)', 'wordpress-seo' ),
						'replace_vars'             => $this->get_replace_vars( $post ),
						'hidden_replace_vars'      => $this->replace_vars->get_hidden_replace_vars(),
						'recommended_replace_vars' => $this->get_recommended_replace_vars( $post ),
						'scope'                    => 'post',
						'has_taxonomies'           => $this->get_post_type_has_taxonomies( $post->post_type ),
					],
					'shortcodes'  => [
						'wpseo_shortcode_tags' => $this->get_valid_shortcode_tags(),
					],
				],
				'worker'  => [
					'url'                     => $this->asset_helper->get_asset_url( 'yoast-seo-analysis-worker' ),
					'dependencies'            => $this->asset_helper->get_dependency_urls_by_handle( 'yoast-seo-analysis-worker' ),
					'keywords_assessment_url' => $this->asset_helper->get_asset_url( 'yoast-seo-used-keywords-assessment' ),
					'log_level'               => WPSEO_Utils::get_analysis_worker_log_level(),
					'enabled_features'        => WPSEO_Utils::retrieve_enabled_features(),
				],
			],
			'dismissedAlerts'       => $this->alert_dismissal_action->all_dismissed(),
			'currentPromotions'     => $this->promotion_manager->get_current_promotions(),
			'usedKeywordsNonce'     => \wp_create_nonce( 'wpseo-keyword-usage-and-post-types' ),
			'linkParams'            => $this->shortlink_helper->get_query_params(),
			'pluginUrl'             => \plugins_url( '', \WPSEO_FILE ),
			'wistiaEmbedPermission' => $wistia_embed_permission,
		];
	}

	/**
	 * Passes variables to js for use with the post-scraper.
	 *
	 * @param WP_Post $post The post object.
	 *
	 * @return array
	 */
	private function get_metabox_script_data( WP_Post $post ): array {
		$post_formatter = new WPSEO_Metabox_Formatter(
			new WPSEO_Post_Metabox_Formatter( $post, [], \get_sample_permalink( $post->ID )[0] )
		);

		$values = $post_formatter->get_values();

		/** This filter is documented in admin/filters/class-cornerstone-filter.php. */
		$post_types = apply_filters( 'wpseo_cornerstone_post_types', \WPSEO_Post_Type::get_accessible_post_types() );
		if ( $values['cornerstoneActive'] && ! in_array( $post->post_type, $post_types, true ) ) {
			$values['cornerstoneActive'] = false;
		}
		if ( $values['semrushIntegrationActive'] && $post->post_type === 'attachment' ) {
			$values['semrushIntegrationActive'] = 0;
		}
		if ( $values['wincherIntegrationActive'] && $post->post_type === 'attachment' ) {
			$values['wincherIntegrationActive'] = 0;
		}

		return $values;
	}

	/**
	 * Prepares the replace vars for localization.
	 *
	 * @param WP_Post $post The post object.
	 *
	 * @return array Replace vars.
	 */
	private function get_replace_vars( WP_Post $post ): array {
		$cached_replacement_vars = [];

		$vars_to_cache = [
			'date',
			'id',
			'sitename',
			'sitedesc',
			'sep',
			'page',
			'currentdate',
			'currentyear',
			'currentmonth',
			'currentday',
			'post_year',
			'post_month',
			'post_day',
			'name',
			'author_first_name',
			'author_last_name',
			'permalink',
			'post_content',
			'category_title',
			'tag',
			'category',
		];

		foreach ( $vars_to_cache as $var ) {
			$cached_replacement_vars[ $var ] = \wpseo_replace_vars( '%%' . $var . '%%', $post );
		}

		// Merge custom replace variables with the WordPress ones.
		return array_merge( $cached_replacement_vars, $this->get_custom_replace_vars( $post ) );
	}

	/**
	 * Gets the custom replace variables for custom taxonomies and fields.
	 *
	 * @param WP_Post $post The post to check for custom taxonomies and fields.
	 *
	 * @return array Array containing all the replacement variables.
	 */
	private function get_custom_replace_vars( WP_Post $post ): array {
		return [
			'custom_fields'     => $this->get_custom_fields_replace_vars( $post ),
			'custom_taxonomies' => $this->get_custom_taxonomies_replace_vars( $post ),
		];
	}

	/**
	 * Gets the custom replace variables for custom fields.
	 *
	 * @param WP_Post $post The post to check for custom fields.
	 *
	 * @return array Array containing all the replacement variables.
	 */
	private function get_custom_fields_replace_vars( WP_Post $post ): array {
		$custom_replace_vars = [];

		// If no post object is passed, return the empty custom_replace_vars array.
		if ( ! \is_object( $post ) ) {
			return $custom_replace_vars;
		}

		$custom_fields = \get_post_custom( $post->ID );

		// If $custom_fields is an empty string or generally not an array, return early.
		if ( ! is_array( $custom_fields ) ) {
			return $custom_replace_vars;
		}

		$meta = \YoastSEO()->meta->for_post( $post->ID );

		if ( ! $meta ) {
			return $custom_replace_vars;
		}

		// Simply concatenate all fields containing replace vars so we can handle them all with a single regex find.
		$replace_vars_fields = \implode(
			' ',
			[
				$meta->presentation->title,
				$meta->presentation->meta_description,
			]
		);

		\preg_match_all( '/%%cf_([A-Za-z0-9_]+)%%/', $replace_vars_fields, $matches );
		$fields_to_include = $matches[1];
		foreach ( $custom_fields as $custom_field_name => $custom_field ) {
			// Skip private custom fields.
			if ( \substr( $custom_field_name, 0, 1 ) === '_' ) {
				continue;
			}

			// Skip custom fields that are not used, new ones will be fetched dynamically.
			if ( ! \in_array( $custom_field_name, $fields_to_include, true ) ) {
				continue;
			}

			// Skip custom field values that are serialized.
			if ( \is_serialized( $custom_field[0] ) ) {
				continue;
			}

			$custom_replace_vars[ $custom_field_name ] = $custom_field[0];
		}

		return $custom_replace_vars;
	}

	/**
	 * Gets the custom replace variables for custom taxonomies.
	 *
	 * @param WP_Post $post The post to check for custom taxonomies.
	 *
	 * @return array Array containing all the replacement variables.
	 */
	private function get_custom_taxonomies_replace_vars( WP_Post $post ): array {
		$taxonomies          = \get_object_taxonomies( $post, 'objects' );
		$custom_replace_vars = [];

		foreach ( $taxonomies as $taxonomy_name => $taxonomy ) {

			if ( \is_string( $taxonomy ) ) { // If attachment, see https://core.trac.wordpress.org/ticket/37368 .
				$taxonomy_name = $taxonomy;
				$taxonomy      = \get_taxonomy( $taxonomy_name );
			}

			if ( $taxonomy->_builtin && $taxonomy->public ) {
				continue;
			}

			$custom_replace_vars[ $taxonomy_name ] = [
				'name'        => $taxonomy->name,
				'description' => $taxonomy->description,
			];
		}

		return $custom_replace_vars;
	}

	/**
	 * Prepares the recommended replace vars for localization.
	 *
	 * @param WP_Post $post The post object.
	 *
	 * @return array Recommended replacement variables.
	 */
	private function get_recommended_replace_vars( WP_Post $post ): array {
		// What is recommended depends on the current context.
		$post_type = $this->recommended_replace_vars->determine_for_post( $post );

		return $this->recommended_replace_vars->get_recommended_replacevars_for( $post_type );
	}

	/**
	 * Determines whether the post type has registered taxonomies.
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return bool Whether the post type has taxonomies.
	 */
	private function get_post_type_has_taxonomies( string $post_type ): bool {
		return ! empty( \get_object_taxonomies( $post_type ) );
	}

	/**
	 * Returns an array with shortcode tags for all registered shortcodes.
	 *
	 * @return array
	 */
	private function get_valid_shortcode_tags(): array {
		$shortcode_tags = [];

		foreach ( $GLOBALS['shortcode_tags'] as $tag => $description ) {
			$shortcode_tags[] = $tag;
		}

		return $shortcode_tags;
	}

	/**
	 * Getter for the Adminl10n array. Applies the wpseo_admin_l10n filter.
	 *
	 * Copied from WPSEO_Utils::get_admin_l10n() and modified to use a post type argument.
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return array The Adminl10n array.
	 */
	private function get_admin_l10n( string $post_type ): array {
		$label_object = \get_post_type_object( $post_type );

		$wpseo_admin_l10n = [
			'displayAdvancedTab'    => $this->capability_helper->current_user_can( 'wpseo_edit_advanced_metadata' ) || ! $this->options_helper->get( 'disableadvanced_meta' ),
			'noIndex'               => (bool) $this->options_helper->get( 'noindex-' . $post_type, false ),
			'isPostType'            => (bool) $post_type,
			'postType'              => $post_type,
			'postTypeNamePlural'    => $label_object->label,
			'postTypeNameSingular'  => $label_object->labels->singular_name,
			'isBreadcrumbsDisabled' => $this->options_helper->get( 'breadcrumbs-enable', false ) !== true && ! \current_theme_supports( 'yoast-seo-breadcrumbs' ),
			// phpcs:ignore Generic.ControlStructures.DisallowYodaConditions -- Bug: squizlabs/PHP_CodeSniffer#2962.
			'isPrivateBlog'         => ( (string) \get_option( 'blog_public' ) ) === '0',
			'news_seo_is_active'    => ( \defined( 'WPSEO_NEWS_FILE' ) ),
		];

		$additional_entries = \apply_filters( 'wpseo_admin_l10n', [] );
		if ( \is_array( $additional_entries ) ) {
			$wpseo_admin_l10n = \array_merge( $wpseo_admin_l10n, $additional_entries );
		}

		return $wpseo_admin_l10n;
	}

	/**
	 * Returns whether the current page is our PAGE.
	 *
	 * @return bool
	 */
	private function is_on_page(): bool {
		return $this->current_page_helper->get_current_yoast_seo_page() === self::PAGE;
	}

	/**
	 * Returns whether the WooCommerce product block editor feature is enabled.
	 *
	 * @return bool
	 */
	private function is_product_block_editor_enabled(): bool {
		if ( ! class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) || ! FeaturesUtil::feature_is_enabled( 'product_block_editor' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Returns whether the product variation management is enabled.
	 *
	 * @return bool
	 */
	private function has_product_variations(): bool {
		if ( ! class_exists( '\Automattic\WooCommerce\Admin\Features\Features' ) || ! Features::is_enabled( 'product-variation-management' ) ) {
			return false;
		}

		return true;
	}
}
