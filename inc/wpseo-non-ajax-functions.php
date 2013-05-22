<?php
/**
 * @package Internals
 */

include 'class-sitemap-walker.php';

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Flush the rewrite rules.
 */
function wpseo_flush_rules() {
	global $wp_rewrite;
	$wp_rewrite->flush_rules();
}

/**
 * Runs on activation of the plugin.
 */
function wpseo_activate() {
	wpseo_defaults();

	wpseo_flush_rules();

	wpseo_title_test();

	// Clear cache so the changes are obvious.
	if ( function_exists( 'w3tc_pgcache_flush' ) ) {
		w3tc_pgcache_flush();
	} else if ( function_exists( 'wp_cache_clear_cache' ) ) {
		wp_cache_clear_cache();
	}

}

/**
 * Set the default settings.
 *
 * This uses the currently available custom post types and taxonomies.
 */
function wpseo_defaults() {
	$options = get_option( 'wpseo' );
	if ( !is_array( $options ) ) {
		$opt = array(
			'disableadvanced_meta' => 'on',
			'version'              => WPSEO_VERSION,
		);
		update_option( 'wpseo', $opt );
	}

	if ( !is_array( get_option( 'wpseo_titles' ) ) ) {
		$opt = array(
			'title-home'          => '%%sitename%% %%page%% %%sep%% %%sitedesc%%',
			'title-author'        => sprintf( __( '%s, Author at %s', 'wordpress-seo' ), '%%name%%', '%%sitename%%' ) . ' %%page%% ',
			'title-archive'       => '%%date%% %%page%% %%sep%% %%sitename%%',
			'title-search'        => sprintf( __( 'You searched for %s', 'wordpress-seo' ), '%%searchphrase%%' ) . ' %%page%% %%sep%% %%sitename%%',
			'title-404'           => __( 'Page Not Found', 'wordpress-seo' ) . ' %%sep%% %%sitename%%',
			'noindex-archive'     => 'on',
			'noindex-post_format' => 'on',
		);
		foreach ( get_post_types( array( 'public' => true ), 'objects' ) as $pt ) {
			$opt['title-' . $pt->name] = '%%title%% %%page%% %%sep%% %%sitename%%';
			if ( $pt->has_archive )
				$opt['title-ptarchive-' . $pt->name] = sprintf( __( '%s Archive', 'wordpress-seo' ), '%%pt_plural%%' ) . ' %%page%% %%sep%% %%sitename%%';
		}
		foreach ( get_taxonomies( array( 'public' => true ) ) as $tax ) {
			$opt['title-' . $tax] = sprintf( __( '%s Archives', 'wordpress-seo' ), '%%term_title%%' ) . ' %%page%% %%sep%% %%sitename%%';
		}
		update_option( 'wpseo_titles', $opt );
	}

	if ( !is_array( get_option( 'wpseo_xml' ) ) ) {
		$opt = array(
			'enablexmlsitemap'                     => 'on',
			'post_types-attachment-not_in_sitemap' => true
		);
		update_option( 'wpseo_xml', $opt );
	}

	if ( !is_array( get_option( 'wpseo_social' ) ) ) {
		$opt = array(
			'opengraph' => 'on',
		);
		update_option( 'wpseo_social', $opt );
	}

	if ( !is_array( get_option( 'wpseo_rss' ) ) ) {
		$opt = array(
			'rssafter' => sprintf( __( 'The post %s appeared first on %s.', 'wordpress-seo' ), '%%POSTLINK%%', '%%BLOGLINK%%' ),
		);
		update_option( 'wpseo_rss', $opt );
	}

	// Force WooThemes to use WordPress SEO data.
	if ( function_exists( 'woo_version_init' ) ) {
		update_option( 'seo_woo_use_third_party_data', 'true' );
	}

	wpseo_title_test();
}

/**
 * Test whether force rewrite should be enabled or not.
 */
