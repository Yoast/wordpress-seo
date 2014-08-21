<?php
/**
 * @package Internals
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


/**
 * Run the upgrade procedures.
 *
 * @todo - [JRF => Yoast] check: if upgrade is run on multi-site installation, upgrade for all sites ?
 * Maybe not necessary as it is now run on plugins_loaded, so upgrade will run as soon as any page
 * on a site is requested.
 */
function wpseo_do_upgrade() {
	/* Make sure title_test and description_test functions are available */
	require_once( WPSEO_PATH . 'inc/wpseo-non-ajax-functions.php' );

	$option_wpseo = get_option( 'wpseo' );

	WPSEO_Options::maybe_set_multisite_defaults( false );

//	if ( $option_wpseo['version'] === '' || version_compare( $option_wpseo['version'], '1.2', '<' ) ) {
//		add_action( 'init', 'wpseo_title_test' );
//	}

	if ( $option_wpseo['version'] === '' || version_compare( $option_wpseo['version'], '1.4.13', '<' ) ) {
		// Run description test once theme has loaded
		add_action( 'init', 'wpseo_description_test' );
	}

	if ( $option_wpseo['version'] === '' || version_compare( $option_wpseo['version'], '1.4.15', '<' ) ) {
		add_action( 'shutdown', 'flush_rewrite_rules' );
	}

	if ( version_compare( $option_wpseo['version'], '1.5.0', '<' ) ) {

		// Clean up options and meta
		WPSEO_Options::clean_up( null, $option_wpseo['version'] );
		WPSEO_Meta::clean_up();

		// Add new capabilities on upgrade
		wpseo_add_capabilities();
	}

	/* Only correct the breadcrumb defaults for upgrades from v1.5+ to v1.5.2.3, upgrades from earlier version
	   will already get this functionality in the clean_up routine. */
	if ( version_compare( $option_wpseo['version'], '1.4.25', '>' ) && version_compare( $option_wpseo['version'], '1.5.2.3', '<' ) ) {
		add_action( 'init', array( 'WPSEO_Options', 'bring_back_breadcrumb_defaults' ), 3 );
	}

	if ( version_compare( $option_wpseo['version'], '1.4.25', '>' ) && version_compare( $option_wpseo['version'], '1.5.2.4', '<' ) ) {
		/* Make sure empty maintax/mainpt strings will convert to 0 */
		WPSEO_Options::clean_up( 'wpseo_internallinks', $option_wpseo['version'] );

		/* Remove slashes from taxonomy meta texts */
		WPSEO_Options::clean_up( 'wpseo_taxonomy_meta', $option_wpseo['version'] );
	}

	/* Clean up stray wpseo_ms options from the options table, option should only exist in the sitemeta table */
	delete_option( 'wpseo_ms' );


	// Make sure version nr gets updated for any version without specific upgrades
	$option_wpseo = get_option( 'wpseo' ); // re-get to make sure we have the latest version
	if ( version_compare( $option_wpseo['version'], WPSEO_VERSION, '<' ) ) {
		update_option( 'wpseo', $option_wpseo );
	}

	// Make sure all our options always exist - issue #1245
	WPSEO_Options::ensure_options_exist();
}


if ( ! function_exists( 'initialize_wpseo_front' ) ) {
	function initialize_wpseo_front() {
		$GLOBALS['wpseo_front'] = new WPSEO_Frontend;
	}
}


if ( ! function_exists( 'yoast_breadcrumb' ) ) {
	/**
	 * Template tag for breadcrumbs.
	 *
	 * @todo [JRF => Yoast/whomever] We could probably get rid of the 'breadcrumbs-enable' option key
	 * as the file is now only loaded when the template tag is encountered anyway.
	 * Only issue with that would be the removal of the bbPress crumb from within wpseo_frontend_init()
	 * in wpseo.php which is also based on this setting.
	 * Whether or not to show the bctitle field within meta boxes is also based on this setting, but
	 * showing these when someone hasn't implemented the template tag shouldn't really give cause for concern.
	 * Other than that, leaving the setting is an easy way to enable/disable the bc without having to
	 * edit the template files again, but having to manually enable when you've added the template tag
	 * in your theme is kind of double, so I'm undecided about what to do.
	 * I guess I'm leaning towards removing the option key.
	 *
	 * @param string $before  What to show before the breadcrumb.
	 * @param string $after   What to show after the breadcrumb.
	 * @param bool   $display Whether to display the breadcrumb (true) or return it (false).
	 *
	 * @return string
	 */
	function yoast_breadcrumb( $before = '', $after = '', $display = true ) {
		$options = get_option( 'wpseo_internallinks' );

		if ( $options['breadcrumbs-enable'] === true ) {
			return WPSEO_Breadcrumbs::breadcrumb( $before, $after, $display );
		}
	}
}

