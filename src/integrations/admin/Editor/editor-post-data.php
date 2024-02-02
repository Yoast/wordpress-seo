<?php

namespace Yoast\WP\SEO\Integrations\Admin\Editor;

use WP_Screen;
use WPSEO_Utils;
use WPSEO_Post_Type;
use WPSEO_Shortlinker;
use WPSEO_Language_Utils;
use WPSEO_Metabox_Formatter;
use WPSEO_Post_Metabox_Formatter;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Plugin_Availability;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;
use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Conditionals\Third_Party\Jetpack_Boost_Active_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\Jetpack_Boost_Not_Premium_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Integrations\Admin\Editor\Replace_Vars_Post;

/**
 * This integration registers a run of the cleanup routine whenever the plugin is activated.
 */
class Editor_Post_Data {

    /**
     * The asset manager.
     * 
     * @var WPSEO_Admin_Asset_Manager
     */
    protected $asset_manager;

    /**
     * The replace vars post.
     * 
     * @var Replace_Vars_Post
     */
    protected $replace_vars_post;

    /**
     * The current post object.
     * 
     * @var WP_Post
     */
    protected $post;

    /**
     * Constructor.
     * 
     * @param WPSEO_Admin_Asset_Manager $this->asset_manager The asset manager.
     */
    public function __construct() {
        $this->asset_manager = new WPSEO_Admin_Asset_Manager();
        $this->replace_vars_post = new Replace_Vars_Post();
    }

    /**
	 * Enqueues all the needed JS and CSS.
	 *
	 * @todo [JRF => whomever] Create css/metabox-mp6.css file and add it to the below allowed colors array when done.
	 */
	public function get_script_data( $post ) {
		global $pagenow;

        $this->post = $post;

		$replaceVars = $this->replace_vars_post->get_post_replace_vars( $this->post );

		$plugins_script_data = [
			'replaceVars' => $replaceVars,
			'shortcodes' => [
				'wpseo_shortcode_tags'          => $this->get_valid_shortcode_tags(),
				'wpseo_filter_shortcodes_nonce' => \wp_create_nonce( 'wpseo-filter-shortcodes' ),
			],
		];

		$worker_script_data = [
			'url'                     => YoastSEO()->helpers->asset->get_asset_url( 'yoast-seo-analysis-worker' ),
			'dependencies'            => YoastSEO()->helpers->asset->get_dependency_urls_by_handle( 'yoast-seo-analysis-worker' ),
			'keywords_assessment_url' => YoastSEO()->helpers->asset->get_asset_url( 'yoast-seo-used-keywords-assessment' ),
			'log_level'               => WPSEO_Utils::get_analysis_worker_log_level(),
		];

		$alert_dismissal_action            = YoastSEO()->classes->get( Alert_Dismissal_Action::class );
		$dismissed_alerts                  = $alert_dismissal_action->all_dismissed();
		$woocommerce_conditional           = new WooCommerce_Conditional();
		$woocommerce_active                = $woocommerce_conditional->is_met();
		$wpseo_plugin_availability_checker = new WPSEO_Plugin_Availability();
		$woocommerce_seo_file              = 'wpseo-woocommerce/wpseo-woocommerce.php';
		$woocommerce_seo_active            = $wpseo_plugin_availability_checker->is_active( $woocommerce_seo_file );
        $is_block_editor  = WP_Screen::get()->is_block_editor();

		$script_data = [
			// @todo replace this translation with JavaScript translations.
			'media'                      => [ 'choose_image' => __( 'Use Image', 'wordpress-seo' ) ],
			'metabox'                    => $this->get_metabox_script_data(),
			'userLanguageCode'           => WPSEO_Language_Utils::get_language( \get_user_locale() ),
			'isPost'                     => true,
			'isBlockEditor'              => $is_block_editor,
			'postId'                     => $this->post->ID,
			'postStatus'                 => $this->post->post_status,
			'postType'                   => $this->post->post_type,
			'usedKeywordsNonce'          => \wp_create_nonce( 'wpseo-keyword-usage-and-post-types' ),
			'analysis'                   => [
				'plugins' => $plugins_script_data,
				'worker'  => $worker_script_data,
			],
			'dismissedAlerts'            => $dismissed_alerts,
			'currentPromotions'          => YoastSEO()->classes->get( Promotion_Manager::class )->get_current_promotions(),
			'webinarIntroBlockEditorUrl' => WPSEO_Shortlinker::get( 'https://yoa.st/webinar-intro-block-editor' ),
			'isJetpackBoostActive'       => ( $is_block_editor ) ? YoastSEO()->classes->get( Jetpack_Boost_Active_Conditional::class )->is_met() : false,
			'isJetpackBoostNotPremium'   => ( $is_block_editor ) ? YoastSEO()->classes->get( Jetpack_Boost_Not_Premium_Conditional::class )->is_met() : false,
			'isWooCommerceActive'        => $woocommerce_active,
			'woocommerceUpsell'          => $this->post->post_type === 'product' && ! $woocommerce_seo_active && $woocommerce_active,
			'linkParams'                 => WPSEO_Shortlinker::get_query_params(),
			'pluginUrl'                  => \plugins_url( '', \WPSEO_FILE ),
			'wistiaEmbedPermission'      => YoastSEO()->classes->get( Wistia_Embed_Permission_Repository::class )->get_value_for_user( \get_current_user_id() ),
		];
        return $script_data;
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

    	/**
	 * Passes variables to js for use with the post-scraper.
	 *
	 * @return array
	 */
	public function get_metabox_script_data() {
		$permalink = '';

		if ( is_object( $this->post ) ) {
			$permalink = get_sample_permalink( $this->post->ID );
			$permalink = $permalink[0];
		}

		$post_formatter = new WPSEO_Metabox_Formatter(
			new WPSEO_Post_Metabox_Formatter( $this->post, [], $permalink )
		);

		$values = $post_formatter->get_values();

		/** This filter is documented in admin/filters/class-cornerstone-filter.php. */
		$post_types = apply_filters( 'wpseo_cornerstone_post_types', WPSEO_Post_Type::get_accessible_post_types() );
		if ( $values['cornerstoneActive'] && ! in_array( $this->post->post_type, $post_types, true ) ) {
			$values['cornerstoneActive'] = false;
		}

		if ( $values['semrushIntegrationActive'] && $this->post->post_type === 'attachment' ) {
			$values['semrushIntegrationActive'] = 0;
		}

		if ( $values['wincherIntegrationActive'] && $this->post->post_type === 'attachment' ) {
			$values['wincherIntegrationActive'] = 0;
		}

		return $values;
	}

}