function wpseo_title_test() {
	$options = get_option( 'wpseo_titles' );

	if ( isset( $options['forcerewritetitle'] ) )
		unset( $options['forcerewritetitle'] );

	$options['title_test'] = true;
	update_option( 'wpseo_titles', $options );

	// Setting title_test to true forces the plugin to output the title below through a filter in class-frontend.php
	$expected_title = 'This is a Yoast Test Title';

	if ( function_exists( 'w3tc_pgcache_flush' ) ) {
		w3tc_pgcache_flush();
	} else if ( function_exists( 'wp_cache_clear_cache' ) ) {
		wp_cache_clear_cache();
	}

	global $wp_version;
	$args = array(
		'user-agent' => "WordPress/${wp_version}; " . get_site_url() . " - Yoast",
	);
	$resp = wp_remote_get( get_bloginfo( 'url' ), $args );

	// echo '<pre>'.$resp['body'].'</pre>';

	if ( $resp && !is_wp_error( $resp ) && 200 == $resp['response']['code'] ) {
		$res = preg_match( '/<title>([^<]+)<\/title>/im', $resp['body'], $matches );

		if ( $res && strcmp( $matches[1], $expected_title ) !== 0 ) {
			$options['forcerewritetitle'] = 'on';
			update_option( 'wpseo_titles', $options );

			$resp = wp_remote_get( get_bloginfo( 'url' ), $args );

			$res = preg_match( '/<title>([^>]+)<\/title>/im', $resp['body'], $matches );
		}

		if ( !$res || $matches[1] != $expected_title )
			unset( $options['forcerewritetitle'] );
	} else {
		// If that dies, let's make sure the titles are correct and force the output.
		$options['forcerewritetitle'] = 'on';
	}

	unset( $options['title_test'] );
	update_option( 'wpseo_titles', $options );
}

add_filter( 'switch_theme', 'wpseo_title_test', 0 );

/**
 * On deactivation, flush the rewrite rules so XML sitemaps stop working.
 */
function wpseo_deactivate() {
	wpseo_flush_rules();

	// Clear cache so the changes are obvious.
	if ( function_exists( 'w3tc_pgcache_flush' ) ) {
		w3tc_pgcache_flush();
	} else if ( function_exists( 'wp_cache_clear_cache' ) ) {
		wp_cache_clear_cache();
	}
}

/**
 * Translates a decimal analysis score into a textual one.
 *
 * @param int $val The decimal score to translate.
 * @return string
 */
function wpseo_translate_score( $val, $css = true ) {
	switch ( $val ) {
		case 0:
			$score = __( 'N/A', 'wordpress-seo' );
			$css = 'na';
			break;
		case 4:
		case 5:
			$score = __( 'Poor', 'wordpress-seo' );
			$css = 'poor';
			break;
		case 6:
		case 7:
			$score = __( 'OK', 'wordpress-seo' );
			$css = 'ok';
			break;
		case 8:
		case 9:
		case 10:
			$score = __( 'Good', 'wordpress-seo' );
			$css = 'good';
			break;
		default:
			$score = __( 'Bad', 'wordpress-seo' );
			$css = 'bad';
			break;
	}
	
	if ( $css )
		return $css;
	else
		return $score;
}


/**
 * Adds an SEO admin bar menu with several options. If the current user is an admin he can also go straight to several settings menu's from here.
 */
