<?php

namespace Yoast\WP\SEO\Integrations;

use Exception;
use WP_Post_Type;
use WP_Taxonomy;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Admin_Editor_Specific_Replace_Vars;
use WPSEO_Admin_Recommended_Replace_Vars;
use WPSEO_Option_Titles;
use WPSEO_Options;
use WPSEO_Replace_Vars;
use WPSEO_Shortlinker;
use WPSEO_Sitemaps_Router;
use Yoast_Notification_Center;
use Yoast\WP\SEO\Actions\Settings_Introduction_Action;
use Yoast\WP\SEO\Conditionals\Settings_Conditional;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;

/**
 * Class Settings_Integration.
 */
class Settings_Integration implements Integration_Interface {

	const PAGE = 'wpseo_page_settings';

	/**
	 * Holds the included WordPress options.
	 *
	 * @var string[]
	 */
	const WP_OPTIONS = [ 'blogdescription' ];

	/**
	 * Holds the allowed option groups.
	 *
	 * @var array
	 */
	const ALLOWED_OPTION_GROUPS = [ 'wpseo', 'wpseo_titles', 'wpseo_social' ];

	/**
	 * Holds the disallowed settings, per option group.
	 *
	 * @var array
	 */
	const DISALLOWED_SETTINGS = [
		'wpseo'        => [
			'myyoast-oauth',
			'semrush_tokens',
			'custom_taxonomy_slugs',
			'zapier_subscription',
			'import_cursors',
			'workouts_data',
			'configuration_finished_steps',
			'importing_completed',
			'wincher_tokens',
			'least_readability_ignore_list',
			'least_seo_score_ignore_list',
			'most_linked_ignore_list',
			'least_linked_ignore_list',
			'indexables_page_reading_list',
		],
		'wpseo_titles' => [
			'company_logo_meta',
			'person_logo_meta',
		],
	];

	/**
	 * Holds the disabled on multisite settings, per option group.
	 *
	 * @var array
	 */
	const DISABLED_ON_MULTISITE_SETTINGS = [
		'wpseo' => [
			'deny_search_crawling',
			'deny_wp_json_crawling',
		],
	];

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Holds the WPSEO_Replace_Vars.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars;

	/**
	 * Holds the Schema_Types.
	 *
	 * @var Schema_Types
	 */
	protected $schema_types;

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * Holds the Post_Type_Helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Holds the Language_Helper.
	 *
	 * @var Language_Helper
	 */
	protected $language_helper;

	/**
	 * Holds the Taxonomy_Helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * Holds the Product_Helper.
	 *
	 * @var Product_Helper
	 */
	protected $product_helper;

	/**
	 * Holds the Woocommerce_Helper.
	 *
	 * @var Woocommerce_Helper
	 */
	protected $woocommerce_helper;

	/**
	 * Holds the Article_Helper.
	 *
	 * @var Article_Helper
	 */
	protected $article_helper;

	/**
	 * Holds the User_Helper.
	 *
	 * @var User_Helper
	 */
	protected $user_helper;

	/**
	 * Holds the Settings_Introduction_Action.
	 *
	 * @var Settings_Introduction_Action
	 */
	protected $settings_introduction_action;