/**
 * Add the bulk edit capability to the proper default roles.
 */
function wpseo_add_capabilities() {
	$roles = array(
		'administrator',
		'editor',
		'author',
	);

	$roles = apply_filters( 'wpseo_bulk_edit_roles', $roles );

	foreach ( $roles as $role ) {
		$r = get_role( $role );
		if ( $r ) {
			$r->add_cap( 'wpseo_bulk_edit' );
		}
	}
}


/**
 * Remove the bulk edit capability from the proper default roles.
 *
 * Contributor is still removed for legacy reasons.
 */
function wpseo_remove_capabilities() {
	$roles = array(
		'administrator',
		'editor',
		'author',
		'contributor',
	);

	$roles = apply_filters( 'wpseo_bulk_edit_roles', $roles );

	foreach ( $roles as $role ) {
		$r = get_role( $role );
		if ( $r ) {
			$r->remove_cap( 'wpseo_bulk_edit' );
		}
	}
}


/**
 * Replace `%%variable_placeholders%%` with their real value based on the current requested page/post/cpt
 *
 * @param string $string the string to replace the variables in.
 * @param object $args   the object some of the replacement values might come from, could be a post, taxonomy or term.
 * @param array  $omit   variables that should not be replaced by this function.
 * @return string
 */
function wpseo_replace_vars( $string, $args, $omit = array() ) {
	$replacer = new WPSEO_Replace_Vars;
	return $replacer->replace( $string, $args, $omit );
}

/**
 * Register a new variable replacement
 *
 * This function is for use by other plugins/themes to easily add their own additional variables to replace.
 * This function should be called from a function on the 'wpseo_register_extra_replacements' action hook.
 * The use of this function is preferred over the older 'wpseo_replacements' filter as a way to add new replacements.
 * The 'wpseo_replacements' filter should still be used to adjust standard WPSEO replacement values.
 * The function can not be used to replace standard WPSEO replacement value functions and will thrown a warning
 * if you accidently try.
 * To avoid conflicts with variables registered by WPSEO and other themes/plugins, try and make the
 * name of your variable unique. Variable names also can not start with "%%cf_" or "%%ct_" as these are reserved
 * for the standard WPSEO variable variables 'cf_<custom-field-name>', 'ct_<custom-tax-name>' and
 * 'ct_desc_<custom-tax-name>'.
 * The replacement function will be passed the undelimited name (i.e. stripped of the %%) of the variable
 * to replace in case you need it.
 *
 * Example code:
 * <code>
 * <?php
 * function retrieve_var1_replacement( $var1 ) {
 *		return 'your replacement value';
 * }
 *
 * function register_my_plugin_extra_replacements() {
 *		wpseo_register_var_replacement( '%%myvar1%%', 'retrieve_var1_replacement', 'advanced', 'this is a help text for myvar1' );
 *		wpseo_register_var_replacement( 'myvar2', array( 'class', 'method_name' ), 'basic', 'this is a help text for myvar2' );
 * }
 * add_action( 'wpseo_register_extra_replacements', 'register_my_plugin_extra_replacements' );
 * ?>
 * </code>
 *
 * @since 1.5.4
 *
 * @param  string   $var               The name of the variable to replace, i.e. '%%var%%'
 *                                      - the surrounding %% are optional, name can only contain [A-Za-z0-9_-]
 * @param  mixed    $replace_function  Function or method to call to retrieve the replacement value for the variable
 *					                   Uses the same format as add_filter/add_action function parameter and
 *					                   should *return* the replacement value. DON'T echo it!
 * @param  string   $type              Type of variable: 'basic' or 'advanced', defaults to 'advanced'
 * @param  string   $help_text         Help text to be added to the help tab for this variable
 * @return bool     Whether the replacement function was succesfully registered
 */
function wpseo_register_var_replacement( $var, $replace_function, $type = 'advanced', $help_text = '' ) {
	return WPSEO_Replace_Vars::register_replacement( $var, $replace_function, $type, $help_text );
}

/**
 * Strip out the shortcodes with a filthy regex, because people don't properly register their shortcodes.
 *
 * @param string $text input string that might contain shortcodes
 * @return string $text string without shortcodes
 */