function wpseo_admin_bar_menu() {
	// If the current user can't write posts, this is all of no use, so let's not output an admin menu
	if ( !current_user_can( 'edit_posts' ) )
		return;

	global $wp_admin_bar, $wpseo_front, $post;

	if ( is_object( $wpseo_front ) ) {
		$url = $wpseo_front->canonical( false );
	} else {
		$url = '';
	}

	$focuskw = '';
	$score   = '';
	$seo_url = get_admin_url( null, 'admin.php?page=wpseo_dashboard' );

	if ( is_singular() && isset( $post ) && is_object( $post ) && apply_filters( 'wpseo_use_page_analysis', true ) === true ) {
		$focuskw    = wpseo_get_value( 'focuskw', $post->ID );
		$perc_score = wpseo_get_value( 'linkdex', $post->ID );
		$txtscore   = wpseo_translate_score( round( $perc_score / 10 ) );
		$title 		= wpseo_translate_score( round( $perc_score / 10 ), $css = false );
		$score      = '<div title="' . esc_attr( $title ) . '" class="wpseo_score_img ' . $txtscore . ' ' . $perc_score . '"></div>';
		
		$seo_url    = get_edit_post_link( $post->ID );
		if ( $txtscore != 'na' )
			$seo_url .= '#wpseo_linkdex';
	}

	$wp_admin_bar->add_menu( array( 'id' => 'wpseo-menu', 'title' => __( 'SEO', 'wordpress-seo' ) . $score, 'href' => $seo_url, ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-kwresearch', 'title' => __( 'Keyword Research', 'wordpress-seo' ), '#', ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-adwordsexternal', 'title' => __( 'AdWords External', 'wordpress-seo' ), 'href' => 'https://adwords.google.com/select/KeywordToolExternal', 'meta' => array( 'target' => '_blank' ) ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-googleinsights', 'title' => __( 'Google Insights', 'wordpress-seo' ), 'href' => 'http://www.google.com/insights/search/#q=' . urlencode( $focuskw ) . '&cmpt=q', 'meta' => array( 'target' => '_blank' ) ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-wordtracker', 'title' => __( 'SEO Book', 'wordpress-seo' ), 'href' => 'http://tools.seobook.com/keyword-tools/seobook/?keyword=' . urlencode( $focuskw ), 'meta' => array( 'target' => '_blank' ) ) );

	if ( !is_admin() ) {
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-analysis', 'title' => __( 'Analyze this page', 'wordpress-seo' ), '#', ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-inlinks-ose', 'title' => __( 'Check Inlinks (OSE)', 'wordpress-seo' ), 'href' => 'http://www.opensiteexplorer.org/' . str_replace( '/', '%252F', preg_replace( '/^https?:\/\//', '', $url ) ) . '/a!links', 'meta' => array( 'target' => '_blank' ) ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-kwdensity', 'title' => __( 'Check Keyword Density', 'wordpress-seo' ), 'href' => 'http://tools.davidnaylor.co.uk/keyworddensity/index.php?url=' . $url . '&keyword=' . urlencode( $focuskw ), 'meta' => array( 'target' => '_blank' ) ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-cache', 'title' => __( 'Check Google Cache', 'wordpress-seo' ), 'href' => 'http://webcache.googleusercontent.com/search?strip=1&q=cache:' . $url, 'meta' => array( 'target' => '_blank' ) ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-header', 'title' => __( 'Check Headers', 'wordpress-seo' ), 'href' => 'http://quixapp.com/headers/?r=' . urlencode( $url ), 'meta' => array( 'target' => '_blank' ) ) );
	}

	$admin_menu = false;
	if ( function_exists( 'is_multisite' ) && is_multisite() ) {
		$options = get_site_option( 'wpseo_ms' );
		if ( is_array( $options ) && isset( $options['access'] ) && $options['access'] == 'superadmin' ) {
			if ( is_super_admin() )
				$admin_menu = true;
			else
				$admin_menu = false;
		} else {
			if ( current_user_can( 'manage_options' ) )
				$admin_menu = true;
			else
				$admin_menu = false;
		}
	} else {
		if ( current_user_can( 'manage_options' ) )
			$admin_menu = true;
	}

	if ( $admin_menu ) {
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-settings', 'title' => __( 'SEO Settings', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_titles' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-titles', 'title' => __( "Titles & Metas", 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_titles' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-social', 'title' => __( 'Social', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_social' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-xml', 'title' => __( 'XML Sitemaps', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_xml' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-permalinks', 'title' => __( 'Permalinks', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_permalinks' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-internal-links', 'title' => __( 'Internal Links', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_internal-links' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-rss', 'title' => __( 'RSS', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_rss' ), ) );
	}
}

