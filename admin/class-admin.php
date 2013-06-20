<?php
/**
 * @package Admin
 */

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Class that holds most of the admin functionality for WP SEO.
 */
class WPSEO_Admin {

	/**
	 * Class constructor
	 */
	function __construct() {
		$this->multisite_defaults();

		$options = get_wpseo_options();

		if ( isset( $options['stripcategorybase'] ) && $options['stripcategorybase'] ) {
			add_action( 'created_category', 'flush_rewrite_rules' );
			add_action( 'edited_category', 'flush_rewrite_rules' );
			add_action( 'delete_category', 'flush_rewrite_rules' );
		}

		if ( $this->grant_access() ) {
			add_action( 'admin_init', array( $this, 'options_init' ) );
			// Needs the lower than default priority so other plugins can hook underneath it without issue.
			add_action( 'admin_menu', array( $this, 'register_settings_page' ), 5 );
			add_action( 'network_admin_menu', array( $this, 'register_network_settings_page' ) );

			add_filter( 'plugin_action_links', array( $this, 'add_action_link' ), 10, 2 );
			add_action( 'admin_print_scripts', array( $this, 'config_page_scripts' ) );

			if ( '0' == get_option( 'blog_public' ) )
				add_action( 'admin_footer', array( $this, 'blog_public_warning' ) );
		}

		add_action( 'admin_init', array( $this, 'maybe_upgrade' ) );

		add_filter( 'name_save_pre', array( $this, 'remove_stopwords_from_slug' ), 0 );

		add_action( 'show_user_profile', array( $this, 'user_profile' ) );
		add_action( 'edit_user_profile', array( $this, 'user_profile' ) );
		add_action( 'personal_options_update', array( $this, 'process_user_option_update' ) );
		add_action( 'edit_user_profile_update', array( $this, 'process_user_option_update' ) );
		add_action( 'personal_options_update', array( $this, 'update_user_profile' ) );
		add_action( 'edit_user_profile_update', array( $this, 'update_user_profile' ) );

		add_filter( 'user_contactmethods', array( $this, 'update_contactmethods' ), 10, 1 );

		add_action( 'update_option_wpseo_titles', array( $this, 'clear_cache' ) );
		add_action( 'update_option_wpseo', array( $this, 'clear_cache' ) );

		add_action( 'update_option_wpseo_permalinks', array( $this, 'clear_rewrites' ) );
		add_action( 'update_option_wpseo_xml', array( $this, 'clear_rewrites' ) );

		add_action( 'after_switch_theme', array( $this, 'switch_theme' ) );
		add_action( 'switch_theme', array( $this, 'switch_theme' ) );
	}

	/**
	 * Clears the cache
	 */
	function clear_cache() {
		if ( function_exists( 'w3tc_pgcache_flush' ) ) {
			w3tc_pgcache_flush();
		} else if ( function_exists( 'wp_cache_clear_cache' ) ) {
			wp_cache_clear_cache();
		}
	}

	/**
	 * Clear rewrites
	 */
	function clear_rewrites() {
		delete_option( 'rewrite_rules' );
	}

	/**
	 * Register all the options needed for the configuration pages.
	 */
	function options_init() {
		register_setting( 'yoast_wpseo_options', 'wpseo' );
		register_setting( 'yoast_wpseo_permalinks_options', 'wpseo_permalinks' );
		register_setting( 'yoast_wpseo_titles_options', 'wpseo_titles' );
		register_setting( 'yoast_wpseo_rss_options', 'wpseo_rss' );
		register_setting( 'yoast_wpseo_internallinks_options', 'wpseo_internallinks' );
		register_setting( 'yoast_wpseo_xml_sitemap_options', 'wpseo_xml' );
		register_setting( 'yoast_wpseo_social_options', 'wpseo_social' );

		if ( function_exists( 'is_multisite' ) && is_multisite() ) {
			if ( get_option( 'wpseo' ) == '1pseo_social' )
				delete_option( 'wpseo' );
			register_setting( 'yoast_wpseo_multisite_options', 'wpseo_multisite' );
		}
	}

