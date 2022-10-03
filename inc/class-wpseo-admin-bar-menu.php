<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

use Yoast\WP\SEO\Helpers\Score_Icon_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Class for the Yoast SEO admin bar menu.
 */
class WPSEO_Admin_Bar_Menu implements WPSEO_WordPress_Integration {

	/**
	 * The identifier used for the menu.
	 *
	 * @var string
	 */
	const MENU_IDENTIFIER = 'wpseo-menu';

	/**
	 * The identifier used for the Keyword Research submenu.
	 *
	 * @var string
	 */
	const KEYWORD_RESEARCH_SUBMENU_IDENTIFIER = 'wpseo-kwresearch';

	/**
	 * The identifier used for the Analysis submenu.
	 *
	 * @var string
	 */
	const ANALYSIS_SUBMENU_IDENTIFIER = 'wpseo-analysis';

	/**
	 * The identifier used for the Settings submenu.
	 *
	 * @var string
	 */
	const SETTINGS_SUBMENU_IDENTIFIER = 'wpseo-settings';

	/**
	 * The identifier used for the Network Settings submenu.
	 *
	 * @var string
	 */
	const NETWORK_SETTINGS_SUBMENU_IDENTIFIER = 'wpseo-network-settings';

	/**
	 * Asset manager instance.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Holds the Score_Icon_Helper instance.
	 *
	 * @var Score_Icon_Helper
	 */
	protected $indexable_repository;

	/**
	 * Holds the Score_Icon_Helper instance.
	 *
	 * @var Score_Icon_Helper
	 */
	protected $score_icon_helper;

	/**
	 * Constructs the WPSEO_Admin_Bar_Menu.
	 *
	 * @param WPSEO_Admin_Asset_Manager|null $asset_manager        Optional. Asset manager to use.
	 * @param Indexable_Repository|null      $indexable_repository Optional. The Indexable_Repository.
	 * @param Score_Icon_Helper|null         $score_icon_helper    Optional. The Score_Icon_Helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager = null,
		Indexable_Repository $indexable_repository = null,
		Score_Icon_Helper $score_icon_helper = null
	) {
		if ( ! $asset_manager ) {
			$asset_manager = new WPSEO_Admin_Asset_Manager();
		}
		if ( ! $indexable_repository ) {
			$indexable_repository = YoastSEO()->classes->get( Indexable_Repository::class );
		}
		if ( ! $score_icon_helper ) {
			$score_icon_helper = YoastSEO()->helpers->score_icon;
		}

		$this->asset_manager        = $asset_manager;
		$this->indexable_repository = $indexable_repository;
		$this->score_icon_helper    = $score_icon_helper;
	}

	/**
	 * Adds the admin bar menu.
	 *
	 * @param WP_Admin_Bar $wp_admin_bar Admin bar instance to add the menu to.
	 *
	 * @return void
	 */
	public function add_menu( WP_Admin_Bar $wp_admin_bar ) {
		// On block editor pages, the admin bar only shows on mobile, where having this menu icon is not very helpful.
		if ( is_admin() ) {
			$screen = get_current_screen();
			if ( isset( $screen ) && $screen->is_block_editor() ) {
				return;
			}
		}

		// If the current user can't write posts, this is all of no use, so let's not output an admin menu.
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}

		$this->add_root_menu( $wp_admin_bar );

		/**
		* Adds a submenu item in the top of the adminbar.
		*
		* @param WP_Admin_Bar $wp_admin_bar    Admin bar instance to add the menu to.
		* @param string       $menu_identifier The menu identifier.
		*/
		do_action( 'wpseo_add_adminbar_submenu', $wp_admin_bar, self::MENU_IDENTIFIER );

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

		add_action( 'admin_bar_menu', [ $this, 'add_menu' ], 95 );

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
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

