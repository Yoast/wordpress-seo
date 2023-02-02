<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Integrations\Settings_Integration;

/**
 * Class WPSEO_Admin_Pages.
 *
 * Class with functionality for the Yoast SEO admin pages.
 */
class WPSEO_Admin_Pages {

	/**
	 * The option in use for the current admin page.
	 *
	 * @var string
	 */
	public $currentoption = 'wpseo';

	/**
	 * Holds the asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Class constructor, which basically only hooks the init function on the init hook.
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'init' ], 20 );
		$this->asset_manager = new WPSEO_Admin_Asset_Manager();
	}

	/**
	 * Make sure the needed scripts are loaded for admin pages.
	 */
	public function init() {
		$page = filter_input( INPUT_GET, 'page' );
		if ( $page === Settings_Integration::PAGE ) {
			// Bail, this is managed in the Settings_Integration.
			return;
		}

		if ( filter_input( INPUT_GET, 'wpseo_reset_defaults' ) && wp_verify_nonce( filter_input( INPUT_GET, 'nonce' ), 'wpseo_reset_defaults' ) && current_user_can( 'manage_options' ) ) {
			WPSEO_Options::reset();
		}

		add_action( 'admin_enqueue_scripts', [ $this, 'config_page_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'config_page_styles' ] );
	}

	/**
	 * Loads the required styles for the config page.
	 */
	public function config_page_styles() {
		wp_enqueue_style( 'dashboard' );
		wp_enqueue_style( 'thickbox' );
		wp_enqueue_style( 'global' );
		wp_enqueue_style( 'wp-admin' );
		$this->asset_manager->enqueue_style( 'admin-css' );
		$this->asset_manager->enqueue_style( 'monorepo' );

		$page = filter_input( INPUT_GET, 'page' );
		if ( $page === 'wpseo_titles' ) {
			$this->asset_manager->enqueue_style( 'search-appearance' );
		}

		if ( $page === 'wpseo_social' || $page === 'wpseo_licenses' ) {
			$this->asset_manager->enqueue_style( 'tailwind' );
		}
	}

	/**
	 * Loads the required scripts for the config page.
	 */
	public function config_page_scripts() {
		$this->asset_manager->enqueue_script( 'settings' );
		wp_enqueue_script( 'dashboard' );
		wp_enqueue_script( 'thickbox' );

		$alert_dismissal_action = YoastSEO()->classes->get( \Yoast\WP\SEO\Actions\Alert_Dismissal_Action::class );
		$dismissed_alerts       = $alert_dismissal_action->all_dismissed();

		$script_data = [
			'userLanguageCode'               => WPSEO_Language_Utils::get_language( \get_user_locale() ),
			'dismissedAlerts'                => $dismissed_alerts,
			'isRtl'                          => is_rtl(),
			'isPremium'                      => YoastSEO()->helpers->product->is_premium(),
			'webinarIntroSettingsUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/webinar-intro-settings' ),
			'webinarIntroFirstTimeConfigUrl' => WPSEO_Shortlinker::get( 'https://yoa.st/webinar-intro-first-time-config' ),
		];

		$page = filter_input( INPUT_GET, 'page' );

		if ( $page === 'wpseo_titles' ) {
			$script_data['analysis'] = [
				'plugins' => [
					'replaceVars' => $this->get_replace_vars_script_data(),
				],
			];

			$schema_types                    = new Schema_Types();
			$script_data['searchAppearance'] = [
				'isRtl'                            => is_rtl(),
				'userEditUrl'                      => add_query_arg( 'user_id', '{user_id}', admin_url( 'user-edit.php' ) ),
				'brushstrokeBackgroundURL'         => plugins_url( 'images/brushstroke_background.svg', WPSEO_FILE ),
				'showLocalSEOUpsell'               => $this->should_show_local_seo_upsell(),
				'localSEOUpsellURL'                => WPSEO_Shortlinker::get( 'https://yoa.st/3mp' ),
				'showNewsSEOUpsell'                => $this->should_show_news_seo_upsell(),
				'newsSEOUpsellURL'                 => WPSEO_Shortlinker::get( 'https://yoa.st/get-news-settings' ),
				'knowledgeGraphCompanyInfoMissing' => WPSEO_Language_Utils::get_knowledge_graph_company_info_missing_l10n(),
				'schema'                           => [
					'pageTypeOptions'    => $schema_types->get_page_type_options(),
					'articleTypeOptions' => $schema_types->get_article_type_options(),
				],
			];

			/**
			 * Remove the emoji script as it is incompatible with both React and any
			 * contenteditable fields.
			 */
			remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		}

		if ( in_array( $page, [ 'wpseo_social', WPSEO_Admin::PAGE_IDENTIFIER, 'wpseo_titles', 'wpseo_workouts' ], true ) ) {
			wp_enqueue_media();

			$script_data['media'] = [
				'choose_image' => __( 'Use Image', 'wordpress-seo' ),
			];

			$script_data['userEditUrl'] = add_query_arg( 'user_id', '{user_id}', admin_url( 'user-edit.php' ) );
		}

		if ( $page === 'wpseo_tools' ) {
			$this->enqueue_tools_scripts();
		}

		if ( $page === 'wpseo_social' ) {
			$user_id = WPSEO_Options::get( 'company_or_person_user_id', '' );
			$user    = \get_userdata( $user_id );

			$user_name = '';
			if ( $user instanceof \WP_User ) {
				$user_name = $user->get( 'display_name' );
			}

			$script_data['social'] = [
				'facebook_url'      => WPSEO_Options::get( 'facebook_site', '' ),
				'twitter_username'  => WPSEO_Options::get( 'twitter_site', '' ),
				'mastodon_url'      => WPSEO_Options::get( 'mastodon_url', '' ),
				'other_social_urls' => WPSEO_Options::get( 'other_social_urls', [] ),
				'company_or_person' => WPSEO_Options::get( 'company_or_person', '' ),
				'user_id'           => $user_id,
				'user_name'         => $user_name,
			];

			$script_data['search_appearance_link'] = admin_url( 'admin.php?page=wpseo_page_settings#/site-representation' );

			$script_data['force_organization'] = ( defined( 'WPSEO_LOCAL_FILE' ) );
		}

		$this->asset_manager->localize_script( 'settings', 'wpseoScriptData', $script_data );
		$this->asset_manager->enqueue_user_language_script();
	}

	/**
	 * Retrieves some variables that are needed for replacing variables in JS.
	 *
	 * @return array The replacement and recommended replacement variables.
	 */
	public function get_replace_vars_script_data() {
		$replace_vars                 = new WPSEO_Replace_Vars();
		$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
		$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();
		$replace_vars_list            = $replace_vars->get_replacement_variables_list();

		return [
			'replace_vars'                 => $replace_vars_list,
			'recommended_replace_vars'     => $recommended_replace_vars->get_recommended_replacevars(),
			'editor_specific_replace_vars' => $editor_specific_replace_vars->get(),
			'shared_replace_vars'          => $editor_specific_replace_vars->get_generic( $replace_vars_list ),
			'hidden_replace_vars'          => $replace_vars->get_hidden_replace_vars(),
		];
	}

	/**
	 * Determines whether the Local SEO upsell should be shown.
	 *
	 * The Local SEO upsell should:
	 * - Only be shown in Free, not when Premium is active.
	 * - Not be shown when Local SEO is active.
	 *
	 * @return bool Whether the Local SEO upsell should be shown.
	 */
	private function should_show_local_seo_upsell() {
		return ! YoastSEO()->helpers->product->is_premium()
			&& ! ( defined( 'WPSEO_LOCAL_FILE' ) );
	}

	/**
	 * Determines whether the News SEO upsell should be shown.
	 *
	 * The News SEO upsell should:
	 * - Not be shown when Local SEO is active.
	 *
	 * @return bool Whether the News SEO upsell should be shown.
	 */
	private function should_show_news_seo_upsell() {
		return ! ( defined( 'WPSEO_NEWS_FILE' ) );
	}

	/**
	 * Enqueues and handles all the tool dependencies.
	 */
	private function enqueue_tools_scripts() {
		$tool = filter_input( INPUT_GET, 'tool' );

		if ( empty( $tool ) ) {
			$this->asset_manager->enqueue_script( 'yoast-seo' );
		}

		if ( $tool === 'bulk-editor' ) {
			$this->asset_manager->enqueue_script( 'bulk-editor' );
		}
	}
}
