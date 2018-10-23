<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

/**
 * Class for the Yoast SEO admin bar menu.
 */
class WPSEO_Admin_Bar_Menu implements WPSEO_WordPress_Integration {

	/** The identifier used for the menu. */
	const MENU_IDENTIFIER = 'wpseo-menu';

	/** The identifier used for the Keyword Research submenu. */
	const KEYWORD_RESEARCH_SUBMENU_IDENTIFIER = 'wpseo-kwresearch';

	/** The identifier used for the Analysis submenu. */
	const ANALYSIS_SUBMENU_IDENTIFIER = 'wpseo-analysis';

	/** The identifier used for the Settings submenu. */
	const SETTINGS_SUBMENU_IDENTIFIER = 'wpseo-settings';

	/** The identifier used for the Network Settings submenu. */
	const NETWORK_SETTINGS_SUBMENU_IDENTIFIER = 'wpseo-network-settings';

	/** @var WPSEO_Admin_Asset_Manager Asset manager instance. */
	protected $asset_manager;

	/**
	 * Constructor.
	 *
	 * Sets the asset manager to use.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager Optional. Asset manager to use.
	 */
	public function __construct( WPSEO_Admin_Asset_Manager $asset_manager = null ) {
		if ( ! $asset_manager ) {
			$asset_manager = new WPSEO_Admin_Asset_Manager();
		}

		$this->asset_manager = $asset_manager;
	}

	/**
	 * Adds the admin bar menu.
	 *
	 * @param WP_Admin_Bar $wp_admin_bar Admin bar instance to add the menu to.
	 *
	 * @return void
	 */
	public function add_menu( WP_Admin_Bar $wp_admin_bar ) {

		// If the current user can't write posts, this is all of no use, so let's not output an admin menu.
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}

		$this->add_root_menu( $wp_admin_bar );
		$this->add_keyword_research_submenu( $wp_admin_bar );

		if ( ! is_admin() ) {
			$this->add_analysis_submenu( $wp_admin_bar );
		}

