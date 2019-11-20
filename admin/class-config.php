<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

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
		add_action( 'init', array( $this, 'init' ), 20 );
		$this->asset_manager = new WPSEO_Admin_Asset_Manager();
	}

	/**
	 * Make sure the needed scripts are loaded for admin pages.
	 */
	public function init() {
		if ( filter_input( INPUT_GET, 'wpseo_reset_defaults' ) && wp_verify_nonce( filter_input( INPUT_GET, 'nonce' ), 'wpseo_reset_defaults' ) && current_user_can( 'manage_options' ) ) {
			WPSEO_Options::reset();
			wp_redirect( admin_url( 'admin.php?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER ) );
		}

		add_action( 'admin_enqueue_scripts', array( $this, 'config_page_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'config_page_styles' ) );
	}

	/**
	 * Loads the required styles for the config page.
	 */
	public function config_page_styles() {
		wp_enqueue_style( 'dashboard' );
		wp_enqueue_style( 'thickbox' );
		wp_enqueue_style( 'global' );
		wp_enqueue_style( 'wp-admin' );
		$this->asset_manager->enqueue_style( 'select2' );

		$this->asset_manager->enqueue_style( 'admin-css' );
	}

	/**
	 * Loads the required scripts for the config page.
	 */
	public function config_page_scripts() {
		$this->asset_manager->enqueue_script( 'admin-script' );

		$page = filter_input( INPUT_GET, 'page' );

		if ( $page === 'wpseo_titles' ) {
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'search-appearance', 'wpseoReplaceVarsL10n', $this->localize_replace_vars_script() );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'search-appearance', 'wpseoSearchAppearance', $this->localize_search_appearance_script() );
			$this->asset_manager->enqueue_script( 'search-appearance' );
			$this->asset_manager->enqueue_style( 'search-appearance' );
			/**
			 * Remove the emoji script as it is incompatible with both React and any
			 * contenteditable fields.
			 */
			remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

			$yoast_components_l10n = new WPSEO_Admin_Asset_Yoast_Components_L10n();
			$yoast_components_l10n->localize_script( 'search-appearance' );
		}

		wp_enqueue_script( 'dashboard' );
		wp_enqueue_script( 'thickbox' );

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-script', 'wpseoSelect2Locale', WPSEO_Language_Utils::get_language( WPSEO_Language_Utils::get_user_locale() ) );

		if ( in_array( $page, array( 'wpseo_social', WPSEO_Admin::PAGE_IDENTIFIER, 'wpseo_titles' ), true ) ) {
			wp_enqueue_media();

			$this->asset_manager->enqueue_script( 'admin-media' );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-media', 'wpseoMediaL10n', $this->localize_media_script() );
		}

		if ( 'wpseo_tools' === $page ) {
			$this->enqueue_tools_scripts();
		}
	}

	/**
	 * Retrieves some variables that are needed for the upload module in JS.
	 *
	 * @return array The upload module variables.
	 */
	public function localize_media_script() {
		return array(
			'choose_image' => __( 'Use Image', 'wordpress-seo' ),
		);
	}

	/**
	 * Retrieves some variables that are needed for replacing variables in JS.
	 *
	 * @return array The replacement and recommended replacement variables.
	 */
	public function localize_replace_vars_script() {
		$replace_vars                 = new WPSEO_Replace_Vars();
		$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
		$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();
		$replace_vars_list            = $replace_vars->get_replacement_variables_list();

		return array(
			'replace_vars'                 => $replace_vars_list,
			'recommended_replace_vars'     => $recommended_replace_vars->get_recommended_replacevars(),
			'editor_specific_replace_vars' => $editor_specific_replace_vars->get(),
			'shared_replace_vars'          => $editor_specific_replace_vars->get_generic( $replace_vars_list ),
		);
	}

	/**
	 * Retrieves some variables that are needed for the search appearance in JS.
	 *
	 * @return array The search appearance variables.
	 */
	public function localize_search_appearance_script() {
		$search_appearance_l10n = array(
			'isRtl'                    => is_rtl(),
			'userEditUrl'              => add_query_arg( 'user_id', '{user_id}', admin_url( 'user-edit.php' ) ),
			'brushstrokeBackgroundURL' => plugins_url( 'images/brushstroke_background.svg', WPSEO_FILE ),
			'showLocalSEOUpsell'       => $this->should_show_local_seo_upsell(),
			'localSEOUpsellURL'        => WPSEO_Shortlinker::get( 'https://yoa.st/3mp' ),
		);

		$search_appearance_l10n['knowledgeGraphCompanyInfoMissing'] = WPSEO_Language_Utils::get_knowledge_graph_company_info_missing_l10n();

		return $search_appearance_l10n;
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
		$addon_manager = new WPSEO_Addon_Manager();

		return ! WPSEO_Utils::is_yoast_seo_premium()
			&& ! ( defined( 'WPSEO_LOCAL_FILE' ) );
	}

	/**
	 * Enqueues and handles all the tool dependencies.
	 */
	private function enqueue_tools_scripts() {
		$tool = filter_input( INPUT_GET, 'tool' );

		if ( empty( $tool ) ) {
			$this->asset_manager->enqueue_script( 'yoast-seo' );
		}

		if ( 'bulk-editor' === $tool ) {
			$this->asset_manager->enqueue_script( 'bulk-editor' );
		}
	}
} /* End of class */
