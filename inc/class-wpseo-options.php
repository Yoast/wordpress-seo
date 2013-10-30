<?php
/**
 * @package Internals
 */

// Avoid direct calls to this file
if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
	die;
}

if ( ! class_exists( 'WPSeo_Options' ) ) {
	/**
	 * @package WordPress\Plugins\WPSeo
	 * @subpackage Internals
	 * @since 1.5.0
	 * @version 1.5.0
	 *
	 * Please note: all methods and properties are static. This class is not instantiated and does not have to be.
	 * Class is basically used as an alternative way of namespacing our functions and variables
	 */
	class WPSEO_Options {

/* @todo
Found in db, not as form = taxonomy meta data. Should be kept separate, but maybe we should add validation to it too.
(1697, 'wpseo_taxonomy_meta', 'a:1:{s:8:"category";a:4:{i:4;a:3:{s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";s:10:"wpseo_desc";s:6:"testje";}i:2;a:2:{s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";}i:1;a:2:{s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";}i:7;a:3:{s:10:"wpseo_desc";s:4:"test";s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";}}}', 'yes'),
*/

		/**
		 * Array of all the options the plugin uses with some usage directives
		 * The plugin can't use only one due to limitations of the options API.
		 *
		 * @static
		 * @var	array	'option_name'	=> array(
		 *					'group'				=> string	option group name for use in settings forms,
		 *					'include_in_all'	=> bool		whether to include the option in the return for get_all()
		 *					'only_multisite'	=> bool		whether this option is only use if the install is multisite
		 *				)
		 */
		public static $options = array(
			'wpseo' => array(
				'group'				=> null,
				'include_in_all'	=> true,
				'only_multisite'	=> false,
			),
			'wpseo_permalinks' => array(
				'group'				=> null,
				'include_in_all'	=> true,
				'only_multisite'	=> false,
			),
			'wpseo_titles' => array(
				'group'				=> null,
				'include_in_all'	=> true,
				'only_multisite'	=> false,
			),
			'wpseo_rss' => array(
				'group'				=> null,
				'include_in_all'	=> true,
				'only_multisite'	=> false,
			),
			'wpseo_internallinks' => array(
				'group'				=> null,
				'include_in_all'	=> true,
				'only_multisite'	=> false,
			),
			'wpseo_xml' => array(
				'group'				=> 'yoast_wpseo_xml_sitemap_options',
				'include_in_all'	=> true,
				'only_multisite'	=> false,
			),
			'wpseo_social' => array(
				'group'				=> null,
				'include_in_all'	=> true,
				'only_multisite'	=> false,
			),
			'wpseo_ms' => array(
				'group'				=> 'yoast_wpseo_multisite_options',
				'include_in_all'	=> false,
				'only_multisite'	=> true,
			),
		);
		
		/**
		 * @static
		 * @var	array	Array of all option names - set via WPSEO_Options::enrich_options()
		 * @see WPSEO_Options::enrich_options();
		 */
		public static $option_names = null;


		/**
		 * @static
		 * @var	array	Array of defaults for all the options the plugin uses
		 */
		public static $defaults = array(
			'wpseo'					=> array(
/*v*/				'ignore_blog_public_warning'		=> false, // 'ignore'
/*v*/				'ignore_meta_description_warning'	=> false,
/*v*/				'ignore_tour'						=> false, // 'ignore'
/*v*/				'ignore_page_comments'				=> false, // ''
/*v*/				'ignore_permalink'					=> false, // ''
/*v*/				'ms_defaults_set'					=> false, // ''
				'version'							=> '', // leave default as empty to ensure activation/upgrade works
				// renamed: was tracking_popup
/*v*/				'tracking_popup_done'				=> false, // 'done'
/*v*/				'blocking_files' 					=> array(),
/*v*/				'theme_has_description'				=> null,
/*v*/				'theme_description_found'			=> '', // set in function, may not be in form
/*v*/				'yoast_tracking'					=> false,
/*v*/				'disableadvanced_meta'				=> true, // 'on'
/*v*/				'googleverify'						=> '', // text field
/*v*/				'msverify'							=> '', // text field
/*v*/				'alexaverify'						=> '', // text field
			),

			'wpseo_permalinks'		=> array(
/*v*/				'stripcategorybase'					=> false,
/*v*/				'trailingslash'						=> false,
/*v*/				'cleanslugs'						=> true,
/*v*/				'redirectattachment'				=> false,
/*v*/				'cleanreplytocom'					=> false,
/*v*/				'cleanpermalinks'					=> false,
/*v*/				'force_transport'					=> 'default', //array( 'default' => __( 'Leave default', 'wordpress-seo' ), 'http' => __( 'Force http', 'wordpress-seo' ), 'https' => __( 'Force https', 'wordpress-seo' ) )
/*v*/				'cleanpermalink-googlesitesearch'	=> false,
/*v*/				'cleanpermalink-googlecampaign'		=> false,
/*v*/				'cleanpermalink-extravars'			=> '', // text field
			),

			'wpseo_titles'			=> array(
/*v*/				'forcerewritetitle'					=> false,
/*v*/				'title_test'						=> false, /* Not in form, set and unset via wpseo_title_test() function in wpseo-non-ajax-function.php */
/*v*/				'usemetakeywords'					=> false,
/*v*/				'noodp'								=> false,
/*v*/				'noydir'							=> false,
/*v*/				'hide-rsdlink'						=> false,
/*v*/				'hide-wlwmanifest'					=> false,
/*v*/				'hide-shortlink'					=> false,
/*v*/				'hide-feedlinks'					=> false,



/*v*/				'title-home-wpseo'					=> '%%sitename%% %%page%% %%sep%% %%sitedesc%%', // text field
/*v*/				'title-author-wpseo'				=> '', // text field - '%%name%%, Author at %%sitename%% %%page%%' - translated (added?) in enrich_defaults
/*v*/				'title-archive-wpseo'				=> '%%date%% %%page%% %%sep%% %%sitename%%', // text field
/*v*/				'title-search-wpseo'				=> '', // text field - 'You searched for %%searchphrase%% %%page%% %%sep%% %%sitename%%' - translated (added?) in enrich_defaults
/*v*/				'title-404-wpseo'					=> '', // text field - 'Page Not Found %%sep%% %%sitename%%' - translated (added?) in enrich_defaults
/*v*///				'title-' . $pt->name				=> ''; // text field - '%%title%% %%page%% %%sep%% %%sitename%%' - translated (added) in enrich_defaults
/*v*///				'title-ptarchive-' . $pt->name		=> ''; // text field - '%%pt_plural%% Archive %%page%% %%sep%% %%sitename%%' - translated (added) in enrich_defaults
/*v*///				'title-tax-' . $tax->name			=> ''; // text field - '%%term_title%% Archives %%page%% %%sep%% %%sitename%%' - translated (added) in enrich_defaults




/*v*/				'metadesc-home-wpseo'				=> '', // text area
/*v*/				'metadesc-author-wpseo'				=> '', // text area
/*v*/				'metadesc-archive-wpseo'			=> '', // text area
/*v*///				'metadesc-' . $pt->name				=> ''; // text area
/*v*///				'metadesc-ptarchive-' . $pt->name	=> ''; // text area
/*v*///				'metadesc-tax-' . $tax->name		=> ''; // text area

/*v*/				'metakey-home-wpseo'				=> '', // text field
/*v*/				'metakey-author-wpseo'				=> '', // text field
/*v*///				'metakey-' . $pt->name				=> ''; // text field
/*v*///				'metakey-ptarchive-' . $pt->name	=> ''; // text field
/*v*///				'metakey-tax-' . $tax->name			=> ''; // text field

/*v*///				'bctitle-ptarchive-' . $pt->name	=> ''; // text field

/*v*/				'noindex-subpages-wpseo'			=> false,
/*v*/				'noindex-author-wpseo'				=> false,
/*v*/				'noindex-archive-wpseo'				=> true, // 'on'
/*v*///				'noindex-' . $pt->name				=> false;
/*v*///				'noindex-ptarchive-' . $pt->name	=> false;
/*v*///				'noindex-' . $tax->name				=> false;

/*v*/				'disable-author'					=> false,
/*v*/				'disable-date'						=> false,

/*v*///				'noauthorship-' . $pt->name			=> false;
/*v*///				'showdate-' . $pt->name				=> false;
/*v*///				'hideeditbox-' . $pt->name			=> false;
/*v*///				'hideeditbox-tax-' . $tax->name		=> false;


				/**
				 * Uses enrich_defaults to add more along the lines of:
				 * - 'title-' . $pt->name
				 * - 'metadesc-' . $pt->name
				 * - 'metakey-' . $pt->name
				 * - 'noindex-' . $pt->name
				 * - 'noauthorship-' . $pt->name
				 * - 'showdate-' . $pt->name
				 * - 'hideeditbox-' . $pt->name
				 *
				 * - 'title-ptarchive-' . $pt->name
				 * - 'metadesc-ptarchive-' . $pt->name
				 * - 'metakey-ptarchive-' . $pt->name
				 * - 'bctitle-ptarchive-' . $pt->name
				 * - 'noindex-ptarchive-' . $pt->name
				 *
				 * - 'title-tax-' . $tax->name
				 * - 'metadesc-tax-' . $tax->name
				 * - 'metakey-tax-' . $tax->name
				 * - 'noindex-tax-' . $tax->name
				 * - 'hideeditbox-tax-' . $tax->name
				 */
			),
			'wpseo_rss'				=> array(
/*v*/				'rssbefore'							=> '', // text area
/*v*/				'rssafter'							=> '', // text area - 'The post %%POSTLINK%% appeared first on %%BLOGLINK%%.' - translated (added?) in enrich_defaults
			),

			'wpseo_internallinks'	=> array(
/*v*/				'breadcrumbs-enable'				=> false,
/*v*/				'breadcrumbs-sep'					=> '&raquo;', // text field
/*v*/				'breadcrumbs-home'					=> '', // text field - 'Home' - translated (added?) in enrich_defaults
/*v*/				'breadcrumbs-prefix'				=> '', // text field
/*v*/				'breadcrumbs-archiveprefix'			=> '', // text field - 'Archives for' - translated (added?) in enrich_defaults
/*v*/				'breadcrumbs-searchprefix'			=> '', // text field - 'You searched for' - translated (added?) in enrich_defaults
/*v*/				'breadcrumbs-404crumb'				=> '', // text field - 'Error 404: Page not found' - translated (added?) in enrich_defaults
/*v*/				'breadcrumbs-blog-remove'			=> false,
/*v*/				'breadcrumbs-boldlast'				=> false,
				/**
				 * Uses enrich_defaults to add more along the lines of:
/*v* /				 * - 'post_types-' . $pt->name . '-maintax'		=> 0 / string
/*v* /				 * - 'taxonomy-' . $tax->name . '-ptparent'		=> 0 / string
				 */
			),
			'wpseo_xml'				=> array(
/*v*/				'enablexmlsitemap'					=> true,
/*v*/				'disable_author_sitemap'			=> false,
/*v*/				'xml_ping_yahoo'					=> false,
/*v*/				'xml_ping_ask'						=> false,
/*v*/				'entries-per-page'					=> 1000,
				/**
				 * Uses enrich_defaults to add more along the lines of:
/*v* /				 * - 'post_types-' . $pt->name . '-not_in_sitemap' 	=> bool
/*v* /				 * - 'taxonomies-' . $tax->name . '-not_in_sitemap'	=> bool
				 */
			),
			
			'wpseo_social'			=> array(
/*v*/				'opengraph'							=> true, // 'on'
/*v*/				'facebook_site'						=> '', // text field
/*v*/				'og_frontpage_image'				=> '', // text field
/*v*/				'og_frontpage_desc'					=> '', // text field
/*v*/				'og_default_image'					=> '', // text field
/*v*/				'twitter'							=> false, // 'on'
/*v*/				'twitter_site'						=> '', // text field
/*v*/				'plus-author'						=> -1, // user id - '1'
/*v*/				'plus-publisher'					=> '', // text field
/*v*/				'fbconnectkey'						=> '', // not in form - auto-magically set via enrich defaults
/*v*/				'fb_admins'							=> array(), // array of user id's => array( name => '', link => '' )
/*v*/				'fbapps'							=> array(), // array of linked fb apps id's => fb app display names
/*v*/				'fbadminapp'						=> 0, // app id from fbapps list
			),

			'wpseo_ms' => array(
/*v*/				'access'							=> 'admin',
/*v*/				'defaultblog'						=> '', //numeric blog id or empty
			),
		);
		
		
		public static $variable_option_name_patterns = array(
			'wpseo_titles'			=> array(
				'title-',
				'metadesc-',
				'metakey-',
				'noindex-',
				'noauthorship-',
				'showdate-',
				'hideeditbox-',
				'bctitle-ptarchive-',
			),

			'wpseo_internallinks'	=> array(
				'post_types-',
				'taxonomy-',
			),
			'wpseo_xml'				=> array(
				'post_types-',
				'taxonomies-',
			),
		);
		
		
		/**
		 * @static
		 * @var		array	Array of all the current wpseo options set via self::get_all()
		 *					Reset to null by validation routines to ensure that we'll always have the correct
		 *					up-to-date options
		 */
		public static $wpseo_options;
		
		



		/**
		 *
		 * @static
		 */
		public static function init() {

			foreach ( self::$options as $option_key => $directives ) {
				/* Add filters which get applied to the get_options() results */
				self::add_default_filters( $option_key );
				add_filter( 'option_' . $option_key, array( __CLASS__, 'filter_' . $option_key ) );
				add_filter( 'site_option_' . $option_key, array( __CLASS__, 'filter_' . $option_key ) );
				
				/* The option validation routines remove the default filters to prevent failing
				   to insert an options if it's new. Let's add them back afterwards for an UPDATE (only WP 3.7)*/
				if( version_compare( $GLOBALS['wp_version'], '3.7', '==' ) ) {
					add_filter( 'pre_update_option_' . $option_key, array( __CLASS__, 'pre_update_option_' . $option_key ) );
				}

				if( $option_key === 'wpseo' ) {
					/* Add/remove the yoast tracking cron job on succesfull option add/update */
					add_action( 'add_option_' . $option_key, array( __CLASS__, 'schedule_yoast_tracking' ), 10, 2 );
					add_action( 'update_option_' . $option_key, array( __CLASS__, 'schedule_yoast_tracking' ), 10, 2 );
				}
			}

			/* The option validation routines remove the default filters to prevent failing
			   to insert an options if it's new. Let's add them back afterwards for an INSERT */
			add_action( 'add_option', array( __CLASS__, 'add_default_filters' ) );

			/* The option validation routines remove the default filters to prevent failing
			   to insert an options if it's new. Let's add them back afterwards for an UPDATE (not WP 3.7) */
			if( version_compare( $GLOBALS['wp_version'], '3.7', '!=' ) ) {
				add_action( 'update_option', array( __CLASS__, 'add_default_filter' ) );
			}



			/* @todo - deal with update during upgrading !
			Something along the lines of the below may work:

			   Lastly, we'll be saving our option during the upgrade routine *before* the setting
			   is registered (and therefore the validation is registered), so make sure that the
			   option is validated anyway. */
/*			foreach ( self::$options as $option_name => $directives ) {
				add_filter( 'wpseo_save_option_on_upgrade_' . $option_name, array( __CLASS__, 'validate_' . $option_name ) );
			}*/


			self::enrich_options();

			/* Translate some defaults as early as possible - textdomain is loaded in init on priority 1 */
			add_action( 'init', array( __CLASS__, 'translate_defaults' ), 2 );

			// Only enrich defaults once custom post types and taxonomies have been registered
			// which is normally done on the init action
			// @todo - verify that none of the options which are only available after enrichment are used before the enriching
			add_action( 'init', array( __CLASS__, 'enrich_defaults' ), 99 );
			
			

		}



		public static function enrich_options() {
			/* Set option group name if not given */
			foreach ( self::$options as $option_name => $directives ) {
				if ( !isset( $directives['group'] ) || $directives['group'] !== '' ) {
					self::$options[$option_name]['group'] = 'yoast_' . $option_name . '_options';
				}
			}
			/* Create re-usable option names property */
			if ( !is_array( self::$option_names ) ) {
				self::$option_names = array_keys( self::$options );
			}
		}
		
		public static function translate_defaults() {
			/* Translate default strings */
			/* wpseo_titles */
			self::$defaults['wpseo_titles']['title-author-wpseo'] = sprintf( __( '%s, Author at %s', 'wordpress-seo' ), '%%name%%', '%%sitename%%' ) . ' %%page%% ';
			self::$defaults['wpseo_titles']['title-search-wpseo'] = sprintf( __( 'You searched for %s', 'wordpress-seo' ), '%%searchphrase%%' ) . ' %%page%% %%sep%% %%sitename%%';
			self::$defaults['wpseo_titles']['title-404-wpseo']    = __( 'Page Not Found', 'wordpress-seo' ) . ' %%sep%% %%sitename%%';

			/* wpseo_internallinks */
			self::$defaults['wpseo_internallinks']['breadcrumbs-home']          = __( 'Home', 'wordpress-seo' );
			self::$defaults['wpseo_internallinks']['breadcrumbs-archiveprefix'] = __( 'Archives for', 'wordpress-seo' );
			self::$defaults['wpseo_internallinks']['breadcrumbs-searchprefix']  = __( 'You searched for', 'wordpress-seo' );
			self::$defaults['wpseo_internallinks']['breadcrumbs-404crumb']      = __( 'Error 404: Page not found', 'wordpress-seo' );

			/* wpseo_rss */
			self::$defaults['wpseo_rss']['rssafter'] = sprintf( __( 'The post %s appeared first on %s.', 'wordpress-seo' ), '%%POSTLINK%%', '%%BLOGLINK%%' );

			/* Auto-magically set the fb connect key */
			self::$defaults['wpseo_social']['fbconnectkey'] = self::get_fbconnectkey();
			
			/* Reset the all options static if it would have been set already*/
			self::$wpseo_options = null;
		}


		/**
		 * Add dynamically created default options based on available post types and taxonomies
		 */
		public static function enrich_defaults( $option_key = null ) {

			// Retrieve all the relevant post type and taxonomy arrays
			$post_type_names = get_post_types( array( 'public' => true ), 'names' );

			$post_type_objects_custom = array();
			if ( !isset( $option_key ) || in_array( $option_key, array( 'wpseo_titles' ) ) ) {
				$post_types_objects_custom = get_post_types( array( 'public' => true, '_builtin' => false ), 'objects' );
			}

			$taxonomy_names = array();
			if ( !isset( $option_key ) || in_array( $option_key, array( 'wpseo_titles' ) ) ) {
				$taxonomy_names = get_taxonomies( array( 'public' => true ), 'names' );
			}

			$taxonomy_objects = array();
			if ( !isset( $option_key ) || in_array( $option_key, array( 'wpseo_xml' ) ) ) {
				$taxonomy_objects = get_taxonomies( array( 'public' => true ), 'objects' );
			}

			$taxonomy_names_custom = array();
			if ( !isset( $option_key ) || in_array( $option_key, array( 'wpseo_internallinks' ) ) ) {
				$taxonomy_names_custom = get_taxonomies( array( 'public' => true, '_builtin' => false ), 'names' );
			}


			/* wpseo_titles */
			if ( !isset( $option_key ) || $option_key === 'wpseo_titles' ) {

				if ( $post_type_names !== array() ) {
					foreach ( $post_type_names as $pt ) {
//						if ( $options[ 'redirectattachment' ] === true && $posttype == 'attachment' )
//							continue;

						self::$defaults['wpseo_titles']['title-' . $pt]        = '%%title%% %%page%% %%sep%% %%sitename%%'; // text field
						self::$defaults['wpseo_titles']['metadesc-' . $pt]     = ''; // text area
						self::$defaults['wpseo_titles']['metakey-' . $pt]      = ''; // text field
						self::$defaults['wpseo_titles']['noindex-' . $pt]      = false;
						self::$defaults['wpseo_titles']['noauthorship-' . $pt] = false;
						self::$defaults['wpseo_titles']['showdate-' . $pt]     = false;
						self::$defaults['wpseo_titles']['hideeditbox-' . $pt]  = false;
					}
					unset( $pt );
				}

				if ( $post_type_objects_custom !== array() ) {
					foreach ( $post_type_objects_custom as $pt ) {
						if ( !$pt->has_archive )
							continue;

						self::$defaults['wpseo_titles']['title-ptarchive-' . $pt->name]    = sprintf( __( '%s Archive', 'wordpress-seo' ), '%%pt_plural%%' ) . ' %%page%% %%sep%% %%sitename%%'; // text field
						self::$defaults['wpseo_titles']['metadesc-ptarchive-' . $pt->name] = ''; // text area
						self::$defaults['wpseo_titles']['metakey-ptarchive-' . $pt->name]  = ''; // text field
						self::$defaults['wpseo_titles']['bctitle-ptarchive-' . $pt->name]  = ''; // text field
						self::$defaults['wpseo_titles']['noindex-ptarchive-' . $pt->name]  = false;
					}
					unset( $pt );
				}

				if ( $taxonomy_names !== array() ) {
					foreach ( $taxonomy_names as $tax ) {
						self::$defaults['wpseo_titles']['title-tax-' . $tax]           = sprintf( __( '%s Archives', 'wordpress-seo' ), '%%term_title%%' ) . ' %%page%% %%sep%% %%sitename%%'; // text field
						self::$defaults['wpseo_titles']['metadesc-tax-' . $tax]        = ''; // text area
						self::$defaults['wpseo_titles']['metakey-tax-' . $tax]         = ''; // text field
						self::$defaults['wpseo_titles']['hideeditbox-tax-' . $tax] = false;

						if ( $tax !== 'post_format' )
							self::$defaults['wpseo_titles']['noindex-tax-' . $tax] = false;
						else
							self::$defaults['wpseo_titles']['noindex-tax-' . $tax] = true;

					}
					unset( $tax );
				}
			}


			
			/* wpseo_internallinks */
			if ( !isset( $option_key ) || $option_key === 'wpseo_internallinks' ) {

				if ( $post_type_names !== array() ) {
					foreach ( $post_type_names as $pt ) {
						$pto_taxonomies = get_object_taxonomies( $pt, 'names' );
						if ( count( $pto_taxonomies ) > 0 ) {
							self::$defaults['wpseo_internallinks']['post_types-' . $pt . '-maintax'] = 0; // select box
						}
						unset( $pto_taxonomies );
					}
					unset( $pt );
				}

				if ( $taxonomy_names_custom !== array() ) {
					foreach ( $taxonomy_names_custom as $tax ) {
						self::$defaults['wpseo_internallinks']['taxonomy-' . $tax . '-ptparent'] = 0; // select box;
					}
					unset( $tax );
				}
			}


			/* wpseo_xml */
			if ( !isset( $option_key ) || $option_key === 'wpseo_xml' ) {
				$filtered_post_types = apply_filters( 'wpseo_sitemaps_supported_post_types', $post_type_names );
				if ( is_array( $filtered_post_types ) && $filtered_post_types !== array() ) {
					foreach ( $filtered_post_types as $pt ) {
						if ( $pt !== 'attachment' ) {
							self::$defaults['wpseo_xml']['post_types-' . $pt . '-not_in_sitemap'] = false;
						}
						else {
							self::$defaults['wpseo_xml']['post_types-' . $pt . '-not_in_sitemap'] = true;
						}
					}
					unset( $pt );
				}
				unset( $filtered_post_types );
	
				$filtered_taxonomies = apply_filters( 'wpseo_sitemaps_supported_taxonomies', $taxonomy_objects );
				if ( is_array( $filtered_taxonomies ) && $filtered_taxonomies !== array() ) {
					foreach ( $filtered_taxonomies as $tax ) {
						if ( isset( $tax->labels->name ) && trim( $tax->labels->name ) != '' ) {
							self::$defaults['wpseo_xml']['taxonomies-' . $tax->name . '-not_in_sitemap'] = false;
						}
					}
					unset( $tax );
				}
				unset( $filtered_taxonomies );
			}
			
			// @todo: maybe add a apply_filter() for the defaults
			// If multisite, we could then filter the defaults with the defaultblog settings ?
			
			/* Reset the all options static to refresh it after enrichment of the defaults */
			self::$wpseo_options = null;
		}
		
		
		/**
		 * Register all the options needed for the configuration pages.
		 * Calling action added in WPSEO_Admin::__construct()
		 */
		public static function register_settings() {

			foreach ( self::$options as $option_name => $directives ) {
				if ( $directives['only_multisite'] === false ) {
					register_setting( $directives['group'], $option_name, array( __CLASS__, 'validate_' . $option_name )  );
				}
				else {
					if ( function_exists( 'is_multisite' ) && is_multisite() ) {
						// @todo: check if the below if() is still needed...
						if ( get_option( 'wpseo' ) == '1pseo_social' )
							delete_option( 'wpseo' );

						register_setting( $directives['group'], $option_name, array( __CLASS__, 'validate_' . $option_name ) );
					}
				}
			}
		}


		/**
		 * @param	string	$option_key
		 */
		public static function add_default_filters( $option_key ) {
			if ( !is_array( self::$option_names ) ) {
				self::$option_names = array_keys( self::$options );
			}
			
			if ( in_array( $option_key, self::$option_names ) === true ) {
				if ( has_filter( 'default_option_' . $option_key, array( __CLASS__, 'filter_defaults_' . $option_key ) ) === false ) {
					add_filter( 'default_option_' . $option_key, array( __CLASS__, 'filter_defaults_' . $option_key ) );
				}
				if ( has_filter( 'default_site_option_' . $option_key, array( __CLASS__, 'filter_defaults_' . $option_key ) ) === false ) {
					add_filter( 'default_site_option_' . $option_key, array( __CLASS__, 'filter_defaults_' . $option_key ) );
				}
			};
		}
		

		/* WP 3.7 specific as update_option action hook was in the wrong place temporarily */
		public static function pre_update_option_wpseo( $new_value ) {
			self::add_default_filters( 'wpseo' );
			return $new_value;
		}
		public static function pre_update_option_wpseo_permalinks( $new_value ) {
			self::add_default_filters( 'wpseo_permalinks' );
			return $new_value;
		}
		public static function pre_update_option_wpseo_titles( $new_value ) {
			self::add_default_filters( 'wpseo_titles' );
			return $new_value;
		}
		public static function pre_update_option_wpseo_rss( $new_value ) {
			self::add_default_filters( 'wpseo_rss' );
			return $new_value;
		}
		public static function pre_update_option_wpseo_internallinks( $new_value ) {
			self::add_default_filters( 'wpseo_internallinks' );
			return $new_value;
		}
		public static function pre_update_option_wpseo_xml( $new_value ) {
			self::add_default_filters( 'wpseo_xml' );
			return $new_value;
		}
		public static function pre_update_option_wpseo_social( $new_value ) {
			self::add_default_filters( 'wpseo_social' );
			return $new_value;
		}
		public static function pre_update_option_wpseo_ms( $new_value ) {
			self::add_default_filters( 'wpseo_ms' );
			return $new_value;
		}


		
		/* Called from validation methods */
		/**
		 * @param	string	$option_key
		 */
		public static function remove_default_filters( $option_key ) {
			/* Remove default filters to allow for inserting of option if it doesn't exist */
			remove_filter( 'default_option_' . $option_key, array( __CLASS__, 'filter_defaults_' . $option_key ) );
			remove_filter( 'default_site_option_' . $option_key, array( __CLASS__, 'filter_defaults_' . $option_key ) );
			/* Reset the all options static as an option is being updated */
			self::$wpseo_options = null;
		}



		public static function filter_defaults_wpseo() {
			return self::get_defaults( 'wpseo' );
		}
		public static function filter_defaults_wpseo_permalinks() {
			return self::get_defaults( 'wpseo_permalinks' );
		}
		public static function filter_defaults_wpseo_titles() {
			return self::get_defaults( 'wpseo_titles' );
		}
		public static function filter_defaults_wpseo_rss() {
			return self::get_defaults( 'wpseo_rss' );
		}
		public static function filter_defaults_wpseo_internallinks() {
			return self::get_defaults( 'wpseo_internallinks' );
		}
		public static function filter_defaults_wpseo_xml() {
			return self::get_defaults( 'wpseo_xml' );
		}
		public static function filter_defaults_wpseo_social() {
			return self::get_defaults( 'wpseo_social' );
		}
		public static function filter_defaults_wpseo_ms() {
			return self::get_defaults( 'wpseo_ms' );
		}



		public static function get_defaults( $option_key ) {
			self::enrich_defaults( $option_key );
			return self::$defaults[$option_key];
		}


		/**
		 * These methods should *not* be called directly!!! The are only meant to filter the get_options() results
		 */
		public static function filter_wpseo( $options = null ) {
			return self::array_filter_merge( 'wpseo', $options );
		}
		public static function filter_wpseo_permalinks( $options = null ) {
			return self::array_filter_merge( 'wpseo_permalinks', $options );
		}
		public static function filter_wpseo_titles( $options = null ) {
			return self::array_filter_merge( 'wpseo_titles', $options );
		}
		public static function filter_wpseo_rss( $options = null ) {
			return self::array_filter_merge( 'wpseo_rss', $options );
		}
		public static function filter_wpseo_internallinks( $options = null ) {
			return self::array_filter_merge( 'wpseo_internallinks', $options );
		}
		public static function filter_wpseo_xml( $options = null ) {
			return self::array_filter_merge( 'wpseo_xml', $options );
		}
		public static function filter_wpseo_social( $options = null ) {
			return self::array_filter_merge( 'wpseo_social', $options );
		}
		public static function filter_wpseo_ms( $options = null ) {
			return self::array_filter_merge( 'wpseo_ms', $options );
		}
		
		

		
		/**
		 * Helper method - Combines a fixed array of default values with an options array
		 * while filtering out any keys which are not in the defaults array.
		 *
		 * @static
		 *
		 * @param	string	$option_key	Option name of the option we're doing the merge for
		 * @param	array	$options	(Optional) Current options
		 * 								- if not set, the option defaults for the $option_key will be returned.
		 * @return	array	Combined and filtered options array.
		 */
		public static function array_filter_merge( $option_key, $options = null ) {
			
			$defaults = self::get_defaults( $option_key );

			if ( !isset( $options ) || $options === false ) {
				return $defaults;
			}

			$options = (array) $options;
			$filtered  = array();

			foreach ( $defaults as $name => $default ) {
				if ( isset( $options[$name] ) )
					$filtered[$name] = $options[$name];
				else
					$filtered[$name] = $default;
			}
			unset( $name, $default );

			/* If the option contains variable option keys, make sure we don't remove those settings
			   - even if the defaults are not complete yet.
			   Unfortunately this means we also won't be removing the settings for post types or taxonomies
			   which are no longer in the WP install, but rather that than the other way around */
   			$filtered = self::retain_variable_keys( $option_key, $options, $filtered );

			return $filtered;
		}


		public static function retain_variable_keys( $option_key, $dirty, $clean ) {

			if ( isset( self::$variable_option_name_patterns[$option_key] ) ) {
				foreach ( $dirty as $name => $value ) {
					foreach ( self::$variable_option_name_patterns[$option_key] as $pattern ) {
						if ( strpos( $name, $pattern ) === 0 && ! isset( $clean[$name] ) ) {
							$clean[$name] = $value;
						}
					}
					unset( $pattern );
				}
				unset( $name, $value );
			}

			return $clean;
		}



		/**
		 * (Un-)schedule the yoast tracking cronjob if the tracking option has changed
		 * 
		 * Needs to be done here, rather than in the Yoast_Tracking class as class-tracking.php may not be loaded
		 *
		 * @todo - check if this has any impact on other Yoast plugins which may use the same tracking schedule
		 * hook. If so, may be get any other yoast plugin options, check for the tracking status and
		 * unschedule based on the combined status
		 *
		 * @param	mixed	$disregard	Not needed - Option name if option was added, old value if option was updated
		 * @param	array	$value		The new value of the option after add/update
		 * @return	void
		 */
		public static function schedule_yoast_tracking( $disregard, $value ) {
			$current_schedule = wp_next_scheduled( 'yoast_tracking' );

			if( $value['yoast_tracking'] === true && $current_schedule === false ) {
				// The tracking checks daily, but only sends new data every 7 days.
				wp_schedule_event( time(), 'daily', 'yoast_tracking' );
			}
			else if( $value['yoast_tracking'] === false && $current_schedule !== false ){
				wp_clear_scheduled_hook( 'yoast_tracking' );
			}
		}






/*
@todo - double check that validation will not cause errors when called from upgrade routine (add_settings_error not yet available)
*/
		/**
		 * @param $options
		 *
		 * @return mixed
		 */
		public static function validate_wpseo( $options ) {
			
			$option_key = 'wpseo';

			self::remove_default_filters( $option_key );

			/* Don't change anything if user does not have the required capability */
			if ( false === is_admin() || false === current_user_can( 'manage_options' ) ) {
				return get_option( $option_key );
			}


			$clean   = self::get_defaults( $option_key );
			$old     = get_option( $option_key );
			$options = array_map( array( __CLASS__, 'trim_recursive' ), $options );
			

			foreach ( $clean as $k => $v ) {
				switch ( $k ) {
					case 'version':
					// @todo - should given number be allowed for upgrade routine ?
						$clean[$k] = WPSEO_VERSION;
						break;

					case 'blocking_files':
						if ( isset( $options[$k] ) && ( is_array( $options[$k] ) && $options[$k] !== array() ) ) {
							$clean[$k] = $options[$k];
						}
						else if( isset( $old[$k] ) ) {
							$clean[$k] = $old[$k];
						}
						break;

					case 'theme_description_found':
						if ( isset( $options[$k] ) && is_string( $options[$k] ) ) {
							$clean[$k] = $options[$k]; // @todo maybe do wp_kses ?
						}
						else if( isset( $old[$k] ) ) {
							$clean[$k] = $old[$k];
						}
						break;


					/* text fields */
					case 'googleverify':
					case 'msverify':
					case 'alexaverify':
						if ( isset( $options[$k] ) && $options[$k] !== '' ) {
							$meta = $options[$k];
							if ( strpos( $meta, 'content' ) ) {
								preg_match( '`content="([^"]+)"`', $meta, $match );
								$meta = $match[1];
								unset( $match );
							}

							$meta = sanitize_text_field( $meta );
							if ( $meta !== '' ) {
								switch ( $k ) {
									case 'googleverify':
										if ( preg_match( '`^[A-Za-z0-9_-]+$`', $meta ) ) {
											$clean[$k] = $meta;
										}
										else {
											add_settings_error(
												WPSEO_Options::$options['wpseo']['group'], // slug title of the setting
												'_' . $k, // suffix-id for the error message box
												sprintf( __( '%s does not seem to be a valid Google Webmaster Tools Verification string. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( $meta ) . '</strong>' ), // the error message
												'error' // error type, either 'error' or 'updated'
											);
										}
										break;

									case 'msverify':
										if ( preg_match( '`^[A-Fa-f0-9_-]+$`', $meta ) ) {
											$clean[$k] = $meta;
										}
										else {
											add_settings_error(
												WPSEO_Options::$options['wpseo']['group'], // slug title of the setting
												'_' . $k, // suffix-id for the error message box
												sprintf( __( '%s does not seem to be a valid Bing Webmasters Tools Verification string. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( $meta ) . '</strong>' ), // the error message
												'error' // error type, either 'error' or 'updated'
											);
										}
										break;

									case 'alexaverify':
										// @todo - add validation, currently Pattern is unknown
										$clean[$k] = $meta;
										break;
								}
							}
							unset( $meta );
						}
						break;

					/* boolean|null fields - if set a check was done, if null, it hasn't */
					case 'theme_has_description':
						$clean[$k] = ( isset( $options[$k] ) ? self::validate_bool( $options[$k] ) : null );
						break;

					/* boolean fields */
					case 'ignore_blog_public_warning': // 'ignore'
					case 'ignore_meta_description_warning':
					case 'ignore_tour': // 'ignore'
					case 'ignore_page_comments':
					case 'ignore_permalink':
					case 'ms_defaults_set':
					case 'yoast_tracking':
					case 'tracking_popup_done': // 'done'
					case 'disableadvanced_meta': // 'on'
					default:
						$clean[$k] = ( isset( $options[$k] ) ? self::validate_bool( $options[$k] ) : false );
						break;
				}
			}

   			$clean = self::retain_variable_keys( $option_key, $options, $clean );
			return $clean;
		}


		/**
		 * @param $options
		 *
		 * @return mixed
		 */
		public static function validate_wpseo_permalinks( $options ) {

			$option_key = 'wpseo_permalinks';

			self::remove_default_filters( $option_key );

			/* Don't change anything if user does not have the required capability */
			if ( false === is_admin() || false === current_user_can( 'manage_options' ) ) {
				return get_option( $option_key );
			}

			$clean   = self::get_defaults( $option_key );
			$old     = get_option( $option_key );
			$options = array_map( array( __CLASS__, 'trim_recursive' ), $options );
			
			$allowed_transport = array( 'default', 'http', 'https' );

			foreach ( $clean as $k => $v ) {
				switch ( $k ) {
					case 'force_transport':
						if ( isset( $options[$k] ) && in_array( $options[$k], $allowed_transport, true ) === true ) {
							$clean[$k] = $options[$k];
						}
						else {
							add_settings_error(
								WPSEO_Options::$options['wpseo_permalinks']['group'], // slug title of the setting
								'_' . $k, // suffix-id for the error message box
								__( 'Invalid transport mode set for the canonical settings. Value reset to default.', 'wordpress-seo' ), // the error message
								'error' // error type, either 'error' or 'updated'
							);
						}
						break;

					/* text fields */
					case 'cleanpermalink-extravars':
						if ( isset( $options[$k] ) && $options[$k] !== '' ) {
							$clean[$k] = sanitize_text_field( $options[$k] );
						}
						break;

					/* boolean fields */
					case 'stripcategorybase':
					case 'trailingslash':
					case 'cleanslugs':
					case 'redirectattachment':
					case 'cleanreplytocom':
					case 'cleanpermalinks':
					case 'cleanpermalink-googlesitesearch':
					case 'cleanpermalink-googlecampaign':
					default:
						$clean[$k] = ( isset( $options[$k] ) ? self::validate_bool( $options[$k] ) : false );
						break;
				}
			}

   			$clean = self::retain_variable_keys( $option_key, $options, $clean );
			return $clean;
		}


		/**
		 * @param $options
		 *
		 * @return mixed
		 */
		public static function validate_wpseo_titles( $options ) {
			$option_key = 'wpseo_titles';

			self::remove_default_filters( $option_key );

			/* Don't change anything if user does not have the required capability */
			if ( false === is_admin() || false === current_user_can( 'manage_options' ) ) {
				return get_option( $option_key );
			}

			$clean   = self::get_defaults( $option_key );
			$old     = get_option( $option_key );
			$options = array_map( array( __CLASS__, 'trim_recursive' ), $options );


			foreach ( $clean as $k => $v ) {
				$switch_key = $k;

				foreach ( self::$variable_option_name_patterns[$option_key] as $pattern ) {
					if ( strpos( $k, $pattern ) === 0 ) {
						$switch_key = $pattern;
					}
				}
				unset( $pattern );


				switch ( $switch_key ) {
					/* text fields */
					/* Covers:
					   'title-home-wpseo', 'title-author-wpseo', 'title-archive-wpseo',
					   'title-search-wpseo', 'title-404-wpseo'
					   'title-' . $pt->name
					   'title-ptarchive-' . $pt->name
					   'title-tax-' . $tax->name */
					case 'title-':
						if ( isset( $options[$k] ) ) {
							$clean[$k] = sanitize_text_field( $options[$k] );
						}
						break;

					/* Covers:
					   'metadesc-home-wpseo', 'metadesc-author-wpseo', 'metadesc-archive-wpseo'
					   'metadesc-' . $pt->name
					   'metadesc-ptarchive-' . $pt->name
					   'metadesc-tax-' . $tax->name */
					case 'metadesc-':
					/* Covers:
					   'metakey-home-wpseo', 'metakey-author-wpseo'
					   'metakey-' . $pt->name
					   'metakey-ptarchive-' . $pt->name
					   'metakey-tax-' . $tax->name */
					case 'metakey-':
					/* Covers:
					   ''bctitle-ptarchive-' . $pt->name */
					case 'bctitle-ptarchive-':
						if ( isset( $options[$k] ) && $options[$k] !== '' ) {
							$clean[$k] = sanitize_text_field( $options[$k] );
						}
						break;


					/* boolean fields */
					case 'forcerewritetitle':
					case 'title_test':
					case 'usemetakeywords':
					case 'noodp':
					case 'noydir':
					case 'hide-rsdlink':
					case 'hide-wlwmanifest':
					case 'hide-shortlink':
					case 'hide-feedlinks':
					case 'disable-author':
					case 'disable-date':
					/* Covers:
					   'noindex-subpages-wpseo', 'noindex-author-wpseo', 'noindex-archive-wpseo'
					   'noindex-' . $pt->name
					   'noindex-ptarchive-' . $pt->name
					   'noindex-tax-' . $tax->name */
					case 'noindex-':
					case 'noauthorship-': /* 'noauthorship-' . $pt->name */
					case 'showdate-': /* 'showdate-'. $pt->name */
					 /* 'hideeditbox-'. $pt->name */
					 /* 'hideeditbox-tax-' . $tax->name */
					case 'hideeditbox-':
					default:
						$clean[$k] = ( isset( $options[$k] ) ? self::validate_bool( $options[$k] ) : false );
						break;
				}
			}

   			$clean = self::retain_variable_keys( $option_key, $options, $clean );
			return $clean;
		}


		/**
		 * @param $options
		 *
		 * @return mixed
		 */
		public static function validate_wpseo_rss( $options ) {
			$option_key = 'wpseo_rss';

			self::remove_default_filters( $option_key );

			/* Don't change anything if user does not have the required capability */
			if ( false === is_admin() || false === current_user_can( 'manage_options' ) ) {
				return get_option( $option_key );
			}

			$clean   = self::get_defaults( $option_key );
			$old     = get_option( $option_key );
			$options = array_map( array( __CLASS__, 'trim_recursive' ), $options );

			foreach ( $clean as $k => $v ) {
				if ( isset( $options[$k] ) ) {
					$clean[$k] = wp_kses_post( $options[$k] );
				}
			}
			
   			$clean = self::retain_variable_keys( $option_key, $options, $clean );
			return $clean;
		}


		/**
		 * @param $options
		 *
		 * @return mixed
		 */
		public static function validate_wpseo_internallinks( $options ) {
			
			$option_key = 'wpseo_internallinks';

			self::remove_default_filters( $option_key );

			/* Don't change anything if user does not have the required capability */
			if ( false === is_admin() || false === current_user_can( 'manage_options' ) ) {
				return get_option( $option_key );
			}

			$clean   = self::get_defaults( $option_key );
			$old     = get_option( $option_key );
			$options = array_map( array( __CLASS__, 'trim_recursive' ), $options );

			if ( !isset( $allowed_post_types ) ) {
				$post_types = get_post_types( array( 'public' => true ), 'objects' );

				$allowed_post_types = array();
				if ( get_option( 'show_on_front' ) == 'page' )
					$allowed_post_types[] = 'post';
					
				foreach ( $post_types as $type ) {
					if ( $type->has_archive )
						$allowed_post_types[] = $type->name;
				}
				unset( $post_types, $type );
			}


			foreach ( $clean as $k => $v ) {
				$switch_key = $k;
				
				foreach ( self::$variable_option_name_patterns[$option_key] as $pattern ) {
					if ( strpos( $k, $pattern ) === 0 ) {
						$switch_key = $pattern;
					}
				}
				unset( $pattern );
				

				switch ( $switch_key ) {
					/* text fields */
					case 'breadcrumbs-sep':
					case 'breadcrumbs-home':
					case 'breadcrumbs-prefix':
					case 'breadcrumbs-archiveprefix':
					case 'breadcrumbs-searchprefix':
					case 'breadcrumbs-404crumb':
						if ( isset( $options[$k] ) ) {
							$clean[$k] = sanitize_text_field( $options[$k] );
						}
						break;
						

					/* 'post_types-' . $pt->name . '-maintax' fields */
					case 'post_types-':
						$post_type  = str_replace( 'post_types-', '', $k );
						$post_type  = str_replace( '-maintax', '', $post_type );
						$taxonomies = get_object_taxonomies( $post_type, 'names' );
						if ( isset( $options[$k] ) && ( in_array( $options[$k], $taxonomies, true ) === true || $options[$k] == 0 ) ) {
							$clean[$k] = $options[$k];
						}
						else {
							// @todo maybe change the untranslated $pt name in the error message to the nicely translated label ?
							add_settings_error(
								WPSEO_Options::$options['wpseo_internallinks']['group'], // slug title of the setting
								'_' . $k, // suffix-id for the error message box
								sprintf( __( 'Please select a valid taxonomy for post type "%s"', 'wordpress-seo' ), $post_type ), // the error message
								'error' // error type, either 'error' or 'updated'
							);
						}
						unset( $taxonomies, $post_type );
						break;


					/* 'taxonomy-' . $tax->name . '-ptparent' fields */
					case 'taxonomy-':
						if ( isset( $options[$k] ) && ( in_array( $options[$k], $allowed_post_types, true ) === true || $options[$k] == 0 ) ) {
							$clean[$k] = $options[$k];
						}
						else {
							// @todo maybe change the untranslated $tax name in the error message to the nicely translated label ?
							$tax = str_replace( 'taxonomy-', '', $k );
							$tax = str_replace( '-ptparent', '', $tax );
							add_settings_error(
								WPSEO_Options::$options['wpseo_internallinks']['group'], // slug title of the setting
								'_' . $tax, // suffix-id for the error message box
								sprintf( __( 'Please select a valid post type for taxonomy "%s"', 'wordpress-seo' ), $tax ), // the error message
								'error' // error type, either 'error' or 'updated'
							);
							unset( $tax );
						}
						break;


					/* boolean fields */
					case 'breadcrumbs-enable':
					case 'breadcrumbs-blog-remove':
					case 'breadcrumbs-boldlast':
					default:
						$clean[$k] = ( isset( $options[$k] ) ? self::validate_bool( $options[$k] ) : false );
						break;
				}
			}
			
   			$clean = self::retain_variable_keys( $option_key, $options, $clean );
			return $clean;
		}


		/**
		 * @param $options
		 *
		 * @return mixed
		 */
		public static function validate_wpseo_xml( $options ) {
			$option_key = 'wpseo_xml';

			self::remove_default_filters( $option_key );

			/* Don't change anything if user does not have the required capability */
			if ( false === is_admin() || false === current_user_can( 'manage_options' ) ) {
				return get_option( $option_key );
			}

			$clean   = self::get_defaults( $option_key );
			$old     = get_option( $option_key );
			$options = array_map( array( __CLASS__, 'trim_recursive' ), $options );
			
			foreach ( $clean as $k => $v ) {
				$switch_key = $k;
				
				foreach ( self::$variable_option_name_patterns[$option_key] as $pattern ) {
					if ( strpos( $k, $pattern ) === 0 )
						$switch_key = $pattern;
				}
				unset( $pattern );


				switch ( $switch_key ) {
					/* integer fields */
					case 'entries-per-page':
					// @todo add some more rules (minimum 50 or something) and add error message
						if ( isset( $options[$k] ) && $options[$k] !== '' ) {
							$int = self::validate_int( $options[$k] );
							if ( $int !== false && $int > 0 ) {
								$clean[$k] = $int;
							}
							else {
								add_settings_error(
									WPSEO_Options::$options['wpseo_xml']['group'], // slug title of the setting
									'_' . $k, // suffix-id for the error message box
									sprintf( __( '"Max entries per sitemap page" should be a positive number, which %s is not. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( sanitize_text_field( $options[$k] ) ) . '</strong>' ), // the error message
									'error' // error type, either 'error' or 'updated'
								);
							}
							unset( $int );
						}
						break;

					/* boolean fields */
					case 'post_types-': /* 'post_types-' . $pt->name . '-not_in_sitemap' fields */
					case 'taxonomies-': /* 'taxonomies-' . $tax->name . '-not_in_sitemap' fields */
					case 'enablexmlsitemap':
					case 'disable_author_sitemap':
					case 'xml_ping_yahoo':
					case 'xml_ping_ask':
					default:
						$clean[$k] = ( isset( $options[$k] ) ? self::validate_bool( $options[$k] ) : false );
						break;
				}
			}
			
   			$clean = self::retain_variable_keys( $option_key, $options, $clean );
			return $clean;
		}


		/**
		 * @param $options
		 *
		 * @return mixed
		 */
		public static function validate_wpseo_social( $options ) {
			$option_key = 'wpseo_social';

			self::remove_default_filters( $option_key );

			/* Don't change anything if user does not have the required capability */
			if ( false === is_admin() || false === current_user_can( 'manage_options' ) ) {
				return get_option( $option_key );
			}

			$clean   = self::get_defaults( $option_key );
			$old     = get_option( $option_key );
			$options = array_map( array( __CLASS__, 'trim_recursive' ), $options );


			foreach ( $clean as $k => $v ) {
				switch ( $k ) {
					/* Automagic Facebook connect key */
					case 'fbconnectkey':
						$clean[$k] = self::get_fbconnectkey();
						break;

					/* Will not always exist in form */
					case 'fb_admins':
						if ( isset( $options[$k] ) && ( is_array( $options[$k] ) && $options[$k] !== array() ) ) {
							foreach ( $options[$k] as $user_id => $fb_array ) {
								// @todo add user_id validation - are these WP user-ids or FB user-ids ?
								if ( is_array( $fb_array ) && $fb_array !== array() ) {
									foreach ( $fb_array as $key => $value ) {
										switch ( $key ) {
											case 'name':
											// @todo add validation for name
											//$_GET['userrealname']
												$clean[$k][$user_id][$key] = $value;
												break;

											case 'link':
											// @todo check validation for link
											//$_GET['link']
												$clean[$k][$user_id][$key] = esc_url_raw( $value, array( 'http', 'https' ) );
												break;
										}
									}
								}
							}
						}
						else if( isset( $old[$k] ) ) {
							$clean[$k] = $old[$k];
						}
						break;
						
					/* Will not always exist in form */
					case 'fb_apps':
						if ( isset( $options[$k] ) && ( is_array( $options[$k] ) && $options[$k] !== array() ) ) {
							foreach ( $options[$k] as $app_id => $display_name ) {
								// @todo add app_id validation $app->app_id
								// @todo add display_name validation $app->display_name
								$clean[$k][$app_id] = sanitize_text_field( $display_name );
							}
						}
						else if( isset( $old[$k] ) ) {
							$clean[$k] = $old[$k];
						}
						break;

					/* Will not always exist in form - if not available it means that fb_apps is empty, so leave the clean default */
					case 'fbadminapp':
						if ( ( isset( $options[$k] ) && $options[$k] != 0 ) && ( isset( $clean['fb_apps'][$options[$k]] ) || isset( $old['fb_apps'][$options[$k]] ) ) ) {
							$clean[$k] = $options[$k];
						}
						break;


					/* text fields */
					case 'og_frontpage_desc':
						if ( isset( $options[$k] ) && $options[$k] !== '' ) {
							$clean[$k] = sanitize_text_field( $options[$k] );
						}
						break;

					/* url text fields - ftp allowed */
					case 'og_frontpage_image':
					case 'og_default_image':
						if ( isset( $options[$k] ) && $options[$k] !== '' ) {
							$url = esc_url_raw( $options[$k], array( 'http', 'https', 'ftp', 'ftps' ) );
							if ( $url !== '' ) {
								$clean[$k] = $url;
							}
							else {
								add_settings_error(
									WPSEO_Options::$options['wpseo_social']['group'], // slug title of the setting
									'_' . $k, // suffix-id for the error message box
									sprintf( __( '%s does not seem to be a valid url. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( sanitize_text_field( $options[$k] ) ) . '</strong>' ), // the error message
									'error' // error type, either 'error' or 'updated'
								);
							}
						}
						break;
						
					/* url text fields - no ftp allowed */
					case 'facebook_site':
					case 'plus-publisher':
						if ( isset( $options[$k] ) && $options[$k] !== '' ) {
							$url = esc_url_raw( $options[$k], array( 'http', 'https' ) );
							if ( $url !== '' ) {
								$clean[$k] = $url;
							}
							else {
								add_settings_error(
									WPSEO_Options::$options['wpseo_social']['group'], // slug title of the setting
									'_' . $k, // suffix-id for the error message box
									sprintf( __( '%s does not seem to be a valid url. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( sanitize_text_field( $options[$k] ) ) . '</strong>' ), // the error message
									'error' // error type, either 'error' or 'updated'
								);
							}
						}
						break;

					/* twitter user name */
					case 'twitter_site':
						if ( isset( $options[$k] ) && $options[$k] !== '' ) {
							$twitter_id = sanitize_text_field( ltrim( $options[$k], '@' ) );
							/**
							 * From the Twitter documentation about twitter screen names:
							 * Typically a maximum of 15 characters long, but some historical accounts
							 * may exist with longer names.
							 */
							if ( preg_match( '`^[A-Za-z0-9_]{1,25}$`', $twitter_id ) !== false ) {
								$clean[$k] = $twitter_id;
							}
							else {
								add_settings_error(
									WPSEO_Options::$options['wpseo_social']['group'], // slug title of the setting
									'_' . $k, // suffix-id for the error message box
									sprintf( __( '%s does not seem to be a valid Twitter user-id. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( sanitize_text_field( $options[$k] ) ) . '</strong>' ), // the error message
									'error' // error type, either 'error' or 'updated'
								);
							}
							unset( $twitter_id );
						}
						break;


					/* WP user id */
					case 'plus-author':
						if ( isset( $options[$k] ) && ( $options[$k] !== '' && $options[$k] != -1 ) ) {
							$int = self::validate_int( $options[$k] );
							if ( ( $int !== false && $int > 0 ) && get_user_by( 'id', $int ) !== false ) {
								$clean[$k] = $int;
							}
							else {
								// Unlikely to ever happen in a normal situation (only when user was deleted between when the page was loaded and the settings were saved), but still
								add_settings_error(
									WPSEO_Options::$options['wpseo_social']['group'], // slug title of the setting
									'_' . $k, // suffix-id for the error message box
									__( 'Invalid user selected for Google+ Homepage author. Please correct.', 'wordpress-seo' ), // the error message
									'error' // error type, either 'error' or 'updated'
								);
							}
							unset( $int );
						}
						break;

					/* boolean fields */
					case 'opengraph':
					case 'twitter':
					default:
						$clean[$k] = ( isset( $options[$k] ) ? self::validate_bool( $options[$k] ) : false );
						break;
				}
			}
			
   			$clean = self::retain_variable_keys( $option_key, $options, $clean );
			return $clean;
		}


		/**
		 * @param $options
		 *
		 * @return mixed
		 */
		public static function validate_wpseo_ms( $options ) {
			$option_key = 'wpseo_ms';

			self::remove_default_filters( $option_key );

			/* Don't change anything if user does not have the required capability */
			if ( false === is_admin() || false === current_user_can( 'manage_options' ) ) {
				return get_option( $option_key );
			}

			$clean   = self::get_defaults( $option_key );
			$old     = get_option( $option_key );
			$options = array_map( array( __CLASS__, 'trim_recursive' ), $options );
			
			$allowed_access = array( 'admin', 'superadmin' );

			foreach ( $clean as $k => $v ) {
				switch ( $k ) {
					case 'access':
						if ( isset( $options[$k] ) && in_array( $options[$k], $allowed_access, true ) === true ) {
							$clean[$k] = $options[$k];
						}
						else {
							add_settings_error(
								WPSEO_Options::$options['wpseo_ms']['group'], // slug title of the setting
								'_' . $k, // suffix-id for the error message box
								sprintf( __( '%s is not a valid choice for who should be allowed access to the WP SEO settings. Value reset to the default.', 'wordpress-seo' ), esc_html( sanitize_text_field( $options[$k] ) ) ), // the error message
								'error' // error type, either 'error' or 'updated'
							);
						}
						break;
						
					case 'defaultblog':
						if ( isset( $options[$k] ) && $options[$k] !== '' ) {
							$int = self::validate_int( $options[$k] );
							if ( $int !== false && $int > 0 ) {
								// Check if a valid blog number has been received
								$exists = get_blog_details( $int, false );
								// @todo - check what values get_blog_status() returns and improve the validation
								if ( $exists && get_blog_status( $int, 'deleted' ) == false ) {
									$clean[$k] = $int;
								}
								else {
									add_settings_error(
										WPSEO_Options::$options['wpseo_ms']['group'], // slug title of the setting
										'_' . $k, // suffix-id for the error message box
										__( 'The default blog setting must be the numeric blog id of the blog you want to use as default.', 'wordpress-seo' ) . '<br>' . sprintf( __( 'This must be an existing blog. Blog %s does not exist or has been marked as deleted.', 'wordpress-seo' ), '<strong>' . esc_html( sanitize_text_field( $options[$k] ) ) . '</strong>' ), // the error message
										'error' // error type, either 'error' or 'updated'
									);
								}
								unset( $exists );
							}
							else {
								add_settings_error(
									WPSEO_Options::$options['wpseo_ms']['group'], // slug title of the setting
									'_' . $k, // suffix-id for the error message box
									__( 'The default blog setting must be the numeric blog id of the blog you want to use as default.', 'wordpress-seo' ) . '<br>' . __( 'No numeric value was received.', 'wordpress-seo' ), // the error message
									'error' // error type, either 'error' or 'updated'
								);
							}
							unset( $int );
						}
						break;

					default:
						$clean[$k] = ( isset( $options[$k] ) ? self::validate_bool( $options[$k] ) : false );
						break;
				}
			}

			$clean = self::retain_variable_keys( $option_key, $options, $clean );
			return $clean;
		}


		/**
		 * Validate a value as boolean
		 *
		 * @param	mixed	$value
		 * @return	bool
		 */
		public static function validate_bool( $value ) {
			return filter_var( $value, FILTER_VALIDATE_BOOLEAN );
		}


		/**
		 * Validate a value as integer
		 *
		 * @param	mixed	$value
		 * @return	mixed	int or false in case or failure to convert to int
		 */
		public static function validate_int( $value ) {
			return filter_var( $value, FILTER_VALIDATE_INT );
		}


		/**
		 * @return string
		 */
		public static function get_fbconnectkey(){
			return md5( get_bloginfo( 'url' ) . rand() );
		}


		/**
		 * Trim whitespace round a value
		 *
		 * @param   mixed   $value  Value to trim or array of values to trim
		 * @return  mixed   Trimmed value or array of trimmed values
		 */
		public static function trim_recursive( $value ) {
			if ( !is_array( $value ) && !is_object( $value ) ) {
				$value = trim( $value );
			}
			else if ( is_array( $value ) ) {
				$value = array_map( array( __CLASS__, 'trim_recursive' ), $value );
			}
			return $value;
		}



		/**
		 * Retrieve an array of all the options the plugin uses.
		 *
		 * @static
		 * @return array of option names.
		 */
		public static function get_option_names() {
			static $option_names = array();
			
			if ( $option_names === array() ) {
				foreach ( self::$options as $option_name => $directives ) {
					if ( $directives['include_in_all'] === true ) {
						$option_names[] = $option_name;
					}
				}
				$option_names = apply_filters( 'wpseo_options', $option_names );
			}
			return $option_names;
		}


		/**
		 * Retrieve all the options for the SEO plugin in one go.
		 *
		 * @static
		 * @return array of options
		 */
		public static function get_all() {

			if ( !isset( self::$wpseo_options ) ) {
				self::$wpseo_options = array();
				foreach ( self::get_option_names() as $option_name ) {
					self::$wpseo_options = array_merge( self::$wpseo_options, (array) get_option( $option_name ) );
				}
			}

			return self::$wpseo_options;
		}


		/**
		 * Initialize default values for a new multisite blog
		 * @static
		 */
		public static function set_multisite_defaults() {
			$option = get_option( 'wpseo' );
	
			if ( function_exists( 'is_multisite' ) && is_multisite() && $option['ms_defaults_set'] === false ) {
				$current_site = get_current_site();
				self::reset_ms_blog( $current_site->id );
	
				$option['ms_defaults_set'] = true;
				update_option( 'wpseo', $option );
			}
		}


		/**
		 * Reset all options to their default values
		 * @todo add check for multisite and only add multisite option if applicable - currently will not add it
		 * @todo may be check for default blog option if multisite and restore based on that if available ?
		 */
		public static function reset() {
			//@todo - better: may be make sure it's just not called before the init hook ;-)
			self::register_settings(); // Make sure that the validation routines are registered even if this function is called before the init hook
			foreach ( self::get_option_names() as $key => $directives ) {
				delete_option( $key );
				update_option( $key, get_option( $key ) );
			}
		}

		/**
		 * Reset all options for a specific multisite blog to their default values based upon a specified default blog
		 */
		public static function reset_ms_blog( $blog_id ) {
			//@todo - better: may be make sure it's just not called before the admin_init hook ;-)
			self::register_settings(); // Make sure that the validation routines are registered even if this function is called before the admin_init hook
			$options = get_site_option( 'wpseo_ms' );

			if ( $options['defaultblog'] !== '' && $options['defaultblog'] != 0 ) {
				// Reset based upon a default blog
				// @todo - should social options also be copied over ? things like facebook admin ids and such are privacy sensitive, probably should be excluded
				foreach ( self::get_option_names() as $key => $directives ) {
					delete_blog_option( $blog_id, $key );
					update_blog_option( $blog_id, $key, get_blog_option( $options['defaultblog'], $key ) );
				}
			}
			else {
				// Reset based upon the plugin defaults
				foreach ( self::get_option_names() as $key => $directives ) {
					delete_blog_option( $blog_id, $key );
					update_blog_option( $blog_id, $key, get_blog_option( $blog_id, $key ) );
				}
			}
		}



		/**
		 * Re-save all options using the validation routines
		 * - Removes redundant (old) options
		 * - Removes lingering options which may be in the wrong option key
		 * - Makes sure that all options are set using default values if no valid value is found
		 *
		 * @todo check whether the settings_errors can be displayed if this is called from upgrade and if not, figure out a way to show them anyway
		 */
		public static function clean_up() {

			//@todo - better: may be make sure it's just not called before the admin_init hook ;-)
			self::register_settings(); // Make sure that the validation routines are registered even if this function is called before the admin_init hook -


			foreach ( self::$options as $option_key => $directives ) {
				$settings = get_option( $option_key );


				if ( $option_key === 'wpseo' ) {
					// Deal with renaming of some options without losing the settings
					if ( isset( $settings['tracking_popup'] ) ) {
						$settings['tracking_popup_done'] = $settings['tracking_popup'];
					}
	
					if ( isset( $settings['theme_check'] ) && isset( $settings['theme_check']['description'] ) ) {
						$settings['theme_has_description'] = ! $settings['theme_check']['description'];
					}
					if ( isset( $settings['theme_check'] ) && isset( $settings['theme_check']['description_found'] ) ) {
						$settings['theme_description_found'] = $settings['theme_check']['description_found'];
					}

					// Deal with value change from text string to boolean
					$value_change = array(
						'ignore_blog_public_warning',
						'ignore_meta_description_warning',
						'ignore_tour',
						'ignore_page_comments',
						'ignore_permalink',
						'tracking_popup_done',
//						'disableadvanced_meta', ?
					);

					foreach ( $value_change as $sub_option_key ) {
						if ( isset( $settings[$sub_option_key] ) && in_array( $settings[$sub_option_key], array( 'ignore', 'done' ) ) === true ) {
							$settings[$sub_option_key] = true;
						}
					}
					unset( $sub_option_key, $value_change );
				}
				


				if ( $option_key === 'wpseo_titles' ) {
					/* Renaming these options to avoid ever overwritting these if a (bloody stupid) user
					   would use any of the following as a custom post type or custom taxonomy:
					   'home', 'author', 'archive', 'search', '404', 'subpages'
	
					   Similarly, renaming the tax options to avoid a custom post type and a taxonomy
					   with the same name occupying the same option */

					$rename = array(
						'title-home'		=> 'title-home-wpseo',
						'title-author'		=> 'title-author-wpseo',
						'title-archive'		=> 'title-archive-wpseo',
						'title-search'		=> 'title-search-wpseo',
						'title-404'			=> 'title-404-wpseo',
						'metadesc-home'		=> 'metadesc-home-wpseo',
						'metadesc-author'	=> 'metadesc-author-wpseo',
						'metadesc-archive'	=> 'metadesc-archive-wpseo',
						'metakey-home'		=> 'metakey-home-wpseo',
						'metakey-author'	=> 'metakey-author-wpseo',
						'noindex-subpages'	=> 'noindex-subpages-wpseo',
						'noindex-author'	=> 'noindex-author-wpseo',
						'noindex-archive'	=> 'noindex-archive-wpseo',
					);
					foreach ( $rename as $old => $new ) {
						if ( isset( $settings[$old] ) ) {
							$settings[$new] = $settings[$old];
							unset( $settings[$old] );
						}
					}
					unset( $old, $new );


					$rename = array(
						'title-'			=> 'title-tax-',
						'metadesc-'			=> 'metadesc-tax-',
						'metakey-'			=> 'metakey-tax-',
						'noindex-'			=> 'noindex-tax-',
						'tax-hideeditbox-'	=> 'hideeditbox-tax-',

					);

					$taxonomy_names  = get_taxonomies( array( 'public' => true ), 'names' );
					$post_type_names = get_post_types( array( 'public' => true ), 'names' );
					if ( $taxonomy_names !== array() ) {
						foreach ( $taxonomy_names as $tax ) {
							foreach ( $rename as $old_prefix => $new_prefix ) {
								if ( isset( $settings[$old_prefix . $tax] ) ) {
									$settings[$new_prefix . $tax] = $settings[$old_prefix . $tax];

									/* Check if there is a cpt with the same name as the tax,
									   if so, we shouldn't remove the old setting */
									if ( ! isset( $post_type_names[$tax] ) ) {
										unset( $settings[$old_prefix . $tax] );
									}
								}
							}
							unset( $old_prefix, $new_prefix );
						}
						unset( $tax );
					}
					unset( $taxonomy_names, $post_type_names );
					
					unset( $rename );
					
					
					
					/* Make sure the values of the variable option key options are cleaned as they
				 	   may be retained and would not be cleaned/validated then */
					foreach ( $settings as $sub_option_key => $value ) {
						$switch_key = $sub_option_key;
		
						foreach ( self::$variable_option_name_patterns[$option_key] as $pattern ) {
							if ( strpos( $sub_option_key, $pattern ) === 0 ) {
								$switch_key = $pattern;
							}
						}
						unset( $pattern );
		
						// Similar to validation routine - any changes made there should be made here too
						switch ( $switch_key ) {
							/* text fields */
							case 'title-':
							case 'metadesc-':
							case 'metakey-':
							case 'bctitle-ptarchive-':
								$settings[$sub_option_key] = sanitize_text_field( $value );
								break;

		
							/* boolean fields */
							// new = bool
							// old = ? needs checking
							case 'noindex-':
							case 'noauthorship-':
							case 'showdate-':
							case 'hideeditbox-':
							default:
								$settings[$sub_option_key] = self::validate_bool( $value );
								break;
						}
					}
				}


				if ( $option_key === 'wpseo_internallinks' ) {
					
					// Validate old values for 'post_types-' and 'taxonomy-' fields
					// Default should be int 0
					// @todo How to deal with possibility of not all post_types / taxonomies being registered at the
					// time this upgrade is run ?
					
					/* 'post_types-' . $pt->name . '-maintax' fields */
/*					case 'post_types-':
						$post_type  = str_replace( 'post_types-', '', $k );
						$post_type  = str_replace( '-maintax', '', $post_type );
						$taxonomies = get_object_taxonomies( $post_type, 'names' );
						if ( isset( $options[$k] ) && ( in_array( $options[$k], $taxonomies, true ) === true || $options[$k] == 0 ) ) {
							$clean[$k] = $options[$k];
						}
						else {
							// @todo maybe change the untranslated $pt name in the error message to the nicely translated label ?
							add_settings_error(
								WPSEO_Options::$options['wpseo_internallinks']['group'], // slug title of the setting
								'_' . $k, // suffix-id for the error message box
								sprintf( __( 'Please select a valid taxonomy for post type "%s"', 'wordpress-seo' ), $post_type ), // the error message
								'error' // error type, either 'error' or 'updated'
							);
						}
						unset( $taxonomies, $post_type );
						break;

					/* 'taxonomy-' . $tax->name . '-ptparent' fields */
/*					case 'taxonomy-':
						if ( isset( $options[$k] ) && ( in_array( $options[$k], $allowed_post_types, true ) === true || $options[$k] == 0 ) ) {
							$clean[$k] = $options[$k];
						}
						else {
							// @todo maybe change the untranslated $tax name in the error message to the nicely translated label ?
							$tax = str_replace( 'taxonomy-', '', $k );
							$tax = str_replace( '-ptparent', '', $tax );
							add_settings_error(
								WPSEO_Options::$options['wpseo_internallinks']['group'], // slug title of the setting
								'_' . $tax, // suffix-id for the error message box
								sprintf( __( 'Please select a valid post type for taxonomy "%s"', 'wordpress-seo' ), $tax ), // the error message
								'error' // error type, either 'error' or 'updated'
							);
							unset( $tax );
						}
						break;*/
				}


				if ( $option_key === 'wpseo_xml' ) {
					
					foreach ( $settings as $sub_option_key => $value ) {
						if ( strpos( $sub_option_key, 'post_types-' ) === 0 || strpos( $sub_option_key, 'taxonomies-' ) === 0 ) {
							// Check for old value type and change to new value type
							// new = bool
							// old = ? needs checking
							$settings[$sub_option_key] = self::validate_bool( $value );
						}
					}
				}



				update_option( $option_key, $settings );
			}
		}


		
		
/* FROM: wordpress-seo\inc\wpseo-non-ajax-functions.php
/**
 * Set the default settings.
 *
 * This uses the currently available custom post types and taxonomies.
 * /
function wpseo_defaults() {
	$options = get_option( 'wpseo' );
	if ( ! is_array( $options ) ) {
		$opt = array(
			'disableadvanced_meta' => 'on',
			'version'              => WPSEO_VERSION,
		);
		update_option( 'wpseo', $opt );

		// Test theme on activate
		wpseo_description_test();
	}
	else {
		// Re-check theme on re-activate
		wpseo_description_test();
		return;
	}

	if ( ! is_array( get_option( 'wpseo_titles' ) ) ) {
		$opt = array(
			'title-home-wpseo'          => '%%sitename%% %%page%% %%sep%% %%sitedesc%%',
			'title-author-wpseo'        => sprintf( __( '%s, Author at %s', 'wordpress-seo' ), '%%name%%', '%%sitename%%' ) . ' %%page%% ',
			'title-archive-wpseo'       => '%%date%% %%page%% %%sep%% %%sitename%%',
			'title-search-wpseo'        => sprintf( __( 'You searched for %s', 'wordpress-seo' ), '%%searchphrase%%' ) . ' %%page%% %%sep%% %%sitename%%',
			'title-404-wpseo'           => __( 'Page Not Found', 'wordpress-seo' ) . ' %%sep%% %%sitename%%',
			'noindex-archive-wpseo'     => 'on',
			'noindex-tax-post_format' => 'on',
		);
		foreach ( get_post_types( array( 'public' => true ), 'objects' ) as $pt ) {
			$opt['title-' . $pt->name] = '%%title%% %%page%% %%sep%% %%sitename%%';
			if ( $pt->has_archive )
				$opt['title-ptarchive-' . $pt->name] = sprintf( __( '%s Archive', 'wordpress-seo' ), '%%pt_plural%%' ) . ' %%page%% %%sep%% %%sitename%%';
		}
		foreach ( get_taxonomies( array( 'public' => true ) ) as $tax ) {
			$opt['title-tax-' . $tax] = sprintf( __( '%s Archives', 'wordpress-seo' ), '%%term_title%%' ) . ' %%page%% %%sep%% %%sitename%%';
		}
		update_option( 'wpseo_titles', $opt );

		wpseo_title_test();
	}

	if ( ! is_array( get_option( 'wpseo_xml' ) ) ) {
		$opt = array(
			'enablexmlsitemap'                     => 'on',
			'post_types-attachment-not_in_sitemap' => true
		);
		update_option( 'wpseo_xml', $opt );
	}

	if ( ! is_array( get_option( 'wpseo_social' ) ) ) {
		$opt = array(
			'opengraph' => 'on',
		);
		update_option( 'wpseo_social', $opt );
	}

	if ( ! is_array( get_option( 'wpseo_rss' ) ) ) {
		$opt = array(
			'rssafter' => sprintf( __( 'The post %s appeared first on %s.', 'wordpress-seo' ), '%%POSTLINK%%', '%%BLOGLINK%%' ),
		);
		update_option( 'wpseo_rss', $opt );
	}

	if ( ! is_array( get_option( 'wpseo_permalinks' ) ) ) {
		$opt = array(
			'cleanslugs' => 'on',
		);
		update_option( 'wpseo_permalinks', $opt );
	}
	// Force WooThemes to use WordPress SEO data.
	if ( function_exists( 'woo_version_init' ) ) {
		update_option( 'seo_woo_use_third_party_data', 'true' );
	}

}


	function multisite_defaults() {
		$option = get_option( 'wpseo' );
		if ( function_exists( 'is_multisite' ) && is_multisite() && ! is_array( $option ) ) {
			$options = get_site_option( 'wpseo_ms' );
			if ( is_array( $options ) && isset( $options['defaultblog'] ) && ! empty( $options['defaultblog'] ) && $options['defaultblog'] != 0 ) {
				foreach ( WPSEO_Options::get_option_names() as $wpseo_option ) {
					update_option( $wpseo_option, get_blog_option( $options['defaultblog'], $wpseo_option ) );
				}
			}
			$option['ms_defaults_set'] = true;
			update_option( 'wpseo', $option );
		}
	}
*/
	}
	WPSEO_Options::init();
}