		$score              = '';
		$settings_url       = '';
		$counter            = '';
		$notification_popup = '';

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
			$counter            = $this->get_notification_counter();
			$notification_popup = $this->get_notification_popup();
		}

		$admin_bar_menu_args = [
			'id'    => self::MENU_IDENTIFIER,
			'title' => $title . $score . $counter . $notification_popup,
			'href'  => $settings_url,
			'meta'  => [ 'tabindex' => ! empty( $settings_url ) ? false : '0' ],
		];
		$wp_admin_bar->add_menu( $admin_bar_menu_args );

		if ( ! empty( $counter ) ) {
			$admin_bar_menu_args = [
				'parent' => self::MENU_IDENTIFIER,
				'id'     => 'wpseo-notifications',
				'title'  => __( 'Notifications', 'wordpress-seo' ) . $counter,
				'href'   => $settings_url,
				'meta'   => [ 'tabindex' => ! empty( $settings_url ) ? false : '0' ],
			];
			$wp_admin_bar->add_menu( $admin_bar_menu_args );
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
		$adwords_url = 'https://yoa.st/keywordplanner';
		$trends_url  = 'https://yoa.st/google-trends';

		$post = $this->get_singular_post();
		if ( $post ) {
			$focus_keyword = $this->get_post_focus_keyword( $post );

			if ( ! empty( $focus_keyword ) ) {
				$trends_url .= '#q=' . rawurlencode( $focus_keyword );
			}
		}

		$menu_args = [
			'parent' => self::MENU_IDENTIFIER,
			'id'     => self::KEYWORD_RESEARCH_SUBMENU_IDENTIFIER,
			'title'  => __( 'Keyword Research', 'wordpress-seo' ),
			'meta'   => [ 'tabindex' => '0' ],
		];
		$wp_admin_bar->add_menu( $menu_args );

		$submenu_items = [
			[
				'id'    => 'wpseo-kwresearchtraining',
				'title' => __( 'Keyword research training', 'wordpress-seo' ),
				'href'  => WPSEO_Shortlinker::get( 'https://yoa.st/wp-admin-bar' ),
			],
			[
				'id'    => 'wpseo-adwordsexternal',
				'title' => __( 'Google Ads', 'wordpress-seo' ),
				'href'  => $adwords_url,
			],
			[
				'id'    => 'wpseo-googleinsights',
				'title' => __( 'Google Trends', 'wordpress-seo' ),
				'href'  => $trends_url,
			],
		];

		foreach ( $submenu_items as $menu_item ) {
			$menu_args = [
				'parent' => self::KEYWORD_RESEARCH_SUBMENU_IDENTIFIER,
				'id'     => $menu_item['id'],
				'title'  => $menu_item['title'],
				'href'   => $menu_item['href'],
				'meta'   => [ 'target' => '_blank' ],
			];
			$wp_admin_bar->add_menu( $menu_args );
		}
	}

	/**
	 * Adds the admin bar analysis submenu.
	 *
	 * @param WP_Admin_Bar $wp_admin_bar Admin bar instance to add the menu to.
	 *
	 * @return void
	 */
	protected function add_analysis_submenu( WP_Admin_Bar $wp_admin_bar ) {
		try {
			$url = YoastSEO()->meta->for_current_page()->canonical;
		} catch ( Exception $e ) {
			// This is not the type of error we can handle here.
			return;
		}

		$focus_keyword = '';

		if ( ! $url ) {
			return;
		}

		$post = $this->get_singular_post();
		if ( $post ) {
			$focus_keyword = $this->get_post_focus_keyword( $post );
		}

		$menu_args = [
			'parent' => self::MENU_IDENTIFIER,
			'id'     => self::ANALYSIS_SUBMENU_IDENTIFIER,
			'title'  => __( 'Analyze this page', 'wordpress-seo' ),
			'meta'   => [ 'tabindex' => '0' ],
		];
		$wp_admin_bar->add_menu( $menu_args );

		$encoded_url   = rawurlencode( $url );
		$submenu_items = [
			[
				'id'    => 'wpseo-inlinks',
				'title' => __( 'Check links to this URL', 'wordpress-seo' ),
				'href'  => 'https://search.google.com/search-console/links/drilldown?resource_id=' . rawurlencode( get_option( 'siteurl' ) ) . '&type=EXTERNAL&target=' . $encoded_url . '&domain=',
			],
			[
				'id'    => 'wpseo-kwdensity',
				'title' => __( 'Check Keyphrase Density', 'wordpress-seo' ),
				// HTTPS not available.
				'href'  => 'http://www.zippy.co.uk/keyworddensity/index.php?url=' . $encoded_url . '&keyword=' . rawurlencode( $focus_keyword ),
			],
			[
				'id'    => 'wpseo-cache',
				'title' => __( 'Check Google Cache', 'wordpress-seo' ),
				'href'  => '//webcache.googleusercontent.com/search?strip=1&q=cache:' . $encoded_url,
			],
			[
				'id'    => 'wpseo-structureddata',
				'title' => __( 'Google Rich Results Test', 'wordpress-seo' ),
				'href'  => 'https://search.google.com/test/rich-results?url=' . $encoded_url,
			],
			[
				'id'    => 'wpseo-facebookdebug',
				'title' => __( 'Facebook Debugger', 'wordpress-seo' ),
				'href'  => '//developers.facebook.com/tools/debug/?q=' . $encoded_url,
			],
			[
				'id'    => 'wpseo-pinterestvalidator',
				'title' => __( 'Pinterest Rich Pins Validator', 'wordpress-seo' ),
				'href'  => 'https://developers.pinterest.com/tools/url-debugger/?link=' . $encoded_url,
			],
			[
				'id'    => 'wpseo-htmlvalidation',
				'title' => __( 'HTML Validator', 'wordpress-seo' ),
				'href'  => '//validator.w3.org/check?uri=' . $encoded_url,
			],
			[
				'id'    => 'wpseo-cssvalidation',
				'title' => __( 'CSS Validator', 'wordpress-seo' ),
				'href'  => '//jigsaw.w3.org/css-validator/validator?uri=' . $encoded_url,
			],
			[
				'id'    => 'wpseo-pagespeed',
				'title' => __( 'Google Page Speed Test', 'wordpress-seo' ),
				'href'  => '//developers.google.com/speed/pagespeed/insights/?url=' . $encoded_url,
			],
			[
				'id'    => 'wpseo-google-mobile-friendly',
				'title' => __( 'Mobile-Friendly Test', 'wordpress-seo' ),
				'href'  => 'https://www.google.com/webmasters/tools/mobile-friendly/?url=' . $encoded_url,
			],
		];

		foreach ( $submenu_items as $menu_item ) {
			$menu_args = [
				'parent' => self::ANALYSIS_SUBMENU_IDENTIFIER,
				'id'     => $menu_item['id'],
				'title'  => $menu_item['title'],
				'href'   => $menu_item['href'],
				'meta'   => [ 'target' => '_blank' ],
			];
			$wp_admin_bar->add_menu( $menu_args );
		}
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

		$menu_args = [
			'parent' => self::MENU_IDENTIFIER,
			'id'     => self::SETTINGS_SUBMENU_IDENTIFIER,
			'title'  => __( 'SEO Settings', 'wordpress-seo' ),
			'meta'   => [ 'tabindex' => '0' ],
		];
		$wp_admin_bar->add_menu( $menu_args );

		foreach ( $submenu_pages as $submenu_page ) {
			if ( ! current_user_can( $submenu_page[3] ) ) {
				continue;
			}

			// Don't add the Google Search Console menu item.
			if ( $submenu_page[4] === 'wpseo_search_console' ) {
				continue;
			}

			$id = 'wpseo-' . str_replace( '_', '-', str_replace( 'wpseo_', '', $submenu_page[4] ) );
			if ( $id === 'wpseo-dashboard' ) {
				$id = 'wpseo-general';
			}

			$menu_args = [
				'parent' => self::SETTINGS_SUBMENU_IDENTIFIER,
				'id'     => $id,
				'title'  => $submenu_page[2],
				'href'   => admin_url( 'admin.php?page=' . rawurlencode( $submenu_page[4] ) ),
			];
			$wp_admin_bar->add_menu( $menu_args );
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

		$menu_args = [
			'parent' => self::MENU_IDENTIFIER,
			'id'     => self::NETWORK_SETTINGS_SUBMENU_IDENTIFIER,
			'title'  => __( 'SEO Settings', 'wordpress-seo' ),
			'meta'   => [ 'tabindex' => '0' ],
		];
		$wp_admin_bar->add_menu( $menu_args );

		foreach ( $submenu_pages as $submenu_page ) {
			if ( ! current_user_can( $submenu_page[3] ) ) {
				continue;
			}

			$id = 'wpseo-' . str_replace( '_', '-', str_replace( 'wpseo_', '', $submenu_page[4] ) );
			if ( $id === 'wpseo-dashboard' ) {
				$id = 'wpseo-general';
			}

			$menu_args = [
				'parent' => self::NETWORK_SETTINGS_SUBMENU_IDENTIFIER,
				'id'     => $id,
				'title'  => $submenu_page[2],
				'href'   => network_admin_url( 'admin.php?page=' . rawurlencode( $submenu_page[4] ) ),
			];
			$wp_admin_bar->add_menu( $menu_args );
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

		if ( ! isset( $post ) || ! is_object( $post ) || ! $post instanceof WP_Post ) {
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
	protected function get_post_focus_keyword( $post ) {
		if ( ! is_object( $post ) || ! property_exists( $post, 'ID' ) ) {
			return '';
		}

		/**
		 * Filter: 'wpseo_use_page_analysis' Determines if the analysis should be enabled.
		 *
		 * @api bool Determines if the analysis should be enabled.
		 */
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

		return $this->get_score_icon();
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

		return $this->get_score_icon();
	}

	/**
	 * Create the score icon.
	 *
	 * @return string The score icon, or empty string.
	 */
	protected function get_score_icon() {
		$is_seo_enabled         = ( new WPSEO_Metabox_Analysis_SEO() )->is_enabled();
		$is_readability_enabled = ( new WPSEO_Metabox_Analysis_Readability() )->is_enabled();

		$indexable = $this->indexable_repository->for_current_page();

		if ( $is_seo_enabled ) {
			return $this->score_icon_helper->for_seo( $indexable, 'adminbar-seo-score' )->present();
		}

		if ( $is_readability_enabled ) {
			return $this->score_icon_helper->for_readability( $indexable->readability_score, 'adminbar-seo-score' )
				->present();
		}

		return '';
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

		return sprintf( ' <div class="wp-core-ui wp-ui-notification yoast-issue-counter"><span class="yoast-issues-count" aria-hidden="true">%d</span><span class="screen-reader-text">%s</span></div>', $notification_count, $counter_screen_reader_text );
	}

	/**
	 * Gets the notification popup if in a valid context.
	 *
	 * @return string Notification popup markup, or empty string if not available.
	 */
	protected function get_notification_popup() {
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
