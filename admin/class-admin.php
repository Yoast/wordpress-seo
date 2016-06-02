<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class that holds most of the admin functionality for Yoast SEO.
 */
class WPSEO_Admin {

	/** The page identifier used in WordPress to register the admin page !DO NOT CHANGE THIS! */
	const PAGE_IDENTIFIER = 'wpseo_dashboard';

	/**
	 * @var array
	 */
	private $options;

	/**
	 * Array of classes that add admin functionality
	 *
	 * @var array
	 */
	protected $admin_features;

	/**
	 * Class constructor
	 */
	function __construct() {
		global $pagenow;

		$this->options = WPSEO_Options::get_options( array( 'wpseo', 'wpseo_permalinks' ) );

		if ( is_multisite() ) {
			WPSEO_Options::maybe_set_multisite_defaults( false );
		}

		if ( $this->options['stripcategorybase'] === true ) {
			add_action( 'created_category', array( $this, 'schedule_rewrite_flush' ) );
			add_action( 'edited_category', array( $this, 'schedule_rewrite_flush' ) );
			add_action( 'delete_category', array( $this, 'schedule_rewrite_flush' ) );
		}

		$this->admin_features = array(
			// Google Search Console.
			'google_search_console' => new WPSEO_GSC(),
			'dashboard_widget'      => new Yoast_Dashboard_Widget(),
		);

		if ( in_array( $pagenow, array( 'post-new.php', 'post.php', 'edit.php' ) ) ) {
			$this->admin_features['primary_category'] = new WPSEO_Primary_Term_Admin();
		}

		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_tools' && filter_input( INPUT_GET, 'tool' ) === null ) {
			new WPSEO_Recalculate_Scores();
		}

		// Needs the lower than default priority so other plugins can hook underneath it without issue.
		add_action( 'admin_menu', array( $this, 'register_settings_page' ), 5 );
		add_action( 'network_admin_menu', array( $this, 'register_network_settings_page' ) );

		add_filter( 'plugin_action_links_' . WPSEO_BASENAME, array( $this, 'add_action_link' ), 10, 2 );

		add_action( 'admin_enqueue_scripts', array( $this, 'config_page_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_global_style' ) );

		if ( $this->options['cleanslugs'] === true ) {
			add_filter( 'name_save_pre', array( $this, 'remove_stopwords_from_slug' ), 0 );
		}

		add_filter( 'user_contactmethods', array( $this, 'update_contactmethods' ), 10, 1 );

		add_action( 'after_switch_theme', array( $this, 'switch_theme' ) );
		add_action( 'switch_theme', array( $this, 'switch_theme' ) );

		add_filter( 'set-screen-option', array( $this, 'save_bulk_edit_options' ), 10, 3 );

		add_action( 'admin_init', array( 'WPSEO_Plugin_Conflict', 'hook_check_for_plugin_conflicts' ), 10, 1 );
		add_action( 'admin_init', array( $this, 'import_plugin_hooks' ) );