function wpseo_strip_shortcode( $text ) {
	return preg_replace( '`\[[^\]]+\]`s', '', $text );
}

/**
 * Redirect /sitemap.xml to /sitemap_index.xml
 */
function wpseo_xml_redirect_sitemap() {
	global $wp_query;

	$current_url  = ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] == 'on' ) ? 'https://' : 'http://';
	$current_url .= sanitize_text_field( $_SERVER['SERVER_NAME'] ) . sanitize_text_field( $_SERVER['REQUEST_URI'] );

	// must be 'sitemap.xml' and must be 404
	if ( home_url( '/sitemap.xml' ) == $current_url && $wp_query->is_404 ) {
		wp_redirect( home_url( '/sitemap_index.xml' ) );
		exit;
	}
}

/**
 * Initialize sitemaps. Add sitemap & XSL rewrite rules and query vars
 */
function wpseo_xml_sitemaps_init() {
	$options = get_option( 'wpseo_xml' );
	if ( $options['enablexmlsitemap'] !== true ) {
		return;
	}

	// redirects sitemap.xml to sitemap_index.xml
	add_action( 'template_redirect', 'wpseo_xml_redirect_sitemap', 0 );

	if ( ! is_object( $GLOBALS['wp'] ) ) {
		return;
	}

	$GLOBALS['wp']->add_query_var( 'sitemap' );
	$GLOBALS['wp']->add_query_var( 'sitemap_n' );
	$GLOBALS['wp']->add_query_var( 'xsl' );
	add_rewrite_rule( 'sitemap_index\.xml$', 'index.php?sitemap=1', 'top' );
	add_rewrite_rule( '([^/]+?)-sitemap([0-9]+)?\.xml$', 'index.php?sitemap=$matches[1]&sitemap_n=$matches[2]', 'top' );
	add_rewrite_rule( '([a-z]+)?-?sitemap\.xsl$', 'index.php?xsl=$matches[1]', 'top' );
}

add_action( 'init', 'wpseo_xml_sitemaps_init', 1 );

/**
 * Notify search engines of the updated sitemap.
 */
function wpseo_ping_search_engines( $sitemapurl = null ) {
	// Don't ping if blog is not public
	if ( '0' == get_option( 'blog_public' ) ) {
		return;
	}

	$options = get_option( 'wpseo_xml' );
	$base    = $GLOBALS['wp_rewrite']->using_index_permalinks() ? 'index.php/' : '';
	if ( $sitemapurl == null ) {
		$sitemapurl = urlencode( home_url( $base . 'sitemap_index.xml' ) );
	}

	// Always ping Google and Bing, optionally ping Ask and Yahoo!
	wp_remote_get( 'http://www.google.com/webmasters/tools/ping?sitemap=' . $sitemapurl );
	wp_remote_get( 'http://www.bing.com/ping?sitemap=' . $sitemapurl );

	if ( $options['xml_ping_yahoo'] === true ) {
		wp_remote_get( 'http://search.yahooapis.com/SiteExplorerService/V1/updateNotification?appid=3usdTDLV34HbjQpIBuzMM1UkECFl5KDN7fogidABihmHBfqaebDuZk1vpLDR64I-&url=' . $sitemapurl );
	}

	if ( $options['xml_ping_ask'] === true ) {
		wp_remote_get( 'http://submissions.ask.com/ping?sitemap=' . $sitemapurl );
	}
}
add_action( 'wpseo_ping_search_engines', 'wpseo_ping_search_engines' );


function wpseo_store_tracking_response() {
	if ( ! wp_verify_nonce( $_POST['nonce'], 'wpseo_activate_tracking' ) ) {
		die();
	}

	$options                        = get_option( 'wpseo' );
	$options['tracking_popup_done'] = true;

	if ( $_POST['allow_tracking'] == 'yes' ) {
		$options['yoast_tracking'] = true;
	}
	else {
		$options['yoast_tracking'] = false;
	}

	update_option( 'wpseo', $options );
}
add_action( 'wp_ajax_wpseo_allow_tracking', 'wpseo_store_tracking_response' );

/**
 * WPML plugin support: Set titles for custom types / taxonomies as translatable.
 * It adds new keys to a wpml-config.xml file for a custom post type title, metadesc, title-ptarchive and metadesc-ptarchive fields translation.
 * Documentation: http://wpml.org/documentation/support/language-configuration-files/
 *
 * @global $sitepress
 * @param array $config
 * @return array
 */