		if ( ! is_admin() || is_blog_admin() ) {
			$this->add_settings_submenu( $wp_admin_bar );
		}
		elseif ( is_network_admin() ) {
			$this->add_network_settings_submenu( $wp_admin_bar );
		}
	}

	/**
	 * Enqueues admin bar assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		if ( ! is_admin_bar_showing() ) {
			return;
		}

		// If the current user can't write posts, this is all of no use, so let's not output an admin menu.
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}

		$this->asset_manager->register_assets();
		$this->asset_manager->enqueue_style( 'adminbar' );
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->meets_requirements() ) {
			return;
		}

		add_action( 'admin_bar_menu', array( $this, 'add_menu' ), 95 );

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Checks whether the requirements to use this class are met.
	 *
	 * @return bool True if requirements are met, false otherwise.
	 */
	public function meets_requirements() {
		if ( is_network_admin() ) {
			return WPSEO_Utils::is_plugin_network_active();
		}

		if ( WPSEO_Options::get( 'enable_admin_bar_menu' ) !== true ) {
			return false;
		}

		return ! is_admin() || is_blog_admin();
	}

	/**
	 * Adds the admin bar root menu.
	 *
	 * @param WP_Admin_Bar $wp_admin_bar Admin bar instance to add the menu to.
	 *
	 * @return void
	 */
	protected function add_root_menu( WP_Admin_Bar $wp_admin_bar ) {
		$title = $this->get_title();

		$score        = '';
		$settings_url = '';
		$counter      = '';
		$alert_popup  = '';

		$post = $this->get_singular_post();
		if ( $post ) {
			$score = $this->get_post_score( $post );
		}

		$term = $this->get_singular_term();
		if ( $term ) {
			$score = $this->get_term_score( $term );
		}

		$can_manage_options = $this->can_manage_options();

		if ( $can_manage_options ) {
			$settings_url = $this->get_settings_page_url();
		}

		if ( empty( $score ) && ! is_network_admin() && $can_manage_options ) {
			$counter     = $this->get_notification_counter();
			$alert_popup = $this->get_notification_alert_popup();
		}

		$wp_admin_bar->add_menu( array(
			'id'    => self::MENU_IDENTIFIER,
			'title' => $title . $score . $counter . $alert_popup,
			'href'  => $settings_url,
			'meta'  => array( 'tabindex' => ! empty( $settings_url ) ? false : '0' ),
		) );

		if ( ! empty( $counter ) ) {
			$wp_admin_bar->add_menu( array(
				'parent' => self::MENU_IDENTIFIER,
				'id'     => 'wpseo-notifications',
				'title'  => __( 'Notifications', 'wordpress-seo' ) . $counter,
				'href'   => $settings_url,
				'meta'   => array( 'tabindex' => ! empty( $settings_url ) ? false : '0' ),
			) );
		}

		if ( ! is_network_admin() && $can_manage_options ) {
			$wp_admin_bar->add_menu( array(
				'parent' => self::MENU_IDENTIFIER,
				'id'     => 'wpseo-configuration-wizard',
				'title'  => __( 'Configuration Wizard', 'wordpress-seo' ),
				'href'   => admin_url( 'admin.php?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER ),
			) );
		}
	}

	/**
	 * Adds the admin bar keyword research submenu.
	 *
	 * @param WP_Admin_Bar $wp_admin_bar Admin bar instance to add the menu to.
	 *
	 * @return void
	 */
	protected function add_keyword_research_submenu( WP_Admin_Bar $wp_admin_bar ) {
		$adwords_url = 'https://adwords.google.com/keywordplanner';
		$trends_url  = 'https://www.google.com/trends/explore';
		$seobook_url = 'http://tools.seobook.com/keyword-tools/seobook/';

		$post = $this->get_singular_post();
		if ( $post ) {
			$focus_keyword = $this->get_post_focus_keyword( $post );

			if ( ! empty( $focus_keyword ) ) {
				$trends_url  .= '#q=' . urlencode( $focus_keyword );
				$seobook_url .= '?keyword=' . urlencode( $focus_keyword );
			}
		}

		$wp_admin_bar->add_menu( array(
			'parent' => self::MENU_IDENTIFIER,
			'id'     => self::KEYWORD_RESEARCH_SUBMENU_IDENTIFIER,
			'title'  => __( 'Keyword Research', 'wordpress-seo' ),
			'meta'   => array( 'tabindex' => '0' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::KEYWORD_RESEARCH_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-kwresearchtraining',
			'title'  => __( 'Keyword research training', 'wordpress-seo' ),
			'href'   => WPSEO_Shortlinker::get( 'https://yoa.st/wp-admin-bar' ),
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::KEYWORD_RESEARCH_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-adwordsexternal',
			'title'  => __( 'AdWords External', 'wordpress-seo' ),
			'href'   => $adwords_url,
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::KEYWORD_RESEARCH_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-googleinsights',
			'title'  => __( 'Google Trends', 'wordpress-seo' ),
			'href'   => $trends_url,
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::KEYWORD_RESEARCH_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-wordtracker',
			'title'  => __( 'SEO Book', 'wordpress-seo' ),
			'href'   => $seobook_url,
			'meta'   => array( 'target' => '_blank' ),
		) );
	}

	/**
	 * Adds the admin bar analysis submenu.
	 *
	 * @param WP_Admin_Bar $wp_admin_bar Admin bar instance to add the menu to.
	 *
	 * @return void
	 */
	protected function add_analysis_submenu( WP_Admin_Bar $wp_admin_bar ) {
		$url           = WPSEO_Frontend::get_instance()->canonical( false );
		$focus_keyword = '';

		if ( ! $url ) {
			return;
		}

		$post = $this->get_singular_post();
		if ( $post ) {
			$focus_keyword = $this->get_post_focus_keyword( $post );
		}

		$wp_admin_bar->add_menu( array(
			'parent' => self::MENU_IDENTIFIER,
			'id'     => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'title'  => __( 'Analyze this page', 'wordpress-seo' ),
			'meta'   => array( 'tabindex' => '0' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-inlinks',
			'title'  => __( 'Check links to this URL', 'wordpress-seo' ),
			'href'   => 'https://search.google.com/search-console/links/drilldown?resource_id=' . urlencode( get_option( 'siteurl' ) ) . '&type=EXTERNAL&target=' . urlencode( $url ) . '&domain=',
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-kwdensity',
			'title'  => __( 'Check Keyphrase Density', 'wordpress-seo' ),
			// HTTPS not available.
			'href'   => 'http://www.zippy.co.uk/keyworddensity/index.php?url=' . urlencode( $url ) . '&keyword=' . urlencode( $focus_keyword ),
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-cache',
			'title'  => __( 'Check Google Cache', 'wordpress-seo' ),
			'href'   => '//webcache.googleusercontent.com/search?strip=1&q=cache:' . urlencode( $url ),
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-header',
			'title'  => __( 'Check Headers', 'wordpress-seo' ),
			'href'   => '//quixapp.com/headers/?r=' . urlencode( $url ),
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-structureddata',
			'title'  => __( 'Google Structured Data Test', 'wordpress-seo' ),
			'href'   => 'https://search.google.com/structured-data/testing-tool#url=' . urlencode( $url ),
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-facebookdebug',
			'title'  => __( 'Facebook Debugger', 'wordpress-seo' ),
			'href'   => '//developers.facebook.com/tools/debug/og/object?q=' . urlencode( $url ),
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-pinterestvalidator',
			'title'  => __( 'Pinterest Rich Pins Validator', 'wordpress-seo' ),
			'href'   => 'https://developers.pinterest.com/tools/url-debugger/?link=' . urlencode( $url ),
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-htmlvalidation',
			'title'  => __( 'HTML Validator', 'wordpress-seo' ),
			'href'   => '//validator.w3.org/check?uri=' . urlencode( $url ),
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-cssvalidation',
			'title'  => __( 'CSS Validator', 'wordpress-seo' ),
			'href'   => '//jigsaw.w3.org/css-validator/validator?uri=' . urlencode( $url ),
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-pagespeed',
			'title'  => __( 'Google Page Speed Test', 'wordpress-seo' ),
			'href'   => '//developers.google.com/speed/pagespeed/insights/?url=' . urlencode( $url ),
			'meta'   => array( 'target' => '_blank' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'id'     => 'wpseo-google-mobile-friendly',
			'title'  => __( 'Mobile-Friendly Test', 'wordpress-seo' ),
			'href'   => 'https://www.google.com/webmasters/tools/mobile-friendly/?url=' . urlencode( $url ),
			'meta'   => array( 'target' => '_blank' ),
		) );
	}

	/**
	 * Adds the admin bar settings submenu.
	 *
	 * @param WP_Admin_Bar $wp_admin_bar Admin bar instance to add the menu to.
	 *
	 * @return void
	 */
	protected function add_settings_submenu( WP_Admin_Bar $wp_admin_bar ) {
		if ( ! $this->can_manage_options() ) {
			return;
		}

		$admin_menu    = new WPSEO_Admin_Menu( new WPSEO_Menu() );
		$submenu_pages = $admin_menu->get_submenu_pages();

		$wp_admin_bar->add_menu( array(
			'parent' => self::MENU_IDENTIFIER,
			'id'     => self::SETTINGS_SUBMENU_IDENTIFIER,
			'title'  => __( 'SEO Settings', 'wordpress-seo' ),
			'meta'   => array( 'tabindex' => '0' ),
		) );

		foreach ( $submenu_pages as $submenu_page ) {
			if ( ! current_user_can( $submenu_page[3] ) ) {
				continue;
			}

			$id = 'wpseo-' . str_replace( '_', '-', str_replace( 'wpseo_', '', $submenu_page[4] ) );
			if ( $id === 'wpseo-dashboard' ) {
				$id = 'wpseo-general';
			}

			$wp_admin_bar->add_menu( array(
				'parent' => self::SETTINGS_SUBMENU_IDENTIFIER,
				'id'     => $id,
				'title'  => $submenu_page[2],
				'href'   => admin_url( 'admin.php?page=' . urlencode( $submenu_page[4] ) ),
			) );
		}
	}

	/**
	 * Adds the admin bar network settings submenu.
	 *
	 * @param WP_Admin_Bar $wp_admin_bar Admin bar instance to add the menu to.
	 *
	 * @return void
	 */
	protected function add_network_settings_submenu( WP_Admin_Bar $wp_admin_bar ) {
		if ( ! $this->can_manage_options() ) {
			return;
		}

		$network_admin_menu = new WPSEO_Network_Admin_Menu( new WPSEO_Menu() );
		$submenu_pages      = $network_admin_menu->get_submenu_pages();

		$wp_admin_bar->add_menu( array(
			'parent' => self::MENU_IDENTIFIER,
			'id'     => self::NETWORK_SETTINGS_SUBMENU_IDENTIFIER,
			'title'  => __( 'SEO Settings', 'wordpress-seo' ),
			'meta'   => array( 'tabindex' => '0' ),
		) );

		foreach ( $submenu_pages as $submenu_page ) {
			if ( ! current_user_can( $submenu_page[3] ) ) {
				continue;
			}

			$id = 'wpseo-' . str_replace( '_', '-', str_replace( 'wpseo_', '', $submenu_page[4] ) );
			if ( $id === 'wpseo-dashboard' ) {
				$id = 'wpseo-general';
			}

			$wp_admin_bar->add_menu( array(
				'parent' => self::NETWORK_SETTINGS_SUBMENU_IDENTIFIER,
				'id'     => $id,
				'title'  => $submenu_page[2],
				'href'   => network_admin_url( 'admin.php?page=' . urlencode( $submenu_page[4] ) ),
			) );
		}
	}

	/**
	 * Gets the menu title markup.
	 *
	 * @return string Admin bar title markup.
	 */
	protected function get_title() {
		return '<div id="yoast-ab-icon" class="ab-item yoast-logo svg"><span class="screen-reader-text">' . __( 'SEO', 'wordpress-seo' ) . '</span></div>';
	}

	/**
	 * Gets the current post if in a singular post context.
	 *
	 * @global string       $pagenow Current page identifier.
	 * @global WP_Post|null $post    Current post object, or null if none available.
	 *
	 * @return WP_Post|null Post object, or null if not in singular context.
	 */
	protected function get_singular_post() {
		global $pagenow, $post;

		if ( ! is_singular() && ( ! is_blog_admin() || ! WPSEO_Metabox::is_post_edit( $pagenow ) ) ) {
			return null;
		}

		if ( ! isset( $post ) || ! is_object( $post ) ) {
			return null;
		}

		return $post;
	}

	/**
	 * Gets the focus keyword for a given post.
	 *
	 * @param WP_Post $post Post object to get its focus keyword.
	 *
	 * @return string Focus keyword, or empty string if none available.
	 */
	protected function get_post_focus_keyword( WP_Post $post ) {
		if ( apply_filters( 'wpseo_use_page_analysis', true ) !== true ) {
			return '';
		}

		return WPSEO_Meta::get_value( 'focuskw', $post->ID );
	}

	/**
	 * Gets the score for a given post.
	 *
	 * @param WP_Post $post Post object to get its score.
	 *
	 * @return string Score markup, or empty string if none available.
	 */
	protected function get_post_score( $post ) {
		if ( ! is_object( $post ) || ! property_exists( $post, 'ID' ) ) {
			return '';
		}

		if ( apply_filters( 'wpseo_use_page_analysis', true ) !== true ) {
			return '';
		}

		$analysis_seo         = new WPSEO_Metabox_Analysis_SEO();
		$analysis_readability = new WPSEO_Metabox_Analysis_Readability();

		if ( $analysis_seo->is_enabled() ) {
			return $this->get_score( WPSEO_Meta::get_value( 'linkdex', $post->ID ) );
		}

		if ( $analysis_readability->is_enabled() ) {
			return $this->get_score( WPSEO_Meta::get_value( 'content_score', $post->ID ) );
		}

		return '';
	}

	/**
	 * Gets the current term if in a singular term context.
	 *
	 * @global string       $pagenow  Current page identifier.
	 * @global WP_Query     $wp_query Current query object.
	 * @global WP_Term|null $tag      Current term object, or null if none available.
	 *
	 * @return WP_Term|null Term object, or null if not in singular context.
	 */
	protected function get_singular_term() {
		global $pagenow, $wp_query, $tag;

		if ( is_category() || is_tag() || is_tax() ) {
			return $wp_query->get_queried_object();
		}

		if ( WPSEO_Taxonomy::is_term_edit( $pagenow ) && ! WPSEO_Taxonomy::is_term_overview( $pagenow ) && isset( $tag ) && is_object( $tag ) && ! is_wp_error( $tag ) ) {
			return get_term( $tag->term_id );
		}

		return null;
	}

	/**
	 * Gets the score for a given term.
	 *
	 * @param WP_Term $term Term object to get its score.
	 *
	 * @return string Score markup, or empty string if none available.
	 */
	protected function get_term_score( $term ) {
		if ( ! is_object( $term ) || ! property_exists( $term, 'term_id' ) || ! property_exists( $term, 'taxonomy' ) ) {
			return '';
		}

		$analysis_seo         = new WPSEO_Metabox_Analysis_SEO();
		$analysis_readability = new WPSEO_Metabox_Analysis_Readability();

		if ( $analysis_seo->is_enabled() ) {
			return $this->get_score( WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, $term->taxonomy, 'linkdex' ) );
		}

		if ( $analysis_readability->is_enabled() ) {
			return $this->get_score( WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, $term->taxonomy, 'content_score' ) );
		}

		return '';
	}

	/**
	 * Takes the SEO score and makes the score icon for the admin bar for it.
	 *
	 * @param int $score The 0-100 rating of the score. Can be either SEO score or content score.
	 *
	 * @return string Score markup.
	 */
	protected function get_score( $score ) {
		$score = WPSEO_Utils::translate_score( $score );

		$score_adminbar_element = '<div class="wpseo-score-icon adminbar-seo-score ' . $score . '"><span class="adminbar-seo-score-text screen-reader-text"></span></div>';

		return $score_adminbar_element;
	}

	/**
	 * Gets the URL to the main admin settings page.
	 *
	 * @return string Admin settings page URL.
	 */
	protected function get_settings_page_url() {
		return self_admin_url( 'admin.php?page=' . WPSEO_Admin::PAGE_IDENTIFIER );
	}

	/**
	 * Gets the notification counter if in a valid context.
	 *
	 * @return string Notification counter markup, or empty string if not available.
	 */
	protected function get_notification_counter() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_count  = $notification_center->get_notification_count();

		if ( ! $notification_count ) {
			return '';
		}

		/* translators: %s: number of notifications */
		$counter_screen_reader_text = sprintf( _n( '%s notification', '%s notifications', $notification_count, 'wordpress-seo' ), number_format_i18n( $notification_count ) );

		return sprintf( ' <div class="wp-core-ui wp-ui-notification yoast-issue-counter"><span aria-hidden="true">%d</span><span class="screen-reader-text">%s</span></div>', $notification_count, $counter_screen_reader_text );
	}

	/**
	 * Gets the notification alert popup if in a valid context.
	 *
	 * @return string Notification alert popup markup, or empty string if not available.
	 */
	protected function get_notification_alert_popup() {
		$notification_center     = Yoast_Notification_Center::get();
		$new_notifications       = $notification_center->get_new_notifications();
		$new_notifications_count = count( $new_notifications );

		if ( ! $new_notifications_count ) {
			return '';
		}

		$notification = sprintf(
			_n(
				'There is a new notification.',
				'There are new notifications.',
				$new_notifications_count,
				'wordpress-seo'
			),
			$new_notifications_count
		);

		return '<div class="yoast-issue-added">' . $notification . '</div>';
	}

	/**
	 * Checks whether the current user can manage options in the current context.
	 *
	 * @return bool True if capabilities are sufficient, false otherwise.
	 */
	protected function can_manage_options() {
		return is_network_admin() && current_user_can( 'wpseo_manage_network_options' ) || ! is_network_admin() && WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' );
	}
}