	function multisite_defaults() {
		$option = get_option( 'wpseo' );
		if ( function_exists( 'is_multisite' ) && is_multisite() && !is_array( $option ) ) {
			$options = get_site_option( 'wpseo_ms' );
			if ( is_array( $options ) && isset( $options['defaultblog'] ) && !empty( $options['defaultblog'] ) && $options['defaultblog'] != 0 ) {
				foreach ( get_wpseo_options_arr() as $wpseo_option ) {
					update_option( $wpseo_option, get_blog_option( $options['defaultblog'], $wpseo_option ) );
				}
			}
			$option['ms_defaults_set'] = true;
			update_option( 'wpseo', $option );
		}
	}

	/**
	 * Check whether the current user is allowed to access the configuration.
	 *
	 * @return boolean
	 */
	function grant_access() {
		if ( !function_exists( 'is_multisite' ) || !is_multisite() )
			return true;

		$options = get_site_option( 'wpseo_ms' );
		if ( !is_array( $options ) || !isset( $options['access'] ) )
			return true;

		if ( $options['access'] == 'superadmin' && !is_super_admin() )
			return false;

		return true;
	}

	/**
	 * Register the menu item and its sub menu's.
	 *
	 * @global array $submenu used to change the label on the first item.
	 */
	function register_settings_page() {
		add_menu_page( __( 'WordPress SEO Configuration', 'wordpress-seo' ), __( 'SEO', 'wordpress-seo' ), 'manage_options', 'wpseo_dashboard', array( $this, 'config_page' ), WPSEO_URL . 'images/yoast-icon.png', '99.31337' );
		add_submenu_page( 'wpseo_dashboard', __( 'Titles &amp; Metas', 'wordpress-seo' ), __( 'Titles &amp; Metas', 'wordpress-seo' ), 'manage_options', 'wpseo_titles', array( $this, 'titles_page' ) );
		add_submenu_page( 'wpseo_dashboard', __( 'Social', 'wordpress-seo' ), __( 'Social', 'wordpress-seo' ), 'manage_options', 'wpseo_social', array( $this, 'social_page' ) );
		add_submenu_page( 'wpseo_dashboard', __( 'XML Sitemaps', 'wordpress-seo' ), __( 'XML Sitemaps', 'wordpress-seo' ), 'manage_options', 'wpseo_xml', array( $this, 'xml_sitemaps_page' ) );
		add_submenu_page( 'wpseo_dashboard', __( 'Permalinks', 'wordpress-seo' ), __( 'Permalinks', 'wordpress-seo' ), 'manage_options', 'wpseo_permalinks', array( $this, 'permalinks_page' ) );
		add_submenu_page( 'wpseo_dashboard', __( 'Internal Links', 'wordpress-seo' ), __( 'Internal Links', 'wordpress-seo' ), 'manage_options', 'wpseo_internal-links', array( $this, 'internallinks_page' ) );
		add_submenu_page( 'wpseo_dashboard', __( 'RSS', 'wordpress-seo' ), __( 'RSS', 'wordpress-seo' ), 'manage_options', 'wpseo_rss', array( $this, 'rss_page' ) );
		add_submenu_page( 'wpseo_dashboard', __( 'Import & Export', 'wordpress-seo' ), __( 'Import & Export', 'wordpress-seo' ), 'manage_options', 'wpseo_import', array( $this, 'import_page' ) );

		if ( !( defined( 'DISALLOW_FILE_EDIT' ) && DISALLOW_FILE_EDIT ) && !( defined( 'DISALLOW_FILE_MODS' ) && DISALLOW_FILE_MODS ) ) {
			// Make sure on a multi site install only super admins can edit .htaccess and robots.txt
			if ( !function_exists( 'is_multisite' ) || !is_multisite() )
				add_submenu_page( 'wpseo_dashboard', __( 'Edit files', 'wordpress-seo' ), __( 'Edit files', 'wordpress-seo' ), 'manage_options', 'wpseo_files', array( $this, 'files_page' ) );
			else
				add_submenu_page( 'wpseo_dashboard', __( 'Edit files', 'wordpress-seo' ), __( 'Edit files', 'wordpress-seo' ), 'delete_users', 'wpseo_files', array( $this, 'files_page' ) );
		}

		global $submenu;
		if ( isset( $submenu['wpseo_dashboard'] ) )
			$submenu['wpseo_dashboard'][0][0] = __( 'Dashboard', 'wordpress-seo' );
	}