function wpseo_wpml_config( $config ) {
	global $sitepress;

	if ( ( is_array( $config ) && isset( $config['wpml-config']['admin-texts']['key'] ) ) && ( is_array( $config['wpml-config']['admin-texts']['key'] ) && $config['wpml-config']['admin-texts']['key'] !== array() ) ) {
		$admin_texts = $config['wpml-config']['admin-texts']['key'];
		foreach ( $admin_texts as $k => $val ) {
			if ( $val['attr']['name'] === 'wpseo_titles' ) {
				$translate_cp = array_keys( $sitepress->get_translatable_documents() );
				if ( is_array( $translate_cp ) && $translate_cp !== array() ) {
					foreach ( $translate_cp as $post_type ) {
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'title-'. $post_type;
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'metadesc-'. $post_type;
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'metakey-'. $post_type;
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'title-ptarchive-'. $post_type;
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'metadesc-ptarchive-'. $post_type;
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'metakey-ptarchive-'. $post_type;

						$translate_tax = $sitepress->get_translatable_taxonomies( false, $post_type );
						if ( is_array( $translate_tax ) && $translate_tax !== array() ) {
							foreach ( $translate_tax as $taxonomy ) {
								$admin_texts[ $k ]['key'][]['attr']['name'] = 'title-tax-'. $taxonomy;
								$admin_texts[ $k ]['key'][]['attr']['name'] = 'metadesc-tax-'. $taxonomy;
								$admin_texts[ $k ]['key'][]['attr']['name'] = 'metakey-tax-'. $taxonomy;
							}
						}
					}
				}
				break;
			}
		}
		$config['wpml-config']['admin-texts']['key'] = $admin_texts;
	}

	return $config;
}
add_filter( 'icl_wpml_config_array', 'wpseo_wpml_config' );


/**
 * Generate an HTML sitemap
 *
 * @param array $atts The attributes passed to the shortcode.
 *
 * @return string
 */