	/**
	 * Constructs Settings_Integration.
	 *
	 * @param WPSEO_Admin_Asset_Manager    $asset_manager                The WPSEO_Admin_Asset_Manager.
	 * @param WPSEO_Replace_Vars           $replace_vars                 The WPSEO_Replace_Vars.
	 * @param Schema_Types                 $schema_types                 The Schema_Types.
	 * @param Current_Page_Helper          $current_page_helper          The Current_Page_Helper.
	 * @param Post_Type_Helper             $post_type_helper             The Post_Type_Helper.
	 * @param Language_Helper              $language_helper              The Language_Helper.
	 * @param Taxonomy_Helper              $taxonomy_helper              The Taxonomy_Helper.
	 * @param Product_Helper               $product_helper               The Product_Helper.
	 * @param Woocommerce_Helper           $woocommerce_helper           The Woocommerce_Helper.
	 * @param Article_Helper               $article_helper               The Article_Helper.
	 * @param User_Helper                  $user_helper                  The User_Helper.
	 * @param Settings_Introduction_Action $settings_introduction_action The Settings_Introduction_Action.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		WPSEO_Replace_Vars $replace_vars,
		Schema_Types $schema_types,
		Current_Page_Helper $current_page_helper,
		Post_Type_Helper $post_type_helper,
		Language_Helper $language_helper,
		Taxonomy_Helper $taxonomy_helper,
		Product_Helper $product_helper,
		Woocommerce_Helper $woocommerce_helper,
		Article_Helper $article_helper,
		User_Helper $user_helper,
		Settings_Introduction_Action $settings_introduction_action
	) {
		$this->asset_manager                = $asset_manager;
		$this->replace_vars                 = $replace_vars;
		$this->schema_types                 = $schema_types;
		$this->current_page_helper          = $current_page_helper;
		$this->taxonomy_helper              = $taxonomy_helper;
		$this->post_type_helper             = $post_type_helper;
		$this->language_helper              = $language_helper;
		$this->product_helper               = $product_helper;
		$this->woocommerce_helper           = $woocommerce_helper;
		$this->article_helper               = $article_helper;
		$this->user_helper                  = $user_helper;
		$this->settings_introduction_action = $settings_introduction_action;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Settings_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Add page.
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_page' ] );
		\add_filter( 'admin_menu', [ $this, 'add_settings_saved_page' ] );

		// Are we saving the settings?
		if ( $this->current_page_helper->get_current_admin_page() === 'options.php' ) {
			// phpcs:disable WordPress.PHP.NoSilencedErrors.Discouraged -- This deprecation will be addressed later.
			$post_action = \filter_input( \INPUT_POST, 'action', @\FILTER_SANITIZE_STRING );
			$option_page = \filter_input( \INPUT_POST, 'option_page', @\FILTER_SANITIZE_STRING );
			// phpcs:enable

			if ( $post_action === 'update' && $option_page === self::PAGE ) {
				\add_action( 'admin_init', [ $this, 'register_setting' ] );
				\add_action( 'in_admin_header', [ $this, 'remove_notices' ], \PHP_INT_MAX );
			}

			return;
		}

		// Are we on the settings page?
		if ( $this->current_page_helper->get_current_yoast_seo_page() === self::PAGE ) {
			\add_action( 'admin_init', [ $this, 'register_setting' ] );
			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
			\add_action( 'in_admin_header', [ $this, 'remove_notices' ], \PHP_INT_MAX );

			// Remove the post types and taxonomies made public notifications (if any).
			$this->remove_post_types_made_public_notification();
			$this->remove_taxonomies_made_public_notification();
		}
	}

	/**
	 * Registers the different options under the setting.
	 *
	 * @return void
	 */
	public function register_setting() {
		foreach ( WPSEO_Options::$options as $name => $instance ) {
			if ( \in_array( $name, self::ALLOWED_OPTION_GROUPS, true ) ) {
				\register_setting( self::PAGE, $name );
			}
		}
		// Only register WP options when the user is allowed to manage them.
		if ( \current_user_can( 'manage_options' ) ) {
			foreach ( self::WP_OPTIONS as $name ) {
				\register_setting( self::PAGE, $name );
			}
		}
	}

	/**
	 * Adds the page.
	 *
	 * @param array $pages The pages.
	 *
	 * @return array The pages.
	 */
	public function add_page( $pages ) {
		\array_splice(
			$pages,
			1,
			0,
			[
				[
					'wpseo_dashboard',
					'',
					\__( 'Settings', 'wordpress-seo' ),
					'wpseo_manage_options',
					self::PAGE,
					[ $this, 'display_page' ],
				],
			]
		);

		return $pages;
	}

	/**
	 * Adds a dummy page.
	 *
	 * Because the options route NEEDS to redirect to something.
	 *
	 * @param array $pages The pages.
	 *
	 * @return array The pages.
	 */
	public function add_settings_saved_page( $pages ) {
		\add_submenu_page(
			'',
			'',
			'',
			'wpseo_manage_options',
			self::PAGE . '_saved',
			static function () {
				// Add success indication to HTML response.
				$success = empty( \get_settings_errors() ) ? 'true' : 'false';
				echo \esc_html( "{{ yoast-success: $success }}" );
			}
		);

		return $pages;
	}

	/**
	 * Displays the page.
	 */
	public function display_page() {
		echo '<div id="yoast-seo-settings"></div>';
	}