	/**
	 * Register the settings page for the Network settings.
	 */
	function register_network_settings_page() {
		add_menu_page( __( 'WordPress SEO Configuration', 'wordpress-seo' ), __( 'SEO', 'wordpress-seo' ), 'delete_users', 'wpseo_dashboard', array( $this, 'network_config_page' ), WPSEO_URL . 'images/yoast-icon.png' );
	}

	/**
	 * Loads the form for the network configuration page.
	 */
	function network_config_page() {
		require( WPSEO_PATH . '/admin/pages/network.php' );
	}

	/**
	 * Loads the form for the import/export page.
	 */
	function import_page() {
		if ( isset( $_GET['page'] ) && 'wpseo_import' == $_GET['page'] )
			include( WPSEO_PATH . '/admin/pages/import.php' );
	}

	/**
	 * Loads the form for the titles & metas page.
	 */
	function titles_page() {
		if ( isset( $_GET['page'] ) && 'wpseo_titles' == $_GET['page'] )
			include( WPSEO_PATH . '/admin/pages/metas.php' );
	}

	/**
	 * Loads the form for the permalinks page.
	 */
	function permalinks_page() {
		if ( isset( $_GET['page'] ) && 'wpseo_permalinks' == $_GET['page'] )
			include( WPSEO_PATH . '/admin/pages/permalinks.php' );
	}

	/**
	 * Loads the form for the internal links / breadcrumbs page.
	 */
	function internallinks_page() {
		if ( isset( $_GET['page'] ) && 'wpseo_internal-links' == $_GET['page'] )
			include( WPSEO_PATH . '/admin/pages/internal-links.php' );
	}

	/**
	 * Loads the form for the file edit page.
	 */
	function files_page() {
		if ( isset( $_GET['page'] ) && 'wpseo_files' == $_GET['page'] )
			include( WPSEO_PATH . '/admin/pages/files.php' );
	}

	/**
	 * Loads the form for the RSS page.
	 */
	function rss_page() {
		if ( isset( $_GET['page'] ) && 'wpseo_rss' == $_GET['page'] )
			include( WPSEO_PATH . '/admin/pages/rss.php' );
	}

	/**
	 * Loads the form for the XML Sitemaps page.
	 */
	function xml_sitemaps_page() {
		if ( isset( $_GET['page'] ) && 'wpseo_xml' == $_GET['page'] )
			include( WPSEO_PATH . '/admin/pages/xml-sitemaps.php' );
	}

	/**
	 * Loads the form for the Dashboard page.
	 */
	function config_page() {
		if ( isset( $_GET['page'] ) && 'wpseo_dashboard' == $_GET['page'] )
			include( WPSEO_PATH . '/admin/pages/dashboard.php' );
	}

	/**
	 * Loads the form for the Social Settings page.
	 */
	function social_page() {
		if ( isset( $_GET['page'] ) && 'wpseo_social' == $_GET['page'] )
			require( WPSEO_PATH . '/admin/pages/social.php' );
	}

	/**
	 * Display an error message when the blog is set to private.
	 */
	function blog_public_warning() {
		if ( function_exists( 'is_network_admin' ) && is_network_admin() )
			return;

		$options = get_option( 'wpseo' );
		if ( isset( $options['ignore_blog_public_warning'] ) && $options['ignore_blog_public_warning'] == 'ignore' )
			return;
		echo "<div id='message' class='error'>";
		echo "<p><strong>" . __( "Huge SEO Issue: You're blocking access to robots.", 'wordpress-seo' ) . "</strong> " . sprintf( __( "You must %sgo to your Reading Settings%s and uncheck the box for Search Engine Visibility.", 'wordpress-seo' ), "<a href='".admin_url('options-reading.php')."'>", "</a>" ) . " <a href='javascript:wpseo_setIgnore(\"blog_public_warning\",\"message\",\"" . wp_create_nonce( 'wpseo-ignore' ) . "\");' class='button'>" . __( "I know, don't bug me.", 'wordpress-seo' ) . "</a></p></div>";
	}

