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

	set_transient( 'html-sitemap', $output, 60 );
	return $output;
}

add_shortcode( 'wpseo_sitemap', 'wpseo_sitemap_handler' );