	/**
	 * Enqueues the assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		// Remove the emoji script as it is incompatible with both React and any contenteditable fields.
		\remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		\wp_enqueue_media();
		$this->asset_manager->enqueue_script( 'new-settings' );
		$this->asset_manager->enqueue_style( 'new-settings' );
		$this->asset_manager->localize_script( 'new-settings', 'wpseoScriptData', $this->get_script_data() );
	}

	/**
	 * Removes all current WP notices.
	 *
	 * @return void
	 */
	public function remove_notices() {
		\remove_all_actions( 'admin_notices' );
		\remove_all_actions( 'user_admin_notices' );
		\remove_all_actions( 'network_admin_notices' );
		\remove_all_actions( 'all_admin_notices' );
	}

	/**
	 * Creates the script data.
	 *
	 * @return array The script data.
	 */
	protected function get_script_data() {
		$default_setting_values = $this->get_default_setting_values();
		$settings               = $this->get_settings( $default_setting_values );
		$post_types             = $this->post_type_helper->get_indexable_post_type_objects();
		$taxonomies             = $this->taxonomy_helper->get_indexable_taxonomy_objects();

		$transformed_post_types = $this->transform_post_types( $post_types );
		$transformed_taxonomies = $this->transform_taxonomies( $taxonomies, \array_keys( $transformed_post_types ) );

		return [
			'settings'             => $this->transform_settings( $settings ),
			'defaultSettingValues' => $default_setting_values,
			'disabledSettings'     => $this->get_disabled_settings( $settings ),
			'endpoint'             => \admin_url( 'options.php' ),
			'nonce'                => \wp_create_nonce( self::PAGE . '-options' ),
			'separators'           => WPSEO_Option_Titles::get_instance()->get_separator_options_for_display(),
			'replacementVariables' => $this->get_replacement_variables(),
			'schema'               => $this->get_schema( $transformed_post_types ),
			'preferences'          => $this->get_preferences( $settings ),
			'linkParams'           => WPSEO_Shortlinker::get_query_params(),
			'postTypes'            => $transformed_post_types,
			'taxonomies'           => $transformed_taxonomies,
			'fallbacks'            => $this->get_fallbacks(),
			'introduction'         => $this->get_introduction_data(),
		];
	}

	/**
	 * Retrieves the preferences.
	 *
	 * @param array $settings The settings.
	 *
	 * @return array The preferences.
	 */
	protected function get_preferences( $settings ) {
		$shop_page_id             = $this->woocommerce_helper->get_shop_page_id();
		$homepage_is_latest_posts = \get_option( 'show_on_front' ) === 'posts';
		$page_on_front            = \get_option( 'page_on_front' );
		$page_for_posts           = \get_option( 'page_for_posts' );

		if ( empty( $page_on_front ) ) {
			$page_on_front = $page_for_posts;
		}

		return [
			'isPremium'                     => $this->product_helper->is_premium(),
			'isRtl'                         => \is_rtl(),
			'isNetworkAdmin'                => \is_network_admin(),
			'isMainSite'                    => \is_main_site(),
			'isWooCommerceActive'           => $this->woocommerce_helper->is_active(),
			'isLocalSeoActive'              => (bool) \defined( 'WPSEO_LOCAL_FILE' ),
			'siteUrl'                       => \get_bloginfo( 'url' ),
			'siteTitle'                     => \get_bloginfo( 'name' ),
			'sitemapUrl'                    => WPSEO_Sitemaps_Router::get_base_url( 'sitemap_index.xml' ),
			'hasWooCommerceShopPage'        => $shop_page_id !== -1,
			'editWooCommerceShopPageUrl'    => \get_edit_post_link( $shop_page_id, 'js' ),
			'wooCommerceShopPageSettingUrl' => \get_admin_url( null, 'admin.php?page=wc-settings&tab=products' ),
			'homepageIsLatestPosts'         => $homepage_is_latest_posts,
			'homepagePageEditUrl'           => \get_edit_post_link( $page_on_front, 'js' ),
			'homepagePostsEditUrl'          => \get_edit_post_link( $page_for_posts, 'js' ),
			'createUserUrl'                 => \admin_url( 'user-new.php' ),
			'editUserUrl'                   => \admin_url( 'user-edit.php' ),
			'generalSettingsUrl'            => \admin_url( 'options-general.php' ),
			'companyOrPersonMessage'        => \apply_filters( 'wpseo_knowledge_graph_setting_msg', '' ),
			'currentUserId'                 => \get_current_user_id(),
			'canCreateUsers'                => \current_user_can( 'create_users' ),
			'canEditUsers'                  => \current_user_can( 'edit_users' ),
			'canManageOptions'              => \current_user_can( 'manage_options' ),
			'userLocale'                    => \str_replace( '_', '-', \get_user_locale() ),
			'pluginUrl'                     => \plugins_url( '', \WPSEO_FILE ),
			'showForceRewriteTitlesSetting' => ! \current_theme_supports( 'title-tag' ) && ! ( \function_exists( 'wp_is_block_theme' ) && \wp_is_block_theme() ),
			'upsellSettings'                => $this->get_upsell_settings(),
			'siteRepresentsPerson'          => $this->get_site_represents_person( $settings ),
		];
	}