	/**
	 * Add a link to the settings page to the plugins list
	 *
	 * @staticvar string $this_plugin holds the directory & filename for the plugin
	 * @param array  $links array of links for the plugins, adapted when the current plugin is found.
	 * @param string $file  the filename for the current plugin, which the filter loops through.
	 * @return array $links
	 */
	function add_action_link( $links, $file ) {
		static $this_plugin;
		if ( empty( $this_plugin ) ) $this_plugin = 'wordpress-seo/wp-seo.php';
		if ( $file == $this_plugin ) {
			$settings_link = '<a href="' . admin_url( 'admin.php?page=wpseo_dashboard' ) . '">' . __( 'Settings', 'wordpress-seo' ) . '</a>';
			array_unshift( $links, $settings_link );
		}
		return $links;
	}

	/**
	 * Enqueues the (tiny) global JS needed for the plugin.
	 */
	function config_page_scripts() {
		wp_enqueue_script( 'wpseo-admin-global-script', WPSEO_URL . 'js/wp-seo-admin-global.js', array( 'jquery' ), WPSEO_VERSION, true );
	}

	/**
	 * Updates the user metas that (might) have been set on the user profile page.
	 *
	 * @param int $user_id of the updated user
	 */
	function process_user_option_update( $user_id ) {
		if ( isset( $_POST['wpseo_author_title'] ) ) {
			check_admin_referer( 'wpseo_user_profile_update', 'wpseo_nonce' );
			update_user_meta( $user_id, 'wpseo_title', ( isset( $_POST['wpseo_author_title'] ) ? esc_html( $_POST['wpseo_author_title'] ) : '' ) );
			update_user_meta( $user_id, 'wpseo_metadesc', ( isset( $_POST['wpseo_author_metadesc'] ) ? esc_html( $_POST['wpseo_author_metadesc'] ) : '' ) );
			update_user_meta( $user_id, 'wpseo_metakey', ( isset( $_POST['wpseo_author_metakey'] ) ? esc_html( $_POST['wpseo_author_metakey'] ) : '' ) );
		}
	}

	/**
	 * Filter the $contactmethods array and add Facebook, Google+ and Twitter.
	 *
	 * These are used with the Facebook author, rel="author" and Twitter cards implementation.
	 *
	 * @param array $contactmethods currently set contactmethods.
	 * @return array $contactmethods with added contactmethods.
	 */
	function update_contactmethods( $contactmethods ) {
		// Add Google+
		$contactmethods['googleplus'] = __( "Google+", 'wordpress-seo' );
		// Add Twitter
		$contactmethods['twitter'] = __( 'Twitter username (without @)', 'wordpress-seo' );
		// Add Facebook
		$contactmethods['facebook'] = __( 'Facebook profile URL', 'wordpress-seo' );

		return $contactmethods;
	}

	/**
	 * Add the inputs needed for SEO values to the User Profile page
	 *
	 * @param object $user
	 */
	function user_profile( $user ) {

		if ( !current_user_can( 'edit_users' ) )
			return;

		$options = get_wpseo_options();

		wp_nonce_field( 'wpseo_user_profile_update', 'wpseo_nonce' );
		?>
    <h3 id="wordpress-seo"><?php _e( "WordPress SEO settings", 'wordpress-seo' ); ?></h3>
    <table class="form-table">
        <tr>
            <th><?php _e( "Title to use for Author page", 'wordpress-seo' ); ?></th>
            <td><input class="regular-text" type="text" name="wpseo_author_title"
                       value="<?php echo esc_attr( get_the_author_meta( 'wpseo_title', $user->ID ) ); ?>"/></td>
        </tr>
        <tr>
            <th><?php _e( "Meta description to use for Author page", 'wordpress-seo' ); ?></th>
            <td><textarea rows="3" cols="30"
                          name="wpseo_author_metadesc"><?php echo esc_html( get_the_author_meta( 'wpseo_metadesc', $user->ID ) ); ?></textarea>
            </td>
        </tr>
		<?php     if ( isset( $options['usemetakeywords'] ) && $options['usemetakeywords'] ) { ?>
        <tr>
            <th><?php _e( "Meta keywords to use for Author page", 'wordpress-seo' ); ?></th>
            <td><input class="regular-text" type="text" name="wpseo_author_metakey"
                       value="<?php echo esc_attr( get_the_author_meta( 'wpseo_metakey', $user->ID ) ); ?>"/></td>
        </tr>
		<?php } ?>
    </table>
    <br/><br/>
	<?php
	}