function wpseo_sitemap_handler( $atts ) {

	$atts = shortcode_atts(
		array(
			'authors'  => true,
			'pages'    => true,
			'posts'    => true,
			'archives' => true,
		),
		$atts
	);

	$display_authors  = ( $atts['authors'] === 'no' ) ? false : true;
	$display_pages    = ( $atts['pages'] === 'no' ) ? false : true;
	$display_posts    = ( $atts['posts'] === 'no' ) ? false : true;
	$display_archives = ( $atts['archives'] === 'no' ) ? false : true;

	$options = WPSEO_Options::get_all();

	/* Delete the transient if any of these are no
	   @todo [JRF => whomever] have a good look at this, as this would basically mean that if any of these
	   are no, we'd never use the transient and would always build again from scratch which is very inefficient
	   Suggestion: have several different transients based on the variables chosen
	*/
	if ( $display_authors === false || $display_pages === false || $display_posts === false ) {
		delete_transient( 'html-sitemap' );
	}

	// Get any existing copy of our transient data
	if ( false !== ( $output = get_transient( 'html-sitemap' ) ) ) {
		// $output .= 'CACHE'; // debug
		// return $output;
	}

	$output = '';

	// create author list
	if ( $display_authors ) {
		// use echo => false b/c shortcode format screws up
		$author_list = wp_list_authors(
			array(
				'exclude_admin' => false,
				'echo'          => false,
			)
		);

		if ( $author_list !== '' ) {
			$output .= '
				<h2 id="authors">' . __( 'Authors', 'wordpress-seo' ) . '</h2>
				<ul>
					' . $author_list . '
				</ul>';
		}
	}

	// create page list
	if ( $display_pages ) {
		// Some query magic to retrieve all pages that should be excluded, while preventing noindex pages that are set to
		// "always" include in HTML sitemap from being excluded.
		// @todo [JRF => whomever] check query efficiency using EXPLAIN

		$exclude_query  = "SELECT DISTINCT( post_id ) FROM {$GLOBALS['wpdb']->postmeta}
			WHERE ( ( meta_key = '" . WPSEO_Meta::$meta_prefix . "sitemap-html-include' AND meta_value = 'never' )
			  OR ( meta_key = '" . WPSEO_Meta::$meta_prefix . "meta-robots-noindex' AND meta_value = '1' ) )
			AND post_id NOT IN
				( SELECT pm2.post_id FROM {$GLOBALS['wpdb']->postmeta} pm2
						WHERE pm2.meta_key = '" . WPSEO_Meta::$meta_prefix . "sitemap-html-include' AND pm2.meta_value = 'always')
			ORDER BY post_id ASC";
		$excluded_pages = $GLOBALS['wpdb']->get_results( $exclude_query );

		$exclude = array();
		if ( is_array( $excluded_pages ) && $excluded_pages !== array() ) {
			foreach ( $excluded_pages as $page ) {
				$exclude[] = $page->post_id;
			}
		}
		unset( $excluded_pages, $page );

		/**
		 * This filter allows excluding more pages should you wish to from the HTML sitemap.
		 */
		$exclude = implode( ',', apply_filters( 'wpseo_html_sitemap_page_exclude', $exclude ) );

		$page_list = wp_list_pages(
			array(
				'exclude'  => $exclude,
				'title_li' => '',
				'echo'     => false,
			)
		);

		if ( $page_list !== '' ) {
			$output .= '
				<h2 id="pages">' . __( 'Pages', 'wordpress-seo' ) . '</h2>
				<ul>
					' . $page_list . '
				</ul>';
		}
	}

	// create post list
	if ( $display_posts ) {
		// Add categories you'd like to exclude in the exclude here
		// possibly have this controlled by shortcode params
		$cats_map = '';
		$cats     = get_categories( 'exclude=' );
		if ( is_array( $cats ) && $cats !== array() ) {
			foreach ( $cats as $cat ) {
				$args = array(
					'post_type'      => 'post',
					'post_status'    => 'publish',
					'posts_per_page' => -1,
					'cat'            => $cat->cat_ID,

					'meta_query'     => array(
						'relation' => 'OR',
						// include if this key doesn't exists
						array(
							'key'     => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
							'value'   => 'needs-a-value-anyway', // This is ignored, but is necessary...
							'compare' => 'NOT EXISTS',
						),
						// OR if key does exists include if it is not 1
						array(
							'key'     => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
							'value'   => '1',
							'compare' => '!=',
						),
						// OR this key overrides it
						array(
							'key'     => WPSEO_Meta::$meta_prefix . 'sitemap-html-include',
							'value'   => 'always',
							'compare' => '=',
						),
					),
				);

				$posts = get_posts( $args );

				if ( is_array( $posts ) && $posts !== array() ) {
					$posts_in_cat = '';

					foreach ( $posts as $post ) {
						$category = get_the_category( $post->ID );

						// Only display a post link once, even if it's in multiple categories
						if ( $category[0]->cat_ID == $cat->cat_ID ) {
							$posts_in_cat .= '
							<li><a href="' . esc_url( get_permalink( $post->ID ) ) . '">' . get_the_title( $post->ID ) . '</a></li>';
						}
					}

					if ( $posts_in_cat !== '' ) {
						$cats_map .= '
					<li>
						<h3>' . $cat->cat_name . '</h3>
						<ul>
							' . $posts_in_cat . '
						</ul>
					</li>';
					}
				}
				unset( $posts, $post, $posts_in_cat, $category );
			}
		}

		if ( $cats_map !== '' ) {
			$output .= '
				<h2 id="posts">' . __( 'Posts', 'wordpress-seo' ) . '</h2>
				<ul>
					' . $cats_map . '
				</ul>';
		}
		unset( $cats_map, $cats, $cat, $args );
	}


	// get all public non-builtin post types
	$args       = array(
		'public'   => true,
		'_builtin' => false,
	);
	$post_types = get_post_types( $args, 'object' );

	if ( is_array( $post_types ) && $post_types !== array() ) {

		// create an noindex array of post types and taxonomies
		$noindex = array();
		foreach ( $options as $key => $value ) {
			if ( strpos( $key, 'noindex-' ) === 0 && $value === true ) {
				$noindex[] = $key;
			}
		}

		$archives = '';

		// create custom post type list
		foreach ( $post_types as $post_type ) {
			if ( is_object( $post_type ) && ! in_array( 'noindex-' . $post_type->name, $noindex ) ) {
				$output .= '
				<h2 id="' . $post_type->name . '">' . esc_html( $post_type->label ) . '</h2>
				<ul>
					' . create_type_sitemap_template( $post_type ) . '
				</ul>';
			}

			// create archives list
			if ( $display_archives ) {
				if ( is_object( $post_type ) && $post_type->has_archive && ! in_array( 'noindex-ptarchive-' . $post_type->name, $noindex ) ) {
					$archives .= '<a href="' . esc_url( get_post_type_archive_link( $post_type->name ) ) . '">' . esc_html( $post_type->labels->name ) . '</a>';

					$archives .= create_type_sitemap_template( $post_type );
				}
			}
		}

		if ( $archives !== '' ) {
			$output .= '
			<h2 id="archives">' . __( 'Archives', 'wordpress-seo' ) . '</h2>
			<ul>
				' . $archives .'
			</ul>';
		}
	}

	set_transient( 'html-sitemap', $output, MINUTE_IN_SECONDS );
	return $output;
}