	/**
	 * Retrieves the preferences.
	 *
	 * @return array The preferences.
	 */
	protected function get_introduction_data() {
		$data = [];

		try {
			$data['wistiaEmbedPermission'] = $this->settings_introduction_action->get_wistia_embed_permission();
			$data['show']                  = $this->settings_introduction_action->get_show();
		} catch ( Exception $exception ) {
			$data['wistiaEmbedPermission'] = false;
			$data['show']                  = true;
		}

		return $data;
	}

	/**
	 * Retrieves the currently represented person.
	 *
	 * @param array $settings The settings.
	 *
	 * @return array The currently represented person's ID and name.
	 */
	protected function get_site_represents_person( $settings ) {
		$person = [
			'id'   => false,
			'name' => '',
		];

		if ( isset( $settings['wpseo_titles']['company_or_person_user_id'] ) ) {
			$person['id'] = $settings['wpseo_titles']['company_or_person_user_id'];
			$user         = \get_userdata( $person['id'] );
			if ( $user instanceof \WP_User ) {
				$person['name'] = $user->get( 'display_name' );
			}
		}

		return $person;
	}

	/**
	 * Returns settings for the Call to Buy (CTB) buttons.
	 *
	 * @return string[] The array of CTB settings.
	 */
	public function get_upsell_settings() {
		return [
			'actionId'     => 'load-nfd-ctb',
			'premiumCtbId' => '57d6a568-783c-45e2-a388-847cff155897',
		];
	}

	/**
	 * Retrieves the default setting values.
	 *
	 * These default values are currently being used in the UI for dummy fields.
	 * Dummy fields should not expose or reflect the actual data.
	 *
	 * @return array The default setting values.
	 */
	protected function get_default_setting_values() {
		$defaults = [];

		// Add Yoast settings.
		foreach ( WPSEO_Options::$options as $option_name => $instance ) {
			if ( \in_array( $option_name, self::ALLOWED_OPTION_GROUPS, true ) ) {
				$option_instance          = WPSEO_Options::get_option_instance( $option_name );
				$defaults[ $option_name ] = ( $option_instance ) ? $option_instance->get_defaults() : [];
			}
		}
		// Add WP settings.
		foreach ( self::WP_OPTIONS as $option_name ) {
			$defaults[ $option_name ] = '';
		}

		// Remove disallowed settings.
		foreach ( self::DISALLOWED_SETTINGS as $option_name => $disallowed_settings ) {
			foreach ( $disallowed_settings as $disallowed_setting ) {
				unset( $defaults[ $option_name ][ $disallowed_setting ] );
			}
		}

		return $defaults;
	}

	/**
	 * Retrieves the settings and their values.
	 *
	 * @param array $default_setting_values The default setting values.
	 *
	 * @return array The settings.
	 */
	protected function get_settings( $default_setting_values ) {
		$settings = [];

		// Add Yoast settings.
		foreach ( WPSEO_Options::$options as $option_name => $instance ) {
			if ( \in_array( $option_name, self::ALLOWED_OPTION_GROUPS, true ) ) {
				$settings[ $option_name ] = \array_merge( $default_setting_values[ $option_name ], WPSEO_Options::get_option( $option_name ) );
			}
		}
		// Add WP settings.
		foreach ( self::WP_OPTIONS as $option_name ) {
			$settings[ $option_name ] = \get_option( $option_name );
		}

		// Remove disallowed settings.
		foreach ( self::DISALLOWED_SETTINGS as $option_name => $disallowed_settings ) {
			foreach ( $disallowed_settings as $disallowed_setting ) {
				unset( $settings[ $option_name ][ $disallowed_setting ] );
			}
		}

		return $settings;
	}