add_action( 'admin_bar_menu', 'wpseo_admin_bar_menu', 95 );

/**
 * Enqueue a tiny bit of CSS to show so the adminbar shows right.
 */
function wpseo_admin_bar_css() {
	if ( is_admin_bar_showing() && is_singular() )
		wp_enqueue_style( 'boxes', WPSEO_URL . 'css/adminbar.css', WPSEO_VERSION );
}

add_action( 'wp_enqueue_scripts', 'wpseo_admin_bar_css' );

/**
 * Allows editing of the meta fields through weblog editors like Marsedit.
 *
 * @param array $allcaps Capabilities that must all be true to allow action.
 * @param array $cap     Array of capabilities to be checked, unused here.
 * @param array $args    List of arguments for the specific cap to be checked.
 *
 * @return array $allcaps
 */
function allow_custom_field_edits( $allcaps, $cap, $args ) {
	// $args[0] holds the capability
	// $args[2] holds the post ID
	// $args[3] holds the custom field

	// Make sure the request is to edit or add a post meta (this is usually also the second value in $cap,
	// but this is safer to check).
	if ( in_array( $args[0], array( "edit_post_meta", "add_post_meta" ) ) ) {
		// Only allow editing rights for users who have the rights to edit this post and make sure
		// the meta value starts with _yoast_wpseo.
		if ( current_user_can( 'edit_post', $args[2] ) && strpos( $args[3], "_yoast_wpseo_" ) === 0 )
			$allcaps[$args[0]] = true;
	}

	return $allcaps;
}

add_filter( 'user_has_cap', 'allow_custom_field_edits', 0, 3 );

/**
 * Generate an HTML sitemap
 *
 * @param array $atts The attributes passed to the shortcode.
 *
 * @return string
 */