add_shortcode( 'wpseo_sitemap', 'wpseo_sitemap_handler' );


/**
 * @param $post_type
 *
 * @return string
 */
function create_type_sitemap_template( $post_type ) {
	// $output = '<h2 id="' . $post_type->name . '">' . __( $post_type->label, 'wordpress-seo' ) . '</h2><ul>';

	// Get all registered taxonomy of this post type
	$taxs   = get_object_taxonomies( $post_type->name, 'object' );
	$output = '';

	if ( is_array( $taxs ) && $taxs !== array() ) {

		// Build the taxonomy tree
		$walker = new Sitemap_Walker;
		foreach ( $taxs as $key => $tax ) {
			if ( $tax->public !== 1 ) {
				continue;
			}

			$args     = array(
				'post_type' => $post_type->name,
				'tax_query' => array(
					array(
						'taxonomy' => $key,
						'field'    => 'id',
						'terms'    => -1,
						'operator' => 'NOT',
					),
				),
			);
			$query    = new WP_Query( $args );
			$title_li = $query->have_posts() ? $tax->labels->name : '';

			$cats_list = wp_list_categories(
				array(
					'title_li'         => $title_li,
					'echo'             => false,
					'taxonomy'         => $key,
					'show_option_none' => '',
					// 'hierarchical' => 0, // uncomment this for a flat list

					'walker'           => $walker,
					'post_type'        => $post_type->name, // arg used by the Walker class
				)
			);

			if ( $cats_list !== '' ) {
				$output .= $cats_list;
			}
		}

		if ( $output !== '' ) {
			$output .= '<br />';
		}
	}
	return $output;
}


if ( ! function_exists( 'wpseo_calc' ) ) {
	/**
	 * Do simple reliable math calculations without the risk of wrong results
	 * @see http://floating-point-gui.de/
	 * @see the big red warning on http://php.net/language.types.float.php
	 *
	 * In the rare case that the bcmath extension would not be loaded, it will return the normal calculation results
	 *
	 * @since 1.5.0
	 *
	 * @param	mixed   $number1    Scalar (string/int/float/bool)
	 * @param	string	$action		Calculation action to execute. Valid input:
	 *								'+' or 'add' or 'addition',
	 *								'-' or 'sub' or 'subtract',
	 *								'*' or 'mul' or 'multiply',
	 *								'/' or 'div' or 'divide',
	 *								'%' or 'mod' or 'modulus'
	 *								'=' or 'comp' or 'compare'
	 * @param	mixed	$number2    Scalar (string/int/float/bool)
	 * @param	bool	$round		Whether or not to round the result. Defaults to false.
	 *								Will be disregarded for a compare operation
	 * @param	int		$decimals	Decimals for rounding operation. Defaults to 0.
	 * @param	int		$precision	Calculation precision. Defaults to 10.
	 * @return	mixed				Calculation Result or false if either or the numbers isn't scalar or
	 *								an invalid operation was passed
	 *								- for compare the result will always be an integer
	 *								- for all other operations, the result will either be an integer (preferred)
	 *								or a float
	 */
	function wpseo_calc( $number1, $action, $number2, $round = false, $decimals = 0, $precision = 10 ) {
		static $bc;

		if ( ! is_scalar( $number1 ) || ! is_scalar( $number2 ) ) {
			return false;
		}

		if ( ! isset( $bc ) ) {
			$bc = extension_loaded( 'bcmath' );
		}

		if ( $bc ) {
			$number1 = strval( $number1 );
			$number2 = strval( $number2 );
		}

		$result  = null;
		$compare = false;

		switch ( $action ) {
			case '+':
			case 'add':
			case 'addition':
				$result = ( $bc ) ? bcadd( $number1, $number2, $precision ) /* string */ : ( $number1 + $number2 );
				break;

			case '-':
			case 'sub':
			case 'subtract':
				$result = ( $bc ) ? bcsub( $number1, $number2, $precision ) /* string */ : ( $number1 - $number2 );
				break;

			case '*':
			case 'mul':
			case 'multiply':
				$result = ( $bc ) ? bcmul( $number1, $number2, $precision ) /* string */ : ( $number1 * $number2 );
				break;

			case '/':
			case 'div':
			case 'divide':
				if ( $bc ) {
					$result = bcdiv( $number1, $number2, $precision ); // string, or NULL if right_operand is 0
				}
				elseif ( $number2 != 0 ) {
					$result = $number1 / $number2;
				}

				if ( ! isset( $result ) ) {
					$result = 0;
				}
				break;

			case '%':
			case 'mod':
			case 'modulus':
				if ( $bc ) {
					$result = bcmod( $number1, $number2, $precision ); // string, or NULL if modulus is 0.
				}
				elseif ( $number2 != 0 ) {
					$result = $number1 % $number2;
				}

				if ( ! isset( $result ) ) {
					$result = 0;
				}
				break;

			case '=':
			case 'comp':
			case 'compare':
				$compare = true;
				if ( $bc ) {
					$result = bccomp( $number1, $number2, $precision ); // returns int 0, 1 or -1
				}
				else {
					$result = ( $number1 == $number2 ) ? 0 : ( ( $number1 > $number2 ) ? 1 : -1 );
				}
				break;
		}

		if ( isset( $result ) ) {
			if ( $compare === false ) {
				if ( $round === true ) {
					$result = round( floatval( $result ), $decimals );
					if ( $decimals === 0 ) {
						$result = (int) $result;
					}
				}
				else {
					$result = ( intval( $result ) == $result ) ? intval( $result ) : floatval( $result );
				}
			}
			return $result;
		}
		return false;
	}
}