	/**
	 * Determine whether the wpseo option holds the current version, if it doesn't, run
	 * the upgrade procedures.
	 */
	function maybe_upgrade() {
		$options         = get_option( 'wpseo' );
		$current_version = isset( $options['version'] ) ? $options['version'] : 0;

		if ( version_compare( $current_version, WPSEO_VERSION, '==' ) )
			return;

		delete_option( 'rewrite_rules' );

		// <= 0.3.5: flush rewrite rules for new XML sitemaps
		if ( $current_version == 0 ) {
			flush_rewrite_rules();
		}

		if ( version_compare( $current_version, '0.4.2', '<' ) ) {
			$xml_opt = array();
			// Move XML Sitemap settings from general array to XML specific array, general settings first
			foreach ( array( 'enablexmlsitemap', 'xml_include_images', 'xml_ping_google', 'xml_ping_bing', 'xml_ping_yahoo', 'xml_ping_ask', 'xmlnews_posttypes' ) as $opt ) {
				if ( isset( $options[$opt] ) ) {
					$xml_opt[$opt] = $options[$opt];
					unset( $options[$opt] );
				}
			}
			// Per post type settings
			foreach ( get_post_types() as $post_type ) {
				if ( in_array( $post_type, array( 'revision', 'nav_menu_item', 'attachment' ) ) )
					continue;

				if ( isset( $options['post_types-' . $post_type . '-not_in_sitemap'] ) ) {
					$xml_opt['post_types-' . $post_type . '-not_in_sitemap'] = $options['post_types-' . $post_type . '-not_in_sitemap'];
					unset( $options['post_types-' . $post_type . '-not_in_sitemap'] );
				}
			}
			// Per taxonomy settings
			foreach ( get_taxonomies() as $taxonomy ) {
				if ( in_array( $taxonomy, array( 'nav_menu', 'link_category', 'post_format' ) ) )
					continue;

				if ( isset( $options['taxonomies-' . $taxonomy . '-not_in_sitemap'] ) ) {
					$xml_opt['taxonomies-' . $taxonomy . '-not_in_sitemap'] = $options['taxonomies-' . $taxonomy . '-not_in_sitemap'];
					unset( $options['taxonomies-' . $taxonomy . '-not_in_sitemap'] );
				}
			}
			if ( get_option( 'wpseo_xml' ) === false )
				update_option( 'wpseo_xml', $xml_opt );
			unset( $xml_opt );

			// Clean up other no longer used settings
			unset( $options['wpseodir'], $options['wpseourl'] );
		}

		if ( version_compare( $current_version, '1.0.2.2', '<' ) ) {
			$opt = (array) get_option( 'wpseo_indexation' );
			unset( $opt['hideindexrel'], $opt['hidestartrel'], $opt['hideprevnextpostlink'], $opt['hidewpgenerator'] );
			update_option( 'wpseo_indexation', $opt );
		}

		if ( version_compare( $current_version, '1.0.4', '<' ) ) {
			$opt    = (array) get_option( 'wpseo_indexation' );
			$newopt = array(
				'opengraph'  => isset( $opt['opengraph'] ) ? $opt['opengraph'] : '',
				'fb_adminid' => isset( $opt['fb_adminid'] ) ? $opt['fb_adminid'] : '',
				'fb_appid'   => isset( $opt['fb_appid'] ) ? $opt['fb_appid'] : '',
			);
			update_option( 'wpseo_social', $newopt );
			unset( $opt['opengraph'], $opt['fb_pageid'], $opt['fb_adminid'], $opt['fb_appid'] );
			update_option( 'wpseo_indexation', $opt );
		}

		if ( version_compare( $current_version, '1.2', '<' ) ) {
			$opt     = get_option( 'wpseo_indexation' );
			$metaopt = get_option( 'wpseo_titles' );

			$metaopt['noindex-author']      = isset( $opt['noindexauthor'] ) ? $opt['noindexauthor'] : '';
			$metaopt['disable-author']      = isset( $opt['disableauthor'] ) ? $opt['disableauthor'] : '';
			$metaopt['noindex-archive']     = isset( $opt['noindexdate'] ) ? $opt['noindexdate'] : '';
			$metaopt['noindex-category']    = isset( $opt['noindexcat'] ) ? $opt['noindexcat'] : '';
			$metaopt['noindex-post_tag']    = isset( $opt['noindextag'] ) ? $opt['noindextag'] : '';
			$metaopt['noindex-post_format'] = isset( $opt['noindexpostformat'] ) ? $opt['noindexpostformat'] : '';
			$metaopt['noindex-subpages']    = isset( $opt['noindexsubpages'] ) ? $opt['noindexsubpages'] : '';
			$metaopt['hide-rsdlink']        = isset( $opt['hidersdlink'] ) ? $opt['hidersdlink'] : '';
			$metaopt['hide-feedlinks']      = isset( $opt['hidefeedlinks'] ) ? $opt['hidefeedlinks'] : '';
			$metaopt['hide-wlwmanifest']    = isset( $opt['hidewlwmanifest'] ) ? $opt['hidewlwmanifest'] : '';
			$metaopt['hide-shortlink']      = isset( $opt['hideshortlink'] ) ? $opt['hideshortlink'] : '';

			update_option( 'wpseo_titles', $metaopt );

			delete_option( 'wpseo_indexation' );

			wpseo_title_test();
		}

		// Clean up the wrong wpseo options
		if ( version_compare( $current_version, '1.2.3', '<' ) ) {
			$opt = get_option( 'wpseo' );

			if ( is_array( $opt ) ) {
				foreach ( $opt as $key => $val ) {
					if ( !in_array( $key, array( 'ignore_blog_public_warning', 'ignore_tour', 'ignore_page_comments', 'ignore_permalink', 'ms_defaults_set', 'version', 'disableadvanced_meta', 'googleverify', 'msverify', 'alexaverify' ) ) ) {
						unset( $opt[$key] );
					}
				}

				update_option( 'wpseo', $opt );
				unset( $opt );
			}
		}

		// Fix wrongness created by buggy version 1.2.2
		if ( version_compare( $current_version, '1.2.4', '<' ) ) {
			$options = get_option( 'wpseo_titles' );
			if ( is_array( $options ) && isset( $options['title-home'] ) && $options['title-home'] == '%%sitename%% - %%sitedesc%% - 12345' ) {
				$options['title-home'] = '%%sitename%% - %%sitedesc%%';
				update_option( 'wpseo_titles', $options );
			}
		}

		if ( version_compare( $current_version, '1.2.8', '<' ) ) {
			$options = get_option( 'wpseo' );
			if ( is_array( $options ) && isset( $options['presstrends'] ) ) {
				$options['yoast_tracking'] = 'on';
				unset( $options['presstrends'] );
				update_option( 'wpseo', $options );
			}
		}

		if ( version_compare( $current_version, '1.2.8.2', '<' ) ) {
			$options = get_option( 'wpseo' );
			if ( is_array( $options ) && isset( $options['presstrends'] ) ) {
				$options['yoast_tracking'] = 'on';
				unset( $options['presstrends'] );
			}
			if ( is_array( $options ) && isset( $options['presstrends_popup'] ) ) {
				$options['tracking_popup'] = 'on';
				unset( $options['presstrends_popup'] );
			}
			update_option( 'wpseo', $options );
		}

		if ( version_compare( $current_version, '1.3.2', '<' ) ) {
			$options = get_option( 'wpseo_xml' );

			$options['post_types-attachment-not_in_sitemap'] = true;
			update_option( 'wpseo_xml', $options );
		}

		$options            = get_option( 'wpseo' );
		$options['version'] = WPSEO_VERSION;
		update_option( 'wpseo', $options );
	}