		WPSEO_Sitemaps_Cache::register_clear_on_option_update( 'wpseo' );
	}

	/**
	 * Setting the hooks for importing data from other plugins
	 */
	public function import_plugin_hooks() {
		if ( current_user_can( $this->get_manage_options_cap() ) ) {
			$plugin_imports = array(
				'wpSEO'       => new WPSEO_Import_WPSEO_Hooks(),
				'aioseo'      => new WPSEO_Import_AIOSEO_Hooks(),
			);
		}
	}

	/**
	 * Schedules a rewrite flush to happen at shutdown
	 */
	function schedule_rewrite_flush() {
		add_action( 'shutdown', 'flush_rewrite_rules' );
	}

	/**
	 * Returns all the classes for the admin features
	 *
	 * @return array
	 */
	public function get_admin_features() {
		return $this->admin_features;
	}

	/**
	 * Register the menu item and its sub menu's.
	 *
	 * @global array $submenu used to change the label on the first item.
	 */
	function register_settings_page() {
		if ( WPSEO_Utils::grant_access() !== true ) {
			return;
		}

		add_action( 'admin_head', array( $this, 'enqueue_assets' ) );

		// Base 64 encoded SVG image.
		$icon_svg = $this->get_menu_svg();

		$manage_options_cap = $this->get_manage_options_cap();

		$notification_center = Yoast_Notification_Center::get();
		$notification_count  = $notification_center->get_notification_count();

		// Add main page.
		$counter = sprintf( '<span class="update-plugins count-%1$d"><span class="plugin-count">%1$d</span></span>', $notification_count );

		$admin_page = add_menu_page( 'Yoast SEO: ' . __( 'Dashboard', 'wordpress-seo' ), __( 'SEO', 'wordpress-seo' ) . ' ' . $counter, $manage_options_cap, self::PAGE_IDENTIFIER, array(
			$this,
			'load_page',
		), $icon_svg, '99.31337' );

		// Sub menu pages.
		$submenu_pages = array(
			array(
				self::PAGE_IDENTIFIER,
				'',
				__( 'General', 'wordpress-seo' ),
				$manage_options_cap,
				self::PAGE_IDENTIFIER,
				array( $this, 'load_page' ),
				null,
			),
			array(
				self::PAGE_IDENTIFIER,
				'',
				__( 'Titles &amp; Metas', 'wordpress-seo' ),
				$manage_options_cap,
				'wpseo_titles',
				array( $this, 'load_page' ),
			),
			array(
				self::PAGE_IDENTIFIER,
				'',
				__( 'Social', 'wordpress-seo' ),
				$manage_options_cap,
				'wpseo_social',
				array( $this, 'load_page' ),
				null,
			),
			array(
				self::PAGE_IDENTIFIER,
				'',
				__( 'XML Sitemaps', 'wordpress-seo' ),
				$manage_options_cap,
				'wpseo_xml',
				array( $this, 'load_page' ),
				null,
			),
			array(
				self::PAGE_IDENTIFIER,
				'',
				__( 'Advanced', 'wordpress-seo' ),
				$manage_options_cap,
				'wpseo_advanced',
				array( $this, 'load_page' ),
				null,
			),
			array(
				self::PAGE_IDENTIFIER,
				'',
				__( 'Tools', 'wordpress-seo' ),
				$manage_options_cap,
				'wpseo_tools',
				array( $this, 'load_page' ),
				null,
			),
			array(
				self::PAGE_IDENTIFIER,
				'',
				__( 'Search Console', 'wordpress-seo' ),
				$manage_options_cap,
				'wpseo_search_console',
				array( $this->admin_features['google_search_console'], 'display' ),
				array( array( $this->admin_features['google_search_console'], 'set_help' ) ),
			),
			array(
				self::PAGE_IDENTIFIER,
				'',
				'<span style="color:#f18500">' . __( 'Extensions', 'wordpress-seo' ) . '</span>',
				$manage_options_cap,
				'wpseo_licenses',
				array( $this, 'load_page' ),
				null,
			),

		);

		// Allow submenu pages manipulation.
		$submenu_pages = apply_filters( 'wpseo_submenu_pages', $submenu_pages );

		// Loop through submenu pages and add them.
		if ( count( $submenu_pages ) ) {
			foreach ( $submenu_pages as $submenu_page ) {

				// Add submenu page.
				$admin_page = add_submenu_page( $submenu_page[0], $submenu_page[2] . ' - Yoast SEO', $submenu_page[2], $submenu_page[3], $submenu_page[4], $submenu_page[5] );

				// Check if we need to hook.
				if ( isset( $submenu_page[6] ) && ( is_array( $submenu_page[6] ) && $submenu_page[6] !== array() ) ) {
					foreach ( $submenu_page[6] as $submenu_page_action ) {
						add_action( 'load-' . $admin_page, $submenu_page_action );
					}
				}
			}
		}

		global $submenu;
		if ( isset( $submenu[ self::PAGE_IDENTIFIER ] ) && current_user_can( $manage_options_cap ) ) {
			$submenu[ self::PAGE_IDENTIFIER ][0][0] = __( 'Dashboard', 'wordpress-seo' );
		}
	}

	/**
	 * Register assets needed on admin pages
	 */
	public function enqueue_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_style( 'help-center' );
	}

	/**
	 * Returns the manage_options cap
	 *
	 * @return mixed|void
	 */
	private function get_manage_options_cap() {
		/**
		 * Filter: 'wpseo_manage_options_capability' - Allow changing the capability users need to view the settings pages
		 *
		 * @api string unsigned The capability
		 */
		$manage_options_cap = apply_filters( 'wpseo_manage_options_capability', 'manage_options' );

		return $manage_options_cap;
	}

	/**
	 * Adds contextual help to the titles & metas page.
	 */
	function title_metas_help_tab() {
		$screen = get_current_screen();

		$screen->set_help_sidebar( '
			<p><strong>' . __( 'For more information:', 'wordpress-seo' ) . '</strong></p>
			<p><a target="_blank" href="https://yoast.com/wordpress-seo/#titles">' . __( 'Title optimization', 'wordpress-seo' ) . '</a></p>
			<p><a target="_blank" href="https://yoast.com/google-page-title/">' . __( 'Why Google won\'t display the right page title', 'wordpress-seo' ) . '</a></p>'
		);

		$screen->add_help_tab(
			array(
				'id'      => 'basic-help',
				'title'   => __( 'Template explanation', 'wordpress-seo' ),
				/* translators: %1$s expands to Yoast SEO */
				'content' => '<p>' . sprintf( __( 'The title &amp; metas settings for %1$s are made up of variables that are replaced by specific values from the page when the page is displayed. The tabs on the left explain the available variables.', 'wordpress-seo' ), 'Yoast SEO' ) . '</p>' . '<p>' . __( 'Note that not all variables can be used in every template.', 'wordpress-seo' ) . '</p>',
			)
		);

		$screen->add_help_tab(
			array(
				'id'      => 'title-vars',
				'title'   => __( 'Basic Variables', 'wordpress-seo' ),
				'content' => "\n\t\t<h2>" . __( 'Basic Variables', 'wordpress-seo' ) . "</h2>\n\t\t" . WPSEO_Replace_Vars::get_basic_help_texts(),
			)
		);

		$screen->add_help_tab(
			array(
				'id'      => 'title-vars-advanced',
				'title'   => __( 'Advanced Variables', 'wordpress-seo' ),
				'content' => "\n\t\t<h2>" . __( 'Advanced Variables', 'wordpress-seo' ) . "</h2>\n\t\t" . WPSEO_Replace_Vars::get_advanced_help_texts(),
			)
		);
	}

	/**
	 * Register the settings page for the Network settings.
	 */
	function register_network_settings_page() {
		if ( WPSEO_Utils::grant_access() ) {
			// Base 64 encoded SVG image.
			$icon_svg = $this->get_menu_svg();
			add_menu_page( 'Yoast SEO: ' . __( 'MultiSite Settings', 'wordpress-seo' ), __( 'SEO', 'wordpress-seo' ), 'delete_users', self::PAGE_IDENTIFIER, array(
				$this,
				'network_config_page',
			), $icon_svg );

			if ( WPSEO_Utils::allow_system_file_edit() === true ) {
				add_submenu_page( self::PAGE_IDENTIFIER, 'Yoast SEO: ' . __( 'Edit Files', 'wordpress-seo' ), __( 'Edit Files', 'wordpress-seo' ), 'delete_users', 'wpseo_files', array(
					$this,
					'load_page',
				) );
			}

			// Add Extension submenu page.
			add_submenu_page( self::PAGE_IDENTIFIER, 'Yoast SEO: ' . __( 'Extensions', 'wordpress-seo' ), __( 'Extensions', 'wordpress-seo' ), 'delete_users', 'wpseo_licenses', array(
				$this,
				'load_page',
			) );
		}
	}


	/**
	 * Load the form for a WPSEO admin page
	 */
	function load_page() {
		$page = filter_input( INPUT_GET, 'page' );

		switch ( $page ) {
			case 'wpseo_advanced':
				require_once( WPSEO_PATH . 'admin/pages/advanced.php' );
				break;

			case 'wpseo_tools':
				require_once( WPSEO_PATH . 'admin/pages/tools.php' );
				break;

			case 'wpseo_titles':
				require_once( WPSEO_PATH . 'admin/pages/metas.php' );
				break;

			case 'wpseo_social':
				require_once( WPSEO_PATH . 'admin/pages/social.php' );
				break;

			case 'wpseo_xml':
				require_once( WPSEO_PATH . 'admin/pages/xml-sitemaps.php' );
				break;

			case 'wpseo_licenses':
				require_once( WPSEO_PATH . 'admin/pages/licenses.php' );
				break;

			case 'wpseo_files':
				require_once( WPSEO_PATH . 'admin/views/tool-file-editor.php' );
				break;

			case 'wpseo_tutorial_videos':
				require_once( WPSEO_PATH . 'admin/pages/tutorial-videos.php' );
				break;

			case self::PAGE_IDENTIFIER:
			default:
				require_once( WPSEO_PATH . 'admin/pages/dashboard.php' );
				break;
		}
	}


	/**
	 * Loads the form for the network configuration page.
	 */
	function network_config_page() {
		require_once( WPSEO_PATH . 'admin/pages/network.php' );
	}


	/**
	 * Adds the ability to choose how many posts are displayed per page
	 * on the bulk edit pages.
	 */
	function bulk_edit_options() {
		$option = 'per_page';
		$args   = array(
			'label'   => __( 'Posts', 'wordpress-seo' ),
			'default' => 10,
			'option'  => 'wpseo_posts_per_page',
		);
		add_screen_option( $option, $args );
	}

	/**
	 * Saves the posts per page limit for bulk edit pages.
	 *
	 * @param int    $status Status value to pass through.
	 * @param string $option Option name.
	 * @param int    $value  Count value to check.
	 *
	 * @return int
	 */
	function save_bulk_edit_options( $status, $option, $value ) {
		if ( 'wpseo_posts_per_page' === $option && ( $value > 0 && $value < 1000 ) ) {
			return $value;
		}

		return $status;
	}

	/**
	 * Add a link to the settings page to the plugins list
	 *
	 * @staticvar string $this_plugin holds the directory & filename for the plugin
	 *
	 * @param array  $links array of links for the plugins, adapted when the current plugin is found.
	 * @param string $file  the filename for the current plugin, which the filter loops through.
	 *
	 * @return array $links
	 */
	function add_action_link( $links, $file ) {
		if ( WPSEO_BASENAME === $file && WPSEO_Utils::grant_access() ) {
			$settings_link = '<a href="' . esc_url( admin_url( 'admin.php?page=' . self::PAGE_IDENTIFIER ) ) . '">' . __( 'Settings', 'wordpress-seo' ) . '</a>';
			array_unshift( $links, $settings_link );
		}

		if ( class_exists( 'WPSEO_Product_Premium' ) ) {
			$license_manager = new Yoast_Plugin_License_Manager( new WPSEO_Product_Premium() );
			if ( $license_manager->license_is_valid() ) {
				return $links;
			}
		}

		// Add link to premium support landing page.
		$premium_link = '<a href="https://yoast.com/wordpress/plugins/seo-premium/support/#utm_source=wordpress-seo-settings-link&amp;utm_medium=textlink&amp;utm_campaign=support-link">' . __( 'Premium Support', 'wordpress-seo' ) . '</a>';
		array_unshift( $links, $premium_link );

		// Add link to docs.
		$faq_link = '<a href="https://yoast.com/wordpress/plugins/seo/faq/">' . __( 'FAQ', 'wordpress-seo' ) . '</a>';
		array_unshift( $links, $faq_link );

		return $links;
	}

	/**
	 * Enqueues the (tiny) global JS needed for the plugin.
	 */
	function config_page_scripts() {
		if ( WPSEO_Utils::grant_access() ) {
			$asset_manager = new WPSEO_Admin_Asset_Manager();
			$asset_manager->enqueue_script( 'admin-global-script' );

			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-global-script', 'wpseoAdminGlobalL10n', $this->localize_admin_global_script() );
		}
	}

	/**
	 * Enqueues the (tiny) global stylesheet needed for the plugin.
     */
	public function enqueue_global_style() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_style( 'admin-global' );
	}

	/**
	 * Filter the $contactmethods array and add Facebook, Google+ and Twitter.
	 *
	 * These are used with the Facebook author, rel="author" and Twitter cards implementation.
	 *
	 * @param array $contactmethods currently set contactmethods.
	 *
	 * @return array $contactmethods with added contactmethods.
	 */
	public function update_contactmethods( $contactmethods ) {
		// Add Google+.
		$contactmethods['googleplus'] = __( 'Google+', 'wordpress-seo' );
		// Add Twitter.
		$contactmethods['twitter'] = __( 'Twitter username (without @)', 'wordpress-seo' );
		// Add Facebook.
		$contactmethods['facebook'] = __( 'Facebook profile URL', 'wordpress-seo' );

		return $contactmethods;
	}

	/**
	 * Cleans stopwords out of the slug, if the slug hasn't been set yet.
	 *
	 * @since 1.1.7
	 *
	 * @param string $slug if this isn't empty, the function will return an unaltered slug.
	 *
	 * @return string $clean_slug cleaned slug
	 */
	function remove_stopwords_from_slug( $slug ) {
		return $this->filter_stopwords_from_slug( $slug, filter_input( INPUT_POST, 'post_title' ) );
	}

	/**
	 * Filter the stopwords from the slug
	 *
	 * @param string $slug       The current slug, if not empty there will be done nothing.
	 * @param string $post_title The title which will be used in case of an empty slug.
	 *
	 * @return string
	 */
	public function filter_stopwords_from_slug( $slug, $post_title ) {
		// Don't change an existing slug.
		if ( isset( $slug ) && $slug !== '' ) {
			return $slug;
		}

		// When the post title is empty, just return the slug.
		if ( empty( $post_title ) ) {
			return $slug;
		}

		// Don't change the slug if this is a multisite installation and the site has been switched.
		if ( is_multisite() && ms_is_switched() ) {
			return $slug;
		}

		// Don't change slug if the post is a draft, this conflicts with polylang.
		// Doesn't work with filter_input() since need current value, not originally submitted one.
		if ( 'draft' === $_POST['post_status'] ) {
			return $slug;
		}

		// Lowercase the slug and strip slashes.
		$new_slug = sanitize_title( stripslashes( $post_title ) );

		$stop_words = new WPSEO_Admin_Stop_Words();
		return $stop_words->remove_in( $new_slug );
	}

	/**
	 * Returns the stopwords for the current language
	 *
	 * @since 1.1.7
	 * @deprecated 3.1 Use WPSEO_Admin_Stop_Words::list_stop_words() instead.
	 *
	 * @return array $stopwords array of stop words to check and / or remove from slug
	 */
	function stopwords() {
		$stop_words = new WPSEO_Admin_Stop_Words();
		return $stop_words->list_stop_words();
	}


	/**
	 * Check whether the stopword appears in the string
	 *
	 * @deprecated 3.1
	 *
	 * @param string $haystack    The string to be checked for the stopword.
	 * @param bool   $checkingUrl Whether or not we're checking a URL.
	 *
	 * @return bool|mixed
	 */
	function stopwords_check( $haystack, $checkingUrl = false ) {
		$stopWords = $this->stopwords();

		if ( is_array( $stopWords ) && $stopWords !== array() ) {
			foreach ( $stopWords as $stopWord ) {
				// If checking a URL remove the single quotes.
				if ( $checkingUrl ) {
					$stopWord = str_replace( "'", '', $stopWord );
				}

				// Check whether the stopword appears as a whole word.
				// @todo [JRF => whomever] check whether the use of \b (=word boundary) would be more efficient ;-).
				$res = preg_match( "`(^|[ \n\r\t\.,'\(\)\"\+;!?:])" . preg_quote( $stopWord, '`' ) . "($|[ \n\r\t\.,'\(\)\"\+;!?:])`iu", $haystack );
				if ( $res > 0 ) {
					return $stopWord;
				}
			}
		}

		return false;
	}

	/**
	 * Log the updated timestamp for user profiles when theme is changed
	 */
	function switch_theme() {
		$users = get_users( array( 'who' => 'authors' ) );
		if ( is_array( $users ) && $users !== array() ) {
			foreach ( $users as $user ) {
				update_user_meta( $user->ID, '_yoast_wpseo_profile_updated', time() );
			}
		}
	}

	/**
	 * Returns a base64 URL for the svg for use in the menu
	 *
	 * @return string
	 */
	private function get_menu_svg() {
		$icon_svg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9Im5vbmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48Zz48Zz48Zz48Zz48cGF0aCBzdHlsZT0iZmlsbDojMDAwIiBkPSJNMjAzLjYsMzk1YzYuOC0xNy40LDYuOC0zNi42LDAtNTRsLTc5LjQtMjA0aDcwLjlsNDcuNywxNDkuNGw3NC44LTIwNy42SDExNi40Yy00MS44LDAtNzYsMzQuMi03Niw3NlYzNTdjMCw0MS44LDM0LjIsNzYsNzYsNzZIMTczQzE4OSw0MjQuMSwxOTcuNiw0MTAuMywyMDMuNiwzOTV6Ii8+PC9nPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiMwMDAiIGQ9Ik00NzEuNiwxNTQuOGMwLTQxLjgtMzQuMi03Ni03Ni03NmgtM0wyODUuNywzNjVjLTkuNiwyNi43LTE5LjQsNDkuMy0zMC4zLDY4aDIxNi4yVjE1NC44eiIvPjwvZz48L2c+PHBhdGggc3R5bGU9ImZpbGw6IzAwMCIgc3Ryb2tlLXdpZHRoPSIyLjk3NCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMzM4LDEuM2wtOTMuMywyNTkuMWwtNDIuMS0xMzEuOWgtODkuMWw4My44LDIxNS4yYzYsMTUuNSw2LDMyLjUsMCw0OGMtNy40LDE5LTE5LDM3LjMtNTMsNDEuOWwtNy4yLDF2NzZoOC4zYzgxLjcsMCwxMTguOS01Ny4yLDE0OS42LTE0Mi45TDQzMS42LDEuM0gzMzh6IE0yNzkuNCwzNjJjLTMyLjksOTItNjcuNiwxMjguNy0xMjUuNywxMzEuOHYtNDVjMzcuNS03LjUsNTEuMy0zMSw1OS4xLTUxLjFjNy41LTE5LjMsNy41LTQwLjcsMC02MGwtNzUtMTkyLjdoNTIuOGw1My4zLDE2Ni44bDEwNS45LTI5NGg1OC4xTDI3OS40LDM2MnoiLz48L2c+PC9nPjwvc3ZnPg==';

		return $icon_svg;
	}

	/**
	 * Localization for the dismiss urls.
	 *
	 * @return array
	 */
	private function localize_admin_global_script() {
		return array(
			'dismiss_about_url'   => $this->get_dismiss_url( 'wpseo-dismiss-about' ),
			'dismiss_tagline_url' => $this->get_dismiss_url( 'wpseo-dismiss-tagline-notice' ),
		);
	}

	/**
	 * Extending the current page URL with two params to be able to ignore the tour.
	 *
	 * @param string $dismiss_param The param used to dismiss the notification.
	 *
	 * @return string
	 */
	private function get_dismiss_url( $dismiss_param ) {
		$arr_params = array(
			$dismiss_param => '1',
			'nonce'        => wp_create_nonce( $dismiss_param ),
		);

		return esc_url( add_query_arg( $arr_params ) );
	}


	/********************** DEPRECATED METHODS **********************/

	/**
	 * Check whether the current user is allowed to access the configuration.
	 *
	 * @deprecated 1.5.0
	 * @deprecated use WPSEO_Utils::grant_access()
	 * @see        WPSEO_Utils::grant_access()
	 *
	 * @return boolean
	 */
	function grant_access() {
		_deprecated_function( __METHOD__, 'WPSEO 1.5.0', 'WPSEO_Utils::grant_access()' );

		return WPSEO_Utils::grant_access();
	}

	/**
	 * Check whether the current user is allowed to access the configuration.
	 *
	 * @deprecated 1.5.0
	 * @deprecated use wpseo_do_upgrade()
	 * @see        WPSEO_Upgrade
	 */
	function maybe_upgrade() {
		_deprecated_function( __METHOD__, 'WPSEO 1.5.0', 'wpseo_do_upgrade' );
		new WPSEO_Upgrade();
	}

	/**
	 * Clears the cache
	 *
	 * @deprecated 1.5.0
	 * @deprecated use WPSEO_Utils::clear_cache()
	 * @see        WPSEO_Utils::clear_cache()
	 */
	function clear_cache() {
		_deprecated_function( __METHOD__, 'WPSEO 1.5.0', 'WPSEO_Utils::clear_cache()' );
		WPSEO_Utils::clear_cache();
	}

	/**
	 * Clear rewrites
	 *
	 * @deprecated 1.5.0
	 * @deprecated use WPSEO_Utils::clear_rewrites()
	 * @see        WPSEO_Utils::clear_rewrites()
	 */
	function clear_rewrites() {
		_deprecated_function( __METHOD__, 'WPSEO 1.5.0', 'WPSEO_Utils::clear_rewrites()' );
		WPSEO_Utils::clear_rewrites();
	}

	/**
	 * Register all the options needed for the configuration pages.
	 *
	 * @deprecated 1.5.0
	 * @deprecated use WPSEO_Option::register_setting() on each individual option
	 * @see        WPSEO_Option::register_setting()
	 */
	function options_init() {
		_deprecated_function( __METHOD__, 'WPSEO 1.5.0', 'WPSEO_Option::register_setting()' );
	}

	/**
	 * Display an error message when the blog is set to private.
	 *
	 * @deprecated 3.3
	 */
	function blog_public_warning() {
		return;
	}

	/**
	 * Display an error message when the theme contains a meta description tag.
	 *
	 * @since 1.4.14
	 *
	 * @deprecated 3.3
	 */
	function meta_description_warning() {
		_deprecated_function( __FUNCTION__, 'WPSEO 3.3.0' );
	}
}
