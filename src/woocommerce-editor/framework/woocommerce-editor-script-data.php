<?php

namespace Yoast\WP\SEO\WooCommerce_Editor\Framework;

use Exception;
use WP_Post;
use WP_Screen;
use WPSEO_Admin_Recommended_Replace_Vars;
use WPSEO_Language_Utils;
use WPSEO_Metabox_Formatter;
use WPSEO_Plugin_Availability;
use WPSEO_Post_Metabox_Formatter;
use WPSEO_Replace_Vars;
use WPSEO_Utils;
use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Helpers\Asset_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * Collects the "script" data that is passed to the editor integration JS side.
 */
class WooCommerce_Editor_Script_Data {

	/**
	 * Holds the Alert_Dismissal_Action instance.
	 *
	 * @var Alert_Dismissal_Action
	 */
	private $alert_dismissal_action;

	/**
	 * Holds the Asset_Helper instance.
	 *
	 * @var Asset_Helper
	 */
	private $asset_helper;

	/**
	 * Holds the Meta_Surface instance.
	 *
	 * @var Meta_Surface
	 */
	private $meta_surface;

	/**
	 * Holds the WPSEO_Plugin_Availability instance.
	 *
	 * @var WPSEO_Plugin_Availability
	 */
	private $plugin_availability;

	/**
	 * Holds the Post_Type_Helper instance.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * Holds the Promotion_Manager instance.
	 *
	 * @var Promotion_Manager
	 */
	private $promotion_manager;

	/**
	 * Holds the WPSEO_Admin_Recommended_Replace_Vars instance.
	 *
	 * @var WPSEO_Admin_Recommended_Replace_Vars
	 */
	private $recommended_replace_vars;

	/**
	 * Holds the WPSEO_Replace_Vars instance.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * Holds the Short_Link_Helper instance.
	 *
	 * @var Short_Link_Helper
	 */
	private $shortlink_helper;

	/**
	 * Holds the Wistia_Embed_Permission_Repository instance.
	 *
	 * @var Wistia_Embed_Permission_Repository
	 */
	private $wistia_embed_permission_repository;

	/**
	 * Constructs the instance.
	 *
	 * @param Alert_Dismissal_Action             $alert_dismissal_action             The Alert_Dismissal_Action.
	 * @param Asset_Helper                       $asset_helper                       The Asset_Helper.
	 * @param Meta_Surface                       $meta_surface                       The Meta_Surface.
	 * @param Post_Type_Helper                   $post_type_helper                   The Post_Type_Helper.
	 * @param Promotion_Manager                  $promotion_manager                  The Promotion_Manager.
	 * @param WPSEO_Replace_Vars                 $replace_vars                       The WPSEO_Replace_Vars.
	 * @param Short_Link_Helper                  $shortlink_helper                   The Short_Link_Helper.
	 * @param Wistia_Embed_Permission_Repository $wistia_embed_permission_repository The Wistia embed permission
	 *                                                                               repository.
	 *
	 * @constructor
	 */
	public function __construct(
		Alert_Dismissal_Action $alert_dismissal_action,
		Asset_Helper $asset_helper,
		Meta_Surface $meta_surface,
		Post_Type_Helper $post_type_helper,
		Promotion_Manager $promotion_manager,
		WPSEO_Replace_Vars $replace_vars,
		Short_Link_Helper $shortlink_helper,
		Wistia_Embed_Permission_Repository $wistia_embed_permission_repository
	) {
		$this->alert_dismissal_action             = $alert_dismissal_action;
		$this->asset_helper                       = $asset_helper;
		$this->meta_surface                       = $meta_surface;
		$this->plugin_availability                = new WPSEO_Plugin_Availability();
		$this->post_type_helper                   = $post_type_helper;
		$this->promotion_manager                  = $promotion_manager;
		$this->recommended_replace_vars           = new WPSEO_Admin_Recommended_Replace_Vars();
		$this->replace_vars                       = $replace_vars;
		$this->shortlink_helper                   = $shortlink_helper;
		$this->wistia_embed_permission_repository = $wistia_embed_permission_repository;
	}