	/**
	 * Transforms setting values.
	 *
	 * @param array $settings The settings.
	 *
	 * @return array The settings.
	 */
	protected function transform_settings( $settings ) {
		if ( isset( $settings['wpseo_titles']['breadcrumbs-sep'] ) ) {
			/**
			 * The breadcrumbs separator default value is the HTML entity `&raquo;`.
			 * Which does not get decoded in our JS, while it did in our Yoast form. Decode it here as an exception.
			 */
			$settings['wpseo_titles']['breadcrumbs-sep'] = \html_entity_decode(
				$settings['wpseo_titles']['breadcrumbs-sep'],
				( \ENT_NOQUOTES | \ENT_HTML5 ),
				'UTF-8'
			);
		}

		/**
		 * Decode some WP options.
		 */
		$settings['blogdescription'] = \html_entity_decode(
			$settings['blogdescription'],
			( \ENT_NOQUOTES | \ENT_HTML5 ),
			'UTF-8'
		);

		return $settings;
	}

	/**
	 * Retrieves the disabled settings.
	 *
	 * @param array $settings The settings.
	 *
	 * @return array The settings.
	 */
	protected function get_disabled_settings( $settings ) {
		$disabled_settings = [];
		$site_language     = $this->language_helper->get_language();

		foreach ( WPSEO_Options::$options as $option_name => $instance ) {
			if ( ! \in_array( $option_name, self::ALLOWED_OPTION_GROUPS, true ) ) {
				continue;
			}

			$disabled_settings[ $option_name ] = [];
			$option_instance                   = WPSEO_Options::get_option_instance( $option_name );
			if ( $option_instance === false ) {
				continue;
			}
			foreach ( $settings[ $option_name ] as $setting_name => $setting_value ) {
				if ( $option_instance->is_disabled( $setting_name ) ) {
					$disabled_settings[ $option_name ][ $setting_name ] = 'network';
				}
			}
		}

		// Remove disabled on multisite settings.
		if ( \is_multisite() ) {
			foreach ( self::DISABLED_ON_MULTISITE_SETTINGS as $option_name => $disabled_ms_settings ) {
				if ( \array_key_exists( $option_name, $disabled_settings ) ) {
					foreach ( $disabled_ms_settings as $disabled_ms_setting ) {
						$disabled_settings[ $option_name ][ $disabled_ms_setting ] = 'multisite';
					}
				}
			}
		}

		if ( \array_key_exists( 'wpseo', $disabled_settings ) && ! $this->language_helper->has_inclusive_language_support( $site_language ) ) {
			$disabled_settings['wpseo']['inclusive_language_analysis_active'] = 'language';
		}

		return $disabled_settings;
	}

	/**
	 * Retrieves the replacement variables.
	 *
	 * @return array The replacement variables.
	 */
	protected function get_replacement_variables() {
		$recommended_replace_vars = new WPSEO_Admin_Recommended_Replace_Vars();
		$specific_replace_vars    = new WPSEO_Admin_Editor_Specific_Replace_Vars();
		$replacement_variables    = $this->replace_vars->get_replacement_variables_with_labels();

		return [
			'variables'   => $replacement_variables,
			'recommended' => $recommended_replace_vars->get_recommended_replacevars(),
			'specific'    => $specific_replace_vars->get(),
			'shared'      => $specific_replace_vars->get_generic( $replacement_variables ),
		];
	}

	/**
	 * Retrieves the schema.
	 *
	 * @param array $post_types The post types.
	 *
	 * @return array The schema.
	 */
	protected function get_schema( array $post_types ) {
		$schema = [];

		foreach ( $this->schema_types->get_article_type_options() as $article_type ) {
			$schema['articleTypes'][ $article_type['value'] ] = [
				'label' => $article_type['name'],
				'value' => $article_type['value'],
			];
		}

		foreach ( $this->schema_types->get_page_type_options() as $page_type ) {
			$schema['pageTypes'][ $page_type['value'] ] = [
				'label' => $page_type['name'],
				'value' => $page_type['value'],
			];
		}

		$schema['articleTypeDefaults'] = [];
		$schema['pageTypeDefaults']    = [];
		foreach ( $post_types as $name => $post_type ) {
			$schema['articleTypeDefaults'][ $name ] = WPSEO_Options::get_default( 'wpseo_titles', "schema-article-type-$name" );
			$schema['pageTypeDefaults'][ $name ]    = WPSEO_Options::get_default( 'wpseo_titles', "schema-page-type-$name" );
		}

		return $schema;
	}

