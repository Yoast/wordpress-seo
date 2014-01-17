<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

if ( ! class_exists( 'WPSEO_Admin' ) ) {
	/**
	 * Class that holds most of the admin functionality for WP SEO.
	 */
	class WPSEO_Admin {
	
		/**
		 * Class constructor
		 */
		function __construct() {
			WPSEO_Options::set_multisite_defaults();
	
			$options = WPSEO_Options::get_all();
	
			if ( $options['stripcategorybase'] === true ) {
				add_action( 'created_category', array( $this, 'schedule_rewrite_flush' ) );
				add_action( 'edited_category', array( $this, 'schedule_rewrite_flush' ) );
				add_action( 'delete_category', array( $this, 'schedule_rewrite_flush' ) );
			}
	
			if ( $this->grant_access() ) {
				add_action( 'admin_init', array( 'WPSEO_Options', 'register_settings' ) );
				// Needs the lower than default priority so other plugins can hook underneath it without issue.
				add_action( 'admin_menu', array( $this, 'register_settings_page' ), 5 );
				add_action( 'network_admin_menu', array( $this, 'register_network_settings_page' ) );
	
				add_filter( 'plugin_action_links', array( $this, 'add_action_link' ), 10, 2 );
				add_action( 'admin_enqueue_scripts', array( $this, 'config_page_scripts' ) );
	
				if ( '0' == get_option( 'blog_public' ) )
					add_action( 'admin_footer', array( $this, 'blog_public_warning' ) );
	
				if ( ( ( isset( $options['theme_has_description'] ) && $options['theme_has_description'] === true ) || $options['theme_description_found'] !== '' ) && $options['ignore_meta_description_warning'] !== true )
					add_action( 'admin_footer', array( $this, 'meta_description_warning' ) );
	
			}
	
			/* Should be run on init (was admin_init) as otherwise multisite installs will not get the upgrade
			   until an admin logs in.
			   Upgrade run as prio 100 to ensure enrich_defaults has run ?
			*/
			add_action( 'init', array( $this, 'maybe_upgrade' ), 100 );
	
			if ( $options['cleanslugs'] === true )
				add_filter( 'name_save_pre', array( $this, 'remove_stopwords_from_slug' ), 0 );
	
			add_action( 'show_user_profile', array( $this, 'user_profile' ) );
			add_action( 'edit_user_profile', array( $this, 'user_profile' ) );
			add_action( 'personal_options_update', array( $this, 'process_user_option_update' ) );
			add_action( 'edit_user_profile_update', array( $this, 'process_user_option_update' ) );
			add_action( 'personal_options_update', array( $this, 'update_user_profile' ) );
			add_action( 'edit_user_profile_update', array( $this, 'update_user_profile' ) );
	
			add_filter( 'user_contactmethods', array( $this, 'update_contactmethods' ), 10, 1 );

			add_action( 'after_switch_theme', array( $this, 'switch_theme' ) );
			add_action( 'switch_theme', array( $this, 'switch_theme' ) );
			
			add_filter( 'set-screen-option', array( $this, 'save_bulk_edit_options' ), 10, 3 );
		}

		/**
		 * Schedules a rewrite flush to happen at shutdown
		 */
		function schedule_rewrite_flush() {
			add_action( 'shutdown', 'flush_rewrite_rules' );
		}
	

		/**
		 * Check whether the current user is allowed to access the configuration.
		 *
		 * @return boolean
		 */
		function grant_access() {
			if ( ! function_exists( 'is_multisite' ) || ! is_multisite() )
				return true;
	
			$options = get_site_option( 'wpseo_ms' );
			if ( $options['access'] === 'admin' )
				return true;
	
			if ( $options['access'] === 'superadmin' && ! is_super_admin() )
				return false;
	
			return true;
		}
	
		/**
		 * Register the menu item and its sub menu's.
		 *
		 * @global array $submenu used to change the label on the first item.
		 */
		function register_settings_page() {
			add_menu_page( __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'General Settings', 'wordpress-seo' ), __( 'SEO', 'wordpress-seo' ), 'manage_options', 'wpseo_dashboard', array( $this, 'load_page' ), plugins_url( 'images/yoast-icon.png', dirname( __FILE__ ) ), '99.31337' );
	
			$admin_page = add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Titles &amp; Metas', 'wordpress-seo' ), __( 'Titles &amp; Metas', 'wordpress-seo' ), 'manage_options', 'wpseo_titles', array( $this, 'load_page' ) );
			add_action( 'load-' . $admin_page, array( $this, 'title_metas_help_tab' ) );
	
			add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Social', 'wordpress-seo' ), __( 'Social', 'wordpress-seo' ), 'manage_options', 'wpseo_social', array( $this, 'load_page' ) );
			add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'XML Sitemaps', 'wordpress-seo' ), __( 'XML Sitemaps', 'wordpress-seo' ), 'manage_options', 'wpseo_xml', array( $this, 'load_page' ) );
			add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Permalinks', 'wordpress-seo' ), __( 'Permalinks', 'wordpress-seo' ), 'manage_options', 'wpseo_permalinks', array( $this, 'load_page' ) );
			add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Internal Links', 'wordpress-seo' ), __( 'Internal Links', 'wordpress-seo' ), 'manage_options', 'wpseo_internal-links', array( $this, 'load_page' ) );
			add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'RSS', 'wordpress-seo' ), __( 'RSS', 'wordpress-seo' ), 'manage_options', 'wpseo_rss', array( $this, 'load_page' ) );
			add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Import & Export', 'wordpress-seo' ), __( 'Import & Export', 'wordpress-seo' ), 'manage_options', 'wpseo_import', array( $this, 'load_page' ) );
	
			if ( ! ( defined( 'DISALLOW_FILE_EDIT' ) && DISALLOW_FILE_EDIT ) && ! ( defined( 'DISALLOW_FILE_MODS' ) && DISALLOW_FILE_MODS ) ) {
				// Make sure on a multi site install only super admins can edit .htaccess and robots.txt
				if ( ! function_exists( 'is_multisite' ) || ! is_multisite() )
					add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Edit Files', 'wordpress-seo' ), __( 'Edit Files', 'wordpress-seo' ), 'manage_options', 'wpseo_files', array( $this, 'load_page' ) );
				else
					add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Edit Files', 'wordpress-seo' ), __( 'Edit Files', 'wordpress-seo' ), 'delete_users', 'wpseo_files', array( $this, 'load_page' ) );
			}
	
			/**
			 * @todo [JRF => Faison] is the capability the right one ?
			 * Shouldn't this functionality be made available to all editors/authors for those posts they have authority to edit ?
			 * If so, the queries in the bulk editor classes need changing too to reflect this and the below should not just check capability, but also whether a user has any posts at all.
			 */
			$bulk_title_hook = add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Bulk Title Editor', 'wordpress-seo' ), __( 'Bulk Title Editor', 'wordpress-seo' ), 'manage_options', 'wpseo_bulk-title-editor', array( $this, 'load_page' ) );
	
			$bulk_description_hook = add_submenu_page( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Bulk Description Editor', 'wordpress-seo' ), __( 'Bulk Description Editor', 'wordpress-seo' ), 'manage_options', 'wpseo_bulk-description-editor', array( $this, 'load_page' ) );
	
			add_action( 'load-' . $bulk_title_hook, array( $this, 'bulk_edit_options' ) );
			add_action( 'load-' . $bulk_description_hook, array( $this, 'bulk_edit_options' ) );
	
	
			global $submenu;
			if ( isset( $submenu['wpseo_dashboard'] ) ) {
				$submenu['wpseo_dashboard'][0][0] = __( 'Dashboard', 'wordpress-seo' );
			}
		}
	
		/**
		 * Adds contextual help to the titles & metas page.
		 */
		function title_metas_help_tab() {
			$screen = get_current_screen();

			$screen->set_help_sidebar(
				'<p><strong>' . __( 'For more information:' ) . '</strong></p>' .
				'<p><a target="_blank" href="http://yoast.com/articles/wordpress-seo/#titles">' . __( 'Title optimization', 'wordpress-seo' ) . '</a></p>' .
				'<p><a target="_blank" href="http://yoast.com/google-page-title/">' . __( 'Why Google won\'t display the right page title', 'wordpress-seo' ) . '</a></p>'
			);
	
			$screen->add_help_tab(
				array(
					'id'      => 'basic-help',
					'title'   => __( 'Template explanation', 'wordpress-seo' ),
					'content' => '<p>' . __( 'The title &amp; metas settings for WordPress SEO are made up of variables that are replaced by specific values from the page when the page is displayed. The tabs on the left explain the available variables.', 'wordpress-seo' ) . '</p>',
				)
			);
	
			$screen->add_help_tab(
				array(
					'id'      => 'title-vars',
					'title'   => __( 'Basic Variables', 'wordpress-seo' ),
					'content' => '
		<h2>' . __( 'Basic Variables.', 'wordpress-seo' ) . '</h2>
			<table class="yoast_help">
				<tr>
					<th>%%date%%</th>
					<td>' . __( 'Replaced with the date of the post/page', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%title%%</th>
					<td>' . __( 'Replaced with the title of the post/page', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%sitename%%</th>
					<td>' . __( 'The site\'s name', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%sitedesc%%</th>
					<td>' . __( 'The site\'s tagline / description', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%excerpt%%</th>
					<td>' . __( 'Replaced with the post/page excerpt (or auto-generated if it does not exist)', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%excerpt_only%%</th>
					<td>' . __( 'Replaced with the post/page excerpt (without auto-generation)', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%tag%%</th>
					<td>' . __( 'Replaced with the current tag/tags', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%category%%</th>
					<td>' . __( 'Replaced with the post categories (comma separated)', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%category_description%%</th>
					<td>' . __( 'Replaced with the category description', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%tag_description%%</th>
					<td>' . __( 'Replaced with the tag description', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%term_description%%</th>
					<td>' . __( 'Replaced with the term description', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%term_title%%</th>
					<td>' . __( 'Replaced with the term name', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%searchphrase%%</th>
					<td>' . __( 'Replaced with the current search phrase', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%sep%%</th>
					<td>' . __( 'The separator defined in your theme\'s <code>wp_title()</code> tag.', 'wordpress-seo' ) . '</td>
				</tr>
				</table>',
				)
			);
	
			$screen->add_help_tab(
				array(
					'id'      => 'title-vars-advanced',
					'title'   => __( 'Advanced Variables.', 'wordpress-seo' ),
					'content' => '
				<h2>' . __( 'Advanced Variables.', 'wordpress-seo' ) . '</h2>
				<table class="yoast_help">
				<tr>
					<th>%%pt_single%%</th>
					<td>' . __( 'Replaced with the post type single label', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%pt_plural%%</th>
					<td>' . __( 'Replaced with the post type plural label', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%modified%%</th>
					<td>' . __( 'Replaced with the post/page modified time', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%id%%</th>
					<td>' . __( 'Replaced with the post/page ID', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%name%%</th>
					<td>' . __( 'Replaced with the post/page author\'s \'nicename\'', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%userid%%</th>
					<td>' . __( 'Replaced with the post/page author\'s userid', 'wordpress-seo' ) . '</td>
				</tr>
				<tr class="alt">
					<th>%%currenttime%%</th>
					<td>' . __( 'Replaced with the current time', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%currentdate%%</th>
					<td>' . __( 'Replaced with the current date', 'wordpress-seo' ) . '</td>
				</tr>
				<tr class="alt">
					<th>%%currentday%%</th>
					<td>' . __( 'Replaced with the current day', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%currentmonth%%</th>
					<td>' . __( 'Replaced with the current month', 'wordpress-seo' ) . '</td>
				</tr>
				<tr class="alt">
					<th>%%currentyear%%</th>
					<td>' . __( 'Replaced with the current year', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%page%%</th>
					<td>' . __( 'Replaced with the current page number (i.e. page 2 of 4)', 'wordpress-seo' ) . '</td>
				</tr>
				<tr class="alt">
					<th>%%pagetotal%%</th>
					<td>' . __( 'Replaced with the current page total', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%pagenumber%%</th>
					<td>' . __( 'Replaced with the current page number', 'wordpress-seo' ) . '</td>
				</tr>
				<tr class="alt">
					<th>%%caption%%</th>
					<td>' . __( 'Attachment caption', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%focuskw%%</th>
					<td>' . __( 'Replaced with the posts focus keyword', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%term404%%</th>
					<td>' . __( 'Replaced with the slug which caused the 404', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%cf_&lt;custom-field-name&gt;%%</th>
					<td>' . __( 'Replaced with a posts custom field value', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%ct_&lt;custom-tax-name&gt;%%</th>
					<td>' . __( 'Replaced with a posts custom taxonomies, comma separated.', 'wordpress-seo' ) . '</td>
				</tr>
				<tr>
					<th>%%ct_desc_&lt;custom-tax-name&gt;%%</th>
					<td>' . __( 'Replaced with a custom taxonomies description', 'wordpress-seo' ) . '</td>
				</tr>
			</table>', //actual help text
				)
			);
		}
	
		/**
		 * Register the settings page for the Network settings.
		 */
		function register_network_settings_page() {
			add_menu_page( __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'MultiSite Settings', 'wordpress-seo' ), __( 'SEO', 'wordpress-seo' ), 'delete_users', 'wpseo_dashboard', array( $this, 'network_config_page' ), plugins_url( 'images/yoast-icon.png', dirname( __FILE__ ) ) );
		}


		/**
		 * Load the form for a WPSEO admin page
		 */
		function load_page() {
			if ( isset( $_GET['page'] ) ) {
				switch ( $_GET['page'] ) {
					case 'wpseo_titles':
						require_once( WPSEO_PATH . 'admin/pages/metas.php' );
						break;

					case 'wpseo_social':
						require_once( WPSEO_PATH . 'admin/pages/social.php' );
						break;

					case 'wpseo_xml':
						require_once( WPSEO_PATH . 'admin/pages/xml-sitemaps.php' );
						break;

					case 'wpseo_permalinks':
						require_once( WPSEO_PATH . 'admin/pages/permalinks.php' );
						break;

					case 'wpseo_internal-links':
						require_once( WPSEO_PATH . 'admin/pages/internal-links.php' );
						break;

					case 'wpseo_rss':
						require_once( WPSEO_PATH . 'admin/pages/rss.php' );
						break;

					case 'wpseo_import':
						require_once( WPSEO_PATH . 'admin/pages/import.php' );
						break;

					case 'wpseo_files':
						require_once( WPSEO_PATH . 'admin/pages/files.php' );
						break;

					case 'wpseo_bulk-title-editor':
						require_once( WPSEO_PATH . 'admin/pages/bulk-title-editor.php' );
						break;

					case 'wpseo_bulk-description-editor':
						require_once( WPSEO_PATH . 'admin/pages/bulk-description-editor.php' );
						break;

					case 'wpseo_dashboard':
					default:
						require_once( WPSEO_PATH . 'admin/pages/dashboard.php' );
						break;
				}
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
				'label'	  => 'Posts',
				'default' => 10,
				'option'  => 'wpseo_posts_per_page',
			);
			add_screen_option( $option, $args );
		}
	
		/**
		 * Saves the posts per page limit for bulk edit pages.
		 */
		function save_bulk_edit_options( $status, $option, $value ) {
			if ( 'wpseo_posts_per_page' === $option ) {
				return $value;
			}
		}
	
		/**
		 * Display an error message when the blog is set to private.
		 */
		function blog_public_warning() {
			if ( function_exists( 'is_network_admin' ) && is_network_admin() )
				return;
	
			$options = get_option( 'wpseo' );
			if ( $options['ignore_blog_public_warning'] === true )
				return;
			echo '<div id="message" class="error">';
			echo '<p><strong>' . __( 'Huge SEO Issue: You\'re blocking access to robots.', 'wordpress-seo' ) . '</strong> ' . sprintf( __( 'You must %sgo to your Reading Settings%s and uncheck the box for Search Engine Visibility.', 'wordpress-seo' ), '<a href="' . esc_url( admin_url( 'options-reading.php' ) ) . '">', '</a>' ) . ' <a href="javascript:wpseo_setIgnore(\'blog_public_warning\',\'message\',\'' . esc_js( wp_create_nonce( 'wpseo-ignore' ) ) . '\');" class="button">' . __( 'I know, don\'t bug me.', 'wordpress-seo' ) . '</a></p></div>';
		}
	
		/**
		 * Display an error message when the theme contains a meta description tag.
		 *
		 * @since 1.4.14
		 */
		function meta_description_warning() {
			if ( function_exists( 'is_network_admin' ) && is_network_admin() )
				return;
	
			// No need to double display it on the dashboard
			if ( isset( $_GET['page'] ) && 'wpseo_dashboard' === $_GET['page'] )
				return;
	
			$options = get_option( 'wpseo' );
			if ( true === $options['ignore_meta_description_warning'] )
				return;
	
			echo '<div id="metamessage" class="error">';
			echo '<p><strong>' . __( 'SEO Issue:', 'wordpress-seo' ) . '</strong> ' . sprintf( __( 'Your theme contains a meta description, which blocks WordPress SEO from working properly. Please visit the %sSEO Dashboard%s to fix this.', 'wordpress-seo' ), '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_dashboard' ) ) . '">', '</a>' ) . ' <a href="javascript:wpseo_setIgnore(\'meta_description_warning\',\'metamessage\',\'' . esc_js( wp_create_nonce( 'wpseo-ignore' ) ) . '\');" class="button">' . __( 'I know, don\'t bug me.', 'wordpress-seo' ) . '</a></p></div>';
		}
	
		/**
		 * Add a link to the settings page to the plugins list
		 *
		 * @staticvar string $this_plugin holds the directory & filename for the plugin
		 *
		 * @param	array	$links array of links for the plugins, adapted when the current plugin is found.
		 * @param	string	$file  the filename for the current plugin, which the filter loops through.
		 * @return	array	$links
		 */
		function add_action_link( $links, $file ) {
			static $this_plugin;
			if ( empty( $this_plugin ) ) $this_plugin = 'wordpress-seo/wp-seo.php';
			if ( $file == $this_plugin ) {
				$settings_link = '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_dashboard' ) ) . '">' . __( 'Settings', 'wordpress-seo' ) . '</a>';
				array_unshift( $links, $settings_link );
			}
			return $links;
		}
	
		/**
		 * Enqueues the (tiny) global JS needed for the plugin.
		 */
		function config_page_scripts() {
			wp_enqueue_script( 'wpseo-admin-global-script', plugins_url( 'js/wp-seo-admin-global' . WPSEO_CSSJS_SUFFIX . '.js', dirname( __FILE__ ) ), array( 'jquery' ), WPSEO_VERSION, true );
		}


		/**
		 * Updates the user metas that (might) have been set on the user profile page.
		 *
		 * @param    int    $user_id of the updated user
		 */
		function process_user_option_update( $user_id ) {
			if ( isset( $_POST['wpseo_author_title'] ) ) {
				check_admin_referer( 'wpseo_user_profile_update', 'wpseo_nonce' );
				update_user_meta( $user_id, 'wpseo_title', ( isset( $_POST['wpseo_author_title'] ) ? sanitize_text_field( $_POST['wpseo_author_title'] ) : '' ) );
				update_user_meta( $user_id, 'wpseo_metadesc', ( isset( $_POST['wpseo_author_metadesc'] ) ? sanitize_text_field( $_POST['wpseo_author_metadesc'] ) : '' ) );
				update_user_meta( $user_id, 'wpseo_metakey', ( isset( $_POST['wpseo_author_metakey'] ) ? sanitize_text_field( $_POST['wpseo_author_metakey'] ) : '' ) );
			}
		}

		/**
		 * Filter the $contactmethods array and add Facebook, Google+ and Twitter.
		 *
		 * These are used with the Facebook author, rel="author" and Twitter cards implementation.
		 *
		 * @param	array	$contactmethods currently set contactmethods.
		 * @return	array	$contactmethods with added contactmethods.
		 */
		function update_contactmethods( $contactmethods ) {
			// Add Google+
			$contactmethods['googleplus'] = __( 'Google+', 'wordpress-seo' );
			// Add Twitter
			$contactmethods['twitter'] = __( 'Twitter username (without @)', 'wordpress-seo' );
			// Add Facebook
			$contactmethods['facebook'] = __( 'Facebook profile URL', 'wordpress-seo' );
	
			return $contactmethods;
		}
	
		/**
		 * Add the inputs needed for SEO values to the User Profile page
		 *
		 * @param	object	$user
		 */
		function user_profile( $user ) {
	
			if ( ! current_user_can( 'edit_users' ) )
				return;
	
			$options = WPSEO_Options::get_all();
	
			wp_nonce_field( 'wpseo_user_profile_update', 'wpseo_nonce' );
			?>
			<h3 id="wordpress-seo"><?php _e( 'WordPress SEO settings', 'wordpress-seo' ); ?></h3>
			<table class="form-table">
				<tr>
					<th><label for="wpseo_author_title"><?php _e( 'Title to use for Author page', 'wordpress-seo' ); ?></label></th>
					<td><input class="regular-text" type="text" id="wpseo_author_title" name="wpseo_author_title"
										 value="<?php echo esc_attr( get_the_author_meta( 'wpseo_title', $user->ID ) ); ?>" /></td>
				</tr>
				<tr>
					<th><label for="wpseo_author_metadesc"><?php _e( 'Meta description to use for Author page', 'wordpress-seo' ); ?></label></th>
					<td><textarea rows="3" cols="30" id="wpseo_author_metadesc" name="wpseo_author_metadesc"><?php echo esc_textarea( get_the_author_meta( 'wpseo_metadesc', $user->ID ) ); ?></textarea>
					</td>
				</tr>
				<?php if ( $options['usemetakeywords'] === true ) { ?>
					<tr>
						<th><label for="wpseo_author_metakey"><?php _e( 'Meta keywords to use for Author page', 'wordpress-seo' ); ?></label></th>
						<td><input class="regular-text" type="text" id="wpseo_author_metakey" name="wpseo_author_metakey" value="<?php echo esc_attr( get_the_author_meta( 'wpseo_metakey', $user->ID ) ); ?>" /></td>
					</tr>
				<?php } ?>
			</table>
			<br /><br />
		<?php
		}
	
		/**
		 * Determine whether the wpseo option holds the current version, if it doesn't, run
		 * the upgrade procedures.
		 *
		 * @todo - [JRF] Check, check, double-check!
		 *
		 * @todo - [JRF] check: if upgrade is run on multi-site installation, upgrade for all sites ?
		 * May be not necessary as hook now changed from admin_init to init, so upgrade will run as soon as any page
		 * on a site is requested.
		 */
		function maybe_upgrade() {
			$options         = get_option( 'wpseo' );
			$current_version = isset( $options['version'] ) ? $options['version'] : 0;
	
			if ( version_compare( $current_version, WPSEO_VERSION, '==' ) )
				return;
	
			// <= 0.3.5: flush rewrite rules for new XML sitemaps
			if ( $current_version == 0 ) {
				$this->schedule_rewrite_flush();
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
	
				if ( is_array( $opt ) && $opt !== array() ) {
					foreach ( $opt as $key => $val ) {
						if ( ! in_array( $key, array( 'ignore_blog_public_warning', 'ignore_tour', 'ignore_page_comments', 'ignore_permalink', 'ms_defaults_set', 'version', 'disableadvanced_meta', 'googleverify', 'msverify', 'alexaverify' ) ) ) {
							unset( $opt[$key] );
						}
					}
					unset( $key, $val );
	
					update_option( 'wpseo', $opt );
				}
				unset( $opt );
			}
	
			// Fix wrongness created by buggy version 1.2.2
			if ( version_compare( $current_version, '1.2.4', '<' ) ) {
				$options = get_option( 'wpseo_titles' );
				if ( is_array( $options ) && isset( $options['title-home-wpseo'] ) && $options['title-home-wpseo'] == '%%sitename%% - %%sitedesc%% - 12345' ) {
					$options['title-home-wpseo'] = '%%sitename%% - %%sitedesc%%';
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
	
			if ( version_compare( $current_version, '1.4.13', '<' ) ) {
				wpseo_description_test();
			}
	
			if ( version_compare( $current_version, '1.4.15', '<' ) ) {
				$this->schedule_rewrite_flush();
			}
	
			if ( version_compare( $current_version, '1.4.16', '<' ) ) {
				$options = get_option( 'wpseo_permalinks' );
	
				if ( ! is_array( $options ) )
					$options = array();
	
				$options['cleanslugs'] = 'on';
				update_option( 'wpseo_permalinks', $options );
			}
	
			if ( version_compare( $current_version, '1.5.0', '<' ) ) {
				WPSEO_Options::clean_up();
				WPSEO_Taxonomy_Meta::clean_up();
				WPSEO_Meta::clean_up();
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
		 *
		 * @return string $clean_slug cleaned slug
		 */
		function remove_stopwords_from_slug( $slug ) {
			// Don't change an existing slug
			if ( isset( $slug ) && $slug !== '' ) {
				return $slug;
			}

			if ( ! isset( $_POST['post_title'] ) ) {
				return $slug;
			}
	
			// Lowercase the slug and strip slashes
			$clean_slug = sanitize_title( stripslashes( $_POST['post_title'] ) );
	
			// Turn it to an array and strip stopwords by comparing against an array of stopwords
			$clean_slug_array = array_diff( explode( '-', $clean_slug ), $this->stopwords() );
	
			// Turn the sanitized array into a string
			$clean_slug = join( '-', $clean_slug_array );
	
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
			$stopwords = explode( ',', __( "a,about,above,after,again,against,all,am,an,and,any,are,aren't,as,at,be,because,been,before,being,below,between,both,but,by,can't,cannot,could,couldn't,did,didn't,do,does,doesn't,doing,don't,down,during,each,few,for,from,further,had,hadn't,has,hasn't,have,haven't,having,he,he'd,he'll,he's,her,here,here's,hers,herself,him,himself,his,how,how's,i,i'd,i'll,i'm,i've,if,in,into,is,isn't,it,it's,its,itself,let's,me,more,most,mustn't,my,myself,no,nor,not,of,off,on,once,only,or,other,ought,our,ours,ourselves,out,over,own,same,shan't,she,she'd,she'll,she's,should,shouldn't,so,some,such,than,that,that's,the,their,theirs,them,themselves,then,there,there's,these,they,they'd,they'll,they're,they've,this,those,through,to,too,under,until,up,very,was,wasn't,we,we'd,we'll,we're,we've,were,weren't,what,what's,when,when's,where,where's,which,while,who,who's,whom,why,why's,with,won't,would,wouldn't,you,you'd,you'll,you're,you've,your,yours,yourself,yourselves", 'wordpress-seo' ) );
	
			/**
			 * Allows filtering of the stop words list
			 * Especially useful for users on a language in which WPSEO is not available yet
			 * and/or users who want to turn off stop word filtering
			 * @api  array  $stopwords  Array of all lowercase stopwords to check and/or remove from slug
			 */
			$stopwords = apply_filters( 'wpseo_stopwords', $stopwords );
	
			return $stopwords;
		}
	
		/**
		 * Check whether the stopword appears in the string
		 *
		 * @param string $haystack    The string to be checked for the stopword
		 * @param bool   $checkingUrl Whether or not we're checking a URL
		 *
		 * @return bool|mixed
		 */
		function stopwords_check( $haystack, $checkingUrl = false ) {
			$stopWords = $this->stopwords();
	
			if ( is_array( $stopWords ) && count( $stopWords ) > 0 ) {
				foreach ( $stopWords as $stopWord ) {
					// If checking a URL remove the single quotes
					if ( $checkingUrl )
						$stopWord = str_replace( "'", '', $stopWord );
	
					// Check whether the stopword appears as a whole word
					// @todo [JRF => whomever] check whether the use of \b (=word boundary) would be more efficient ;-)
					$res = preg_match( "`(^|[ \n\r\t\.,'\(\)\"\+;!?:])" . preg_quote( $stopWord, '`' ) . "($|[ \n\r\t\.,'\(\)\"\+;!?:])`iu", $haystack, $match );
					if ( $res > 0 )
						return $stopWord;
				}
			}
	
			return false;
		}
	
		/**
		 * Log the timestamp when a user profile has been updated
		 */
		function update_user_profile( $user_id ) {
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




		/********************** DEPRECATED METHODS **********************/
		
		/**
		 * Clears the cache
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Options::clear_cache()
		 * @see WPSEO_Options::clear_cache()
		 */
		function clear_cache() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::clear_cache()' );
			WPSEO_Options::clear_cache();
		}
	
		/**
		 * Clear rewrites
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Options::clear_rewrites()
		 * @see WPSEO_Options::clear_rewrites()
		 */
		function clear_rewrites() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::clear_rewrites()' );
			WPSEO_Options::clear_rewrites();
		}


		/**
		 * Register all the options needed for the configuration pages.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Options::register_settings()
		 * @see WPSEO_Options::register_settings()
		 */
		function options_init() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::register_settings()' );
			WPSEO_Options::register_settings();
		}
	
	
		/**
		 * Initialize default values for a new multisite blog.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Options::set_multisite_defaults()
		 * @see WPSEO_Options::set_multisite_defaults()
		 */
		function multisite_defaults() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::set_multisite_defaults()' );
			WPSEO_Options::set_multisite_defaults();
		}


		/**
		 * Loads the form for the import/export page.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Admin::load_page()
		 */
		function import_page() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Admin::load_page()' );
			$this->load_page();
		}

		/**
		 * Loads the form for the titles & metas page.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Admin::load_page()
		 */
		function titles_page() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Admin::load_page()' );
			$this->load_page();
		}

		/**
		 * Loads the form for the permalinks page.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Admin::load_page()
		 */
		function permalinks_page() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Admin::load_page()' );
			$this->load_page();
		}

		/**
		 * Loads the form for the internal links / breadcrumbs page.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Admin::load_page()
		 */
		function internallinks_page() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Admin::load_page()' );
			$this->load_page();
		}

		/**
		 * Loads the form for the file edit page.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Admin::load_page()
		 */
		function files_page() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Admin::load_page()' );
			$this->load_page();
		}

		/**
		 * Loads the form for the RSS page.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Admin::load_page()
		 */
		function rss_page() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Admin::load_page()' );
			$this->load_page();
		}

		/**
		 * Loads the form for the XML Sitemaps page.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Admin::load_page()
		 */
		function xml_sitemaps_page() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Admin::load_page()' );
			$this->load_page();
		}

		/**
		 * Loads the form for the Dashboard page.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Admin::load_page()
		 */
		function config_page() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Admin::load_page()' );
			$this->load_page();
		}

		/**
		 * Loads the form for the Social Settings page.
		 *
		 * @deprecated 1.5.0
		 * @deprecated use WPSEO_Admin::load_page()
		 */
		function social_page() {
			_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Admin::load_page()' );
			$this->load_page();
		}

	} /* End of class */

} /* End of class-exists wrapper */