/**
 * Check if the web server is running on Apache
 * @return bool
 */
function wpseo_is_apache() {
	if ( isset( $_SERVER['SERVER_SOFTWARE'] ) && stristr( $_SERVER['SERVER_SOFTWARE'], 'apache' ) !== false ) {
		return true;
	}
	return false;
}

/**
 * Check if the web service is running on Nginx
 *
 * @return bool
 */
function wpseo_is_nginx() {
	if ( isset( $_SERVER['SERVER_SOFTWARE'] ) && stristr( $_SERVER['SERVER_SOFTWARE'], 'nginx' ) !== false ) {
		return true;
	}
	return false;
}

/**
 * WordPress SEO breadcrumb shortcode
 * [wpseo_breadcrumb]
 *
 * @return string
 */
function wpseo_shortcode_yoast_breadcrumb() {
	return yoast_breadcrumb( '', '', false );
}
add_shortcode( 'wpseo_breadcrumb', 'wpseo_shortcode_yoast_breadcrumb' );


/**
 * This invalidates our XML Sitemaps cache.
 *
 * @param $type
 */
function wpseo_invalidate_sitemap_cache( $type ) {
	// Always delete the main index sitemaps cache, as that's always invalidated by any other change
	delete_transient( 'wpseo_sitemap_cache_1' );
	delete_transient( 'wpseo_sitemap_cache_' . $type );
}

add_action( 'deleted_term_relationships', 'wpseo_invalidate_sitemap_cache' );

/**
 * Invalidate XML sitemap cache for taxonomy / term actions
 *
 * @param unsigned $unused
 * @param string $type
 */
function wpseo_invalidate_sitemap_cache_terms( $unused, $type ) {
	wpseo_invalidate_sitemap_cache( $type );
}

add_action( 'edited_terms', 'wpseo_invalidate_sitemap_cache_terms', 10, 2 );
add_action( 'clean_term_cache', 'wpseo_invalidate_sitemap_cache_terms', 10, 2 );
add_action( 'clean_object_term_cache', 'wpseo_invalidate_sitemap_cache_terms', 10, 2 );

/**
 * Invalidate the XML sitemap cache for a post type when publishing or updating a post
 *
 * @param int $post_id
 */
function wpseo_invalidate_sitemap_cache_on_save_post( $post_id ) {

	// If this is just a revision, don't invalidate the sitemap cache yet.
	if ( wp_is_post_revision( $post_id ) ) {
		return;
	}

	wpseo_invalidate_sitemap_cache( get_post_type( $post_id ) );
}

add_action( 'save_post', 'wpseo_invalidate_sitemap_cache_on_save_post' );

/**
 * List all the available user roles
 *
 * @return array $roles
 */
function wpseo_get_roles() {
	global $wp_roles;

	if ( ! isset( $wp_roles ) ) {
		$wp_roles = new WP_Roles();
	}

	$roles = $wp_roles->get_names();

	return $roles;
}

/**
 * Check whether a url is relative
 *
 * @param string $url
 *
 * @return bool
 */
function wpseo_is_url_relative( $url ) {
	return ( strpos( $url, 'http' ) !== 0 && strpos( $url, '//' ) !== 0 );
}