	/**
	 * Transforms the post types, to represent them.
	 *
	 * @param WP_Post_Type[] $post_types The WP_Post_Type array to transform.
	 *
	 * @return array The post types.
	 */
	protected function transform_post_types( $post_types ) {
		$transformed = [];
		foreach ( $post_types as $index => $post_type ) {
			$transformed[ $post_type->name ] = [
				'name'                 => $post_type->name,
				'route'                => $this->get_route( $post_type->name, $post_type->rewrite, $post_type->rest_base ),
				'label'                => $post_type->label,
				'singularLabel'        => $post_type->labels->singular_name,
				'hasArchive'           => $this->post_type_helper->has_archive( $post_type ),
				'hasSchemaArticleType' => $this->article_helper->is_article_post_type( $post_type->name ),
				'menuPosition'         => $post_type->menu_position,
			];
		}

		\uasort( $transformed, [ $this, 'compare_post_types' ] );

		return $transformed;
	}

	/**
	 * Compares two post types.
	 *
	 * @param array $a The first post type.
	 * @param array $b The second post type.
	 *
	 * @return int The order.
	 */
	protected function compare_post_types( $a, $b ) {
		if ( $a['menuPosition'] === null && $b['menuPosition'] !== null ) {
			return 1;
		}
		if ( $a['menuPosition'] !== null && $b['menuPosition'] === null ) {
			return -1;
		}

		if ( $a['menuPosition'] === null && $b['menuPosition'] === null ) {
			// No position specified, order alphabetically by label.
			return \strnatcmp( $a['label'], $b['label'] );
		}

		return ( ( $a['menuPosition'] < $b['menuPosition'] ) ? -1 : 1 );
	}

	/**
	 * Transforms the taxonomies, to represent them.
	 *
	 * @param WP_Taxonomy[] $taxonomies      The WP_Taxonomy array to transform.
	 * @param string[]      $post_type_names The post type names.
	 *
	 * @return array The taxonomies.
	 */
	protected function transform_taxonomies( $taxonomies, $post_type_names ) {
		$transformed = [];
		foreach ( $taxonomies as $index => $taxonomy ) {
			$transformed[ $taxonomy->name ] = [
				'name'          => $taxonomy->name,
				'route'         => $this->get_route( $taxonomy->name, $taxonomy->rewrite, $taxonomy->rest_base ),
				'label'         => $taxonomy->label,
				'singularLabel' => $taxonomy->labels->singular_name,
				'postTypes'     => \array_filter(
					$taxonomy->object_type,
					static function ( $object_type ) use ( $post_type_names ) {
						return \in_array( $object_type, $post_type_names, true );
					}
				),
			];
		}

		\uasort(
			$transformed,
			static function ( $a, $b ) {
				return \strnatcmp( $a['label'], $b['label'] );
			}
		);

		return $transformed;
	}

	/**
	 * Gets the route from a name, rewrite and rest_base.
	 *
	 * @param string $name      The name.
	 * @param array  $rewrite   The rewrite data.
	 * @param string $rest_base The rest base.
	 *
	 * @return string The route.
	 */
	protected function get_route( $name, $rewrite, $rest_base ) {
		$route = $name;
		if ( isset( $rewrite['slug'] ) ) {
			$route = $rewrite['slug'];
		}
		if ( ! empty( $rest_base ) ) {
			$route = $rest_base;
		}
		// Always strip leading slashes.
		while ( \substr( $route, 0, 1 ) === '/' ) {
			$route = \substr( $route, 1 );
		}

		return $route;
	}

	/**
	 * Retrieves the fallbacks.
	 *
	 * @return array The fallbacks.
	 */
	protected function get_fallbacks() {
		$site_logo_id = \get_option( 'site_logo' );
		if ( ! $site_logo_id ) {
			$site_logo_id = \get_theme_mod( 'custom_logo' );
		}
		if ( ! $site_logo_id ) {
			$site_logo_id = '0';
		}

		return [
			'siteLogoId' => $site_logo_id,
		];
	}

	/**
	 * Removes the notification related to the post types which have been made public.
	 *
	 * @return void
	 */
	private function remove_post_types_made_public_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification_by_id( 'post-types-made-public' );
	}

	/**
	 * Removes the notification related to the taxonomies which have been made public.
	 *
	 * @return void
	 */
	private function remove_taxonomies_made_public_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification_by_id( 'taxonomies-made-public' );
	}
}