	/**
	 * Cleans stopwords out of the slug, if the slug hasn't been set yet.
	 *
	 * @since 1.1.7
	 *
	 * @param string $slug if this isn't empty, the function will return an unaltered slug.
	 * @return string $clean_slug cleaned slug
	 */
	function remove_stopwords_from_slug( $slug ) {
		// Don't to change an existing slug
		if ( $slug )
			return $slug;

		if ( !isset( $_POST['post_title'] ) )
			return $slug;

		// Lowercase the slug and strip slashes
		$clean_slug = sanitize_title( stripslashes( $_POST['post_title'] ) );

		// Turn it to an array and strip stopwords by comparing against an array of stopwords
		$clean_slug_array = array_diff( explode( " ", $clean_slug ), $this->stopwords() );

		// Turn the sanitized array into a string
		$clean_slug = join( "-", $clean_slug_array );

		return $clean_slug;
	}

	/**
	 * Returns the stopwords for the current language
	 *
	 * @since 1.1.7
	 *
	 * @return array $stopwords array of stop words to check and / or remove from slug
	 */
	function stopwords() {
		/* translators: this should be an array of stopwords for your language, separated by comma's. */
		return explode( ',', __( "a,about,above,after,again,against,all,am,an,and,any,are,aren't,as,at,be,because,been,before,being,below,between,both,but,by,can't,cannot,could,couldn't,did,didn't,do,does,doesn't,doing,don't,down,during,each,few,for,from,further,had,hadn't,has,hasn't,have,haven't,having,he,he'd,he'll,he's,her,here,here's,hers,herself,him,himself,his,how,how's,i,i'd,i'll,i'm,i've,if,in,into,is,isn't,it,it's,its,itself,let's,me,more,most,mustn't,my,myself,no,nor,not,of,off,on,once,only,or,other,ought,our,ours , ourselves,out,over,own,same,shan't,she,she'd,she'll,she's,should,shouldn't,so,some,such,than,that,that's,the,their,theirs,them,themselves,then,there,there's,these,they,they'd,they'll,they're,they've,this,those,through,to,too,under,until,up,very,was,wasn't,we,we'd,we'll,we're,we've,were,weren't,what,what's,when,when's,where,where's,which,while,who,who's,whom,why,why's,with,won't,would,wouldn't,you,you'd,you'll,you're,you've,your,yours,yourself,yourselves", "wordpress-seo" ) );
	}