/**
 * Emulate PHP native ctype_digit() function for when the ctype extension would be disabled *sigh*
 * Only emulates the behaviour for when the input is a string, does not handle integer input as ascii value
 *
 * @param	string	$string
 *
 * @return 	bool
 */
if ( ! extension_loaded( 'ctype' ) || ! function_exists( 'ctype_digit' ) ) {
	function ctype_digit( $string ) {
		$return = false;
		if ( ( is_string( $string ) && $string !== '' ) && preg_match( '`^\d+$`', $string ) === 1 ){
			$return = true;
		}
		return $return;
	}
}


/********************** DEPRECATED FUNCTIONS **********************/


/**
 * Get the value from the post custom values
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Meta::get_value()
 * @see WPSEO_Meta::get_value()
 *
 * @param	string	$val	internal name of the value to get
 * @param	int		$postid	post ID of the post to get the value for
 * @return	string
 */
function wpseo_get_value( $val, $postid = 0 ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Meta::get_value()' );
	return WPSEO_Meta::get_value( $val, $postid );
}


/**
 * Save a custom meta value
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Meta::set_value() or just use update_post_meta()
 * @see WPSEO_Meta::set_value()
 *
 * @param	string	$meta_key		the meta to change
 * @param	mixed	$meta_value		the value to set the meta to
 * @param	int		$post_id		the ID of the post to change the meta for.
 * @return	bool	whether the value was changed
 */
function wpseo_set_value( $meta_key, $meta_value, $post_id ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Meta::set_value()' );
	return WPSEO_Meta::set_value( $meta_key, $meta_value, $post_id );
}


/**
 * Retrieve an array of all the options the plugin uses. It can't use only one due to limitations of the options API.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Options::get_option_names()
 * @see WPSEO_Options::get_option_names()
 *
 * @return array of options.
 */
function get_wpseo_options_arr() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::get_option_names()' );
	return WPSEO_Options::get_option_names();
}


/**
 * Retrieve all the options for the SEO plugin in one go.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Options::get_all()
 * @see WPSEO_Options::get_all()
 *
 * @return array of options
 */
function get_wpseo_options() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::get_all()' );
	return WPSEO_Options::get_all();
}

/**
 * Used for imports, both in dashboard and import settings pages, this functions either copies
 * $old_metakey into $new_metakey or just plain replaces $old_metakey with $new_metakey
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Meta::replace_meta()
 * @see WPSEO_Meta::replace_meta()
 *
 * @param string  $old_metakey The old name of the meta value.
 * @param string  $new_metakey The new name of the meta value, usually the WP SEO name.
 * @param bool    $replace     Whether to replace or to copy the values.
 */
function replace_meta( $old_metakey, $new_metakey, $replace = false ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Meta::replace_meta()' );
	WPSEO_Meta::replace_meta( $old_metakey, $new_metakey, $replace );
}


/**
 * Retrieve a taxonomy term's meta value.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Taxonomy_Meta::get_term_meta()
 * @see WPSEO_Taxonomy_Meta::get_term_meta()
 *
 * @param string|object $term     term to get the meta value for
 * @param string        $taxonomy name of the taxonomy to which the term is attached
 * @param string        $meta     meta value to get
 * @return bool|mixed value when the meta exists, false when it does not
 */
function wpseo_get_term_meta( $term, $taxonomy, $meta ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Taxonomy_Meta::get_term_meta' );
	WPSEO_Taxonomy_Meta::get_term_meta( $term, $taxonomy, $meta );
}

/**
 * Throw a notice about an invalid custom taxonomy used
 *
 * @since 1.4.14
 * @deprecated 1.5.4 (removed)
 */
function wpseo_invalid_custom_taxonomy() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.4' );
}

/**
 * Retrieve a post's terms, comma delimited.
 *
 * @deprecated 1.5.4
 * @deprecated use WPSEO_Replace_Vars::get_terms()
 * @see WPSEO_Replace_Vars::get_terms()
 *
 * @param int    $id            ID of the post to get the terms for.
 * @param string $taxonomy      The taxonomy to get the terms for this post from.
 * @param bool   $return_single If true, return the first term.
 * @return string either a single term or a comma delimited string of terms.
 */
function wpseo_get_terms( $id, $taxonomy, $return_single = false ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.4', 'WPSEO_Replace_Vars::get_terms' );
	$replacer = new WPSEO_Replace_Vars;
	return $replacer->get_terms( $id, $taxonomy, $return_single );
}