	/**
	 * Collects the script data.
	 *
	 * @param WP_Post $post    The post object.
	 * @param int     $user_id The user ID.
	 *
	 * @return array<string,string|int|bool|array> The script data.
	 */
	public function get_data_for( WP_Post $post, int $user_id ): array {
		$is_block_editor           = WP_Screen::get()->is_block_editor();
		$is_woocommerce_seo_active = $this->plugin_availability->is_active( 'wpseo-woocommerce/wpseo-woocommerce.php' );

		try {
			$wistia_embed_permission = $this->wistia_embed_permission_repository->get_value_for_user( $user_id );
		} catch ( Exception $e ) {
			$wistia_embed_permission = false;
		}

		return [
			'media'                  => [ 'choose_image' => \__( 'Use Image', 'wordpress-seo' ) ],
			'metabox'                => $this->get_metabox_script_data( $post ),
			'userLanguageCode'       => WPSEO_Language_Utils::get_language( \get_user_locale( $user_id ) ),
			'isPost'                 => true,
			'isBlockEditor'          => $is_block_editor,
			'isElementorEditor'      => false,
			'isWooCommerceSeoActive' => $is_woocommerce_seo_active,
			'isWooCommerceActive'    => true,
			'woocommerceUpsell'      => ! $is_woocommerce_seo_active,
			'postId'                 => $post->ID,
			'postStatus'             => $post->post_status,
			'postType'               => $post->post_type,
			'analysis'               => [
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
						'wpseo_shortcode_tags'          => $this->get_valid_shortcode_tags(),
						'wpseo_filter_shortcodes_nonce' => \wp_create_nonce( 'wpseo-filter-shortcodes' ),
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
			'dismissedAlerts'        => $this->alert_dismissal_action->all_dismissed(),
			'currentPromotions'      => $this->promotion_manager->get_current_promotions(),
			'usedKeywordsNonce'      => \wp_create_nonce( 'wpseo-keyword-usage-and-post-types' ),
			'linkParams'             => $this->shortlink_helper->get_query_params(),
			'pluginUrl'              => \plugins_url( '', \WPSEO_FILE ),
			'wistiaEmbedPermission'  => $wistia_embed_permission,
		];
	}

	/**
	 * Passes variables to js for use with the post-scraper.
	 *
	 * @param WP_Post $post The post object.
	 *
	 * @return array<string,string|int|bool|array>
	 */
	private function get_metabox_script_data( WP_Post $post ): array {
		$post_formatter = new WPSEO_Metabox_Formatter(
			new WPSEO_Post_Metabox_Formatter( $post, [], \get_sample_permalink( $post->ID )[0] )
		);

		$values = $post_formatter->get_values();

		/** This filter is documented in admin/filters/class-cornerstone-filter.php. */
		$post_types = \apply_filters( 'wpseo_cornerstone_post_types', $this->post_type_helper->get_accessible_post_types() );
		if ( $values['cornerstoneActive'] && ! \in_array( $post->post_type, $post_types, true ) ) {
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
	 * @return array<string,string|int|bool|array> Replace vars.
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
		return \array_merge( $cached_replacement_vars, $this->get_custom_replace_vars( $post ) );
	}

	/**
	 * Gets the custom replace variables for custom taxonomies and fields.
	 *
	 * @param WP_Post $post The post to check for custom taxonomies and fields.
	 *
	 * @return array<string,string|int|bool|array> Array containing all the replacement variables.
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
	 * @return array<string,string|int|bool|array> Array containing all the replacement variables.
	 */
	private function get_custom_fields_replace_vars( WP_Post $post ): array {
		$custom_replace_vars = [];

		// If no post object is passed, return the empty custom_replace_vars array.
		if ( ! \is_object( $post ) ) {
			return $custom_replace_vars;
		}

		$custom_fields = \get_post_custom( $post->ID );

		// If $custom_fields is an empty string or generally not an array, return early.
		if ( ! \is_array( $custom_fields ) ) {
			return $custom_replace_vars;
		}

		$meta = $this->meta_surface->for_post( $post->ID );

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
	 * @return array<string,string|int|bool|array> Array containing all the replacement variables.
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
	 * @return array<int,string> Recommended replacement variables.
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
	 * @return array<int,string>
	 */
	private function get_valid_shortcode_tags(): array {
		$shortcode_tags = [];

		foreach ( $GLOBALS['shortcode_tags'] as $tag => $description ) {
			$shortcode_tags[] = $tag;
		}

		return $shortcode_tags;
	}
}