	function stopwords_check( $haystack, $checkingUrl = false ) {
		$stopWords = $this->stopwords();

		foreach ( $stopWords as $stopWord ) {
			// If checking a URL remove the single quotes
			if ( $checkingUrl )
				$stopWord = str_replace( "'", "", $stopWord );

			// Check whether the stopword appears as a whole word
			$res = preg_match( "/(^|[ \n\r\t\.,'\(\)\"\+;!?:])" . preg_quote( $stopWord, '/' ) . "($|[ \n\r\t\.,'\(\)\"\+;!?:])/i", $haystack, $match );
			if ( $res > 0 )
				return $stopWord;
		}

		return false;
	}

	/**
	 * Log the timestamp when a user profile has been updated
	 */
	function update_user_profile($user_id) {
		if ( current_user_can( 'edit_user', $user_id ) ) {
			update_user_meta( $user_id, '_yoast_wpseo_profile_updated', time() );
		}
	}

	/**
	 * Log the updated timestamp for user profiles when theme is changed
	 */
	function switch_theme() {
		foreach ( get_users( array( 'who' => 'authors' ) ) as $user ) {
			update_user_meta( $user->ID, '_yoast_wpseo_profile_updated', time() );
		}
	}

}

// Globalize the var first as it's needed globally.
global $wpseo_admin;
$wpseo_admin = new WPSEO_Admin();	