function wpseo_sitemap_handler( $atts ) {

	$atts = shortcode_atts( array(
		'authors' => true,
		'pages'   => true,
		'posts'   => true,
		'archives'   => true
	), $atts );

	$display_authors = ( $atts['authors'] === 'no' ) ? false : true;
	$display_pages   = ( $atts['pages'] === 'no' ) ? false : true;
	$display_posts   = ( $atts['posts'] === 'no' ) ? false : true;
	$display_archives   = ( $atts['archives'] === 'no' ) ? false : true;

	$options = get_wpseo_options();
	
	// Delete the transient if any of these are no
	if ( $display_authors === 'no' || $display_pages === 'no' || $display_posts === 'no' ) {
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
		$output .= '<h2 id="authors">' . __( 'Authors', 'wordpress-seo' ) . '</h2><ul>';
		// use echo => false b/c shortcode format screws up
		$author_list = wp_list_authors(
			array(
				'exclude_admin' => false,
				'echo'          => false,
			)
		);
		$output .= $author_list;
		$output .= '</ul>';
	}

	// create page list
	if ( $display_pages ) {
		$output .= '<h2 id="pages">' . __( 'Pages', 'wordpress-seo' ) . '</h2><ul>';
		// Add pages you'd like to exclude in the exclude here
		// possibly have this controlled by shortcode params
		$page_list = wp_list_pages(
			array(
				'exclude'  => '',
				'title_li' => '',
				'echo'     => false,
			)
		);
		$output .= $page_list;
		$output .= '</ul>';
	}

	// create post list
	if ( $display_posts ) {
		$output .= '<h2 id="posts">' . __( 'Posts', 'wordpress-seo' ) . '</h2><ul>';
		// Add categories you'd like to exclude in the exclude here
		// possibly have this controlled by shortcode params
		$cats = get_categories( 'exclude=' );
		foreach ( $cats as $cat ) {
			$output .= "<li>" . $cat->cat_name;
			$output .= "<ul>";

			$args = array(
				'post_type'      => 'post',
				'post_status'    => 'publish',

				'posts_per_page' => -1,
				'cat'            => $cat->cat_ID,

				'meta_query'     => array(
					'relation' => 'OR',
					// include if this key doesn't exists
					array(
						'key'     => '_yoast_wpseo_meta-robots-noindex',
						'value'   => '', // This is ignored, but is necessary...
						'compare' => 'NOT EXISTS'
					),
					// OR if key does exists include if it is not 1
					array(
						'key'     => '_yoast_wpseo_meta-robots-noindex',
						'value'   => '1',
						'compare' => '!='
					),
					// OR this key overrides it
					array(
						'key'     => '_yoast_wpseo_sitemap-html-include',
						'value'   => 'always',
						'compare' => '='
					)
				)
			);

			$posts = get_posts( $args );

			foreach ( $posts as $post ) {
				$category = get_the_category( $post->ID );

				// Only display a post link once, even if it's in multiple categories
				if ( $category[0]->cat_ID == $cat->cat_ID ) {
					$output .= '<li><a href="' . get_permalink( $post->ID ) . '">' . get_the_title( $post->ID ) . '</a></li>';
				}
			}

			$output .= "</ul>";
			$output .= "</li>";
		}
	}
	$output .= '</ul>';

	// get all public non-builtin post types
	$args = array(
		'public'   => true,
		'_builtin' => false
	);
	$post_types = get_post_types( $args, 'object' );
	
	// create an noindex array of post types and taxonomies
	$noindex = array();
	foreach($options as $key => $value) {
		if ( strpos( $key, 'noindex-' ) === 0 && $value == 'on' )
			$noindex[] = $key;
	}
	
	// create custom post type list
	foreach ( $post_types as $post_type ) {
		if ( ! in_array( 'noindex-' . $post_type->name, $noindex ) ) {
			$output .= '<h2 id="' . $post_type->name . '">' . __( $post_type->label, 'wordpress-seo' ) . '</h2><ul>';
			$output .= create_type_sitemap_template( $post_type );
			$output .= '</ul>';
		}
	}

	// $output = '';
	// create archives list
	if ( $display_archives ) {
		$output .= '<h2 id="archives">' . __( 'Archives', 'wordpress-seo' ) . '</h2><ul>';
		
		foreach ( $post_types as $post_type ) {
			if ( $post_type->has_archive && ! in_array( 'noindex-ptarchive-' . $post_type->name, $noindex ) ) {
				$output .= '<a href="' . get_post_type_archive_link( $post_type->name ) . '">' . $post_type->labels->name . '</a>';
				
				$output .= create_type_sitemap_template( $post_type );
			}
		}
		
		$output .= '</ul>';
	}
	
	set_transient( 'html-sitemap', $output, 60 );
	return $output;
}

add_shortcode( 'wpseo_sitemap', 'wpseo_sitemap_handler' );


function create_type_sitemap_template( $post_type ) {
	// $output = '<h2 id="' . $post_type->name . '">' . __( $post_type->label, 'wordpress-seo' ) . '</h2><ul>';

	$output = '';
	// Get all registered taxonomy of this post type
	$taxs = get_object_taxonomies( $post_type->name, 'object' );

	// Build the taxonomy tree
	$walker = new Sitemap_Walker();
	foreach ( $taxs as $key => $tax ) {
		$args = array(
			'post_type' => $post_type->name,
			'tax_query' => array(
				array(
					'taxonomy' => $key,
					'field' => 'id',
					'terms' => -1,
					'operator' => 'NOT',
				)
			)
		);
		$query = new WP_Query( $args );
		
		$title_li = $query->have_posts() ? $tax->labels->name : '';
	
		$output .= wp_list_categories(
			array(
				'title_li'  => $title_li,
				'echo'      => false,
				'taxonomy'  => $key,
				'show_option_none' => '',
				// 'hierarchical' => 0, // uncomment this for a flat list

				'walker'    => $walker,
				'post_type' => $post_type->name // arg used by the Walker class
			)
		);
	}

	$output .= '<br />';
	return $output;
}
