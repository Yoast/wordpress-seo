<?php
/**
 * @package Frontend
 */

if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
	die;
}

/**
 * This class handles the Breadcrumbs generation and display
 */
class WPSEO_Breadcrumbs {

	/**
	 * Class constructor
	 */
	function __construct() {
		// If breadcrumbs are active (which they are otherwise this class wouldn't be instantiated), there's no reason
		// to have bbPress breadcrumbs as well.
		add_filter( 'bbp_get_breadcrumb', '__return_false' );
	}

	/**
	 * Wrapper function for the breadcrumb so it can be output for the supported themes.
	 */
	function breadcrumb_output() {
		$this->breadcrumb( '<div id="wpseobreadcrumb">', '</div>' );
	}

	/**
	 * Get a term's parents.
	 *
	 * @param object $term Term to get the parents for
	 * @return array
	 */
	function get_term_parents( $term ) {
		$tax     = $term->taxonomy;
		$parents = array();
		while ( $term->parent != 0 ) {
			$term      = get_term( $term->parent, $tax );
			$parents[] = $term;
		}
		return array_reverse( $parents );
	}

	/**
	 * Display or return the full breadcrumb path.
	 *
	 * @param string $before  The prefix for the breadcrumb, usually something like "You're here".
	 * @param string $after   The suffix for the breadcrumb.
	 * @param bool   $display When true, echo the breadcrumb, if not, return it as a string.
	 * @return string
	 */
	function breadcrumb( $before = '', $after = '', $display = true ) {
		$options = get_wpseo_options();

		global $wp_query, $post;

		$on_front  = get_option( 'show_on_front' );
		$blog_page = get_option( 'page_for_posts' );

		$links = array(
			array(
				'url'  => get_home_url(),
				'text' => ( isset( $options['breadcrumbs-home'] ) && $options['breadcrumbs-home'] != '' ) ? $options['breadcrumbs-home'] : __( 'Home', 'wordpress-seo' )
			)
		);

		if ( "page" == $on_front && 'post' == get_post_type() && !is_home() ) {
			if ( $blog_page && ( !isset( $options['breadcrumbs-blog-remove'] ) || !$options['breadcrumbs-blog-remove'] ) )
				$links[] = array( 'id' => $blog_page );
		}

		if ( ( $on_front == "page" && is_front_page() ) || ( $on_front == "posts" && is_home() ) ) {

		} else if ( $on_front == "page" && is_home() ) {
			$links[] = array( 'id' => $blog_page );
		} else if ( is_singular() ) {
			if ( get_post_type_archive_link( $post->post_type ) ) {
				$links[] = array( 'ptarchive' => $post->post_type );
			}

			if ( 0 == $post->post_parent ) {
				if ( isset( $options['post_types-' . $post->post_type . '-maintax'] ) && $options['post_types-' . $post->post_type . '-maintax'] != '0' ) {
					$main_tax = $options['post_types-' . $post->post_type . '-maintax'];
					$terms    = wp_get_object_terms( $post->ID, $main_tax );

					if ( count( $terms ) > 0 ) {
						// Let's find the deepest term in this array, by looping through and then unsetting every term that is used as a parent by another one in the array.
						$terms_by_id = array();
						foreach ( $terms as $term ) {
							$terms_by_id[$term->term_id] = $term;
						}
						foreach ( $terms as $term ) {
							unset( $terms_by_id[$term->parent] );
						}

						// As we could still have two subcategories, from different parent categories, let's pick the first.
						reset( $terms_by_id );
						$deepest_term = current( $terms_by_id );

						if ( is_taxonomy_hierarchical( $main_tax ) && $deepest_term->parent != 0 ) {
							foreach ( $this->get_term_parents( $deepest_term ) as $parent_term ) {
								$links[] = array( 'term' => $parent_term );
							}
						}
						$links[] = array( 'term' => $deepest_term );
					}

				}
			} else {
				if ( isset( $post->ancestors ) ) {
					if ( is_array( $post->ancestors ) )
						$ancestors = array_values( $post->ancestors );
					else
						$ancestors = array( $post->ancestors );
				} else {
					$ancestors = array( $post->post_parent );
				}

				// Reverse the order so it's oldest to newest
				$ancestors = array_reverse( apply_filters( 'wp_seo_get_bc_ancestors', $ancestors ) );

				foreach ( $ancestors as $ancestor ) {
					$links[] = array( 'id' => $ancestor );
				}
			}
			$links[] = array( 'id' => $post->ID );
		} else {
			if ( is_post_type_archive() ) {
				$links[] = array( 'ptarchive' => get_post_type() );
			} else if ( is_tax() || is_tag() || is_category() ) {
				$term = $wp_query->get_queried_object();

				if ( isset( $options['taxonomy-' . $term->taxonomy . '-ptparent'] ) && $options['taxonomy-' . $term->taxonomy . '-ptparent'] != '' ) {
					if ( 'post' == $options['taxonomy-' . $term->taxonomy . '-ptparent'] && get_option( 'show_on_front' ) == 'page' ) {
						if ( get_option( 'page_for_posts' ) ) {
							$links[] = array( 'id' => get_option( 'page_for_posts' ) );
						}
					} else {
						$links[] = array( 'ptarchive' => $options['taxonomy-' . $term->taxonomy . '-ptparent'] );
					}
				}

				if ( is_taxonomy_hierarchical( $term->taxonomy ) && $term->parent != 0 ) {
					foreach ( $this->get_term_parents( $term ) as $parent_term ) {
						$links[] = array( 'term' => $parent_term );
					}
				}

				$links[] = array( 'term' => $term );
			} else if ( is_date() ) {
				if ( isset( $options['breadcrumbs-archiveprefix'] ) )
					$bc = esc_html( $options['breadcrumbs-archiveprefix'] );
				else
					$bc = __( 'Archives for', 'wordpress-seo' );
				if ( is_day() ) {
					global $wp_locale;
					$links[] = array(
						'url'  => get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) ),
						'text' => $wp_locale->get_month( get_query_var( 'monthnum' ) ) . ' ' . get_query_var( 'year' )
					);
					$links[] = array( 'text' => $bc . " " . get_the_date() );
				} else if ( is_month() ) {
					$links[] = array( 'text' => $bc . " " . single_month_title( ' ', false ) );
				} else if ( is_year() ) {
					$links[] = array( 'text' => $bc . " " . get_query_var( 'year' ) );
				}
			} elseif ( is_author() ) {
				if ( isset( $options['breadcrumbs-archiveprefix'] ) )
					$bc = esc_html( $options['breadcrumbs-archiveprefix'] );
				else
					$bc = __( 'Archives for', 'wordpress-seo' );
				$user    = $wp_query->get_queried_object();
				$links[] = array( 'text' => $bc . " " . esc_html( $user->display_name ) );
			} elseif ( is_search() ) {
				if ( isset( $options['breadcrumbs-searchprefix'] ) && $options['breadcrumbs-searchprefix'] != '' )
					$bc = esc_html( $options['breadcrumbs-searchprefix'] );
				else
					$bc = __( 'You searched for', 'wordpress-seo' );
				$links[] = array( 'text' => $bc . ' "' . esc_html( get_search_query() ) . '"' );
			} elseif ( is_404() ) {

				if ( 0 !== get_query_var( 'year' ) || ( 0 !== get_query_var( 'monthnum' ) || 0 !== get_query_var( 'day' ) ) ) {
					
					if ( 'page' == $on_front && !is_home() ) {
						if ( $blog_page && ( !isset( $options['breadcrumbs-blog-remove'] ) || !$options['breadcrumbs-blog-remove'] ) )
							$links[] = array( 'id' => $blog_page );
					}

					if ( isset( $options['breadcrumbs-archiveprefix'] ) )
						$bc = $options['breadcrumbs-archiveprefix'];
					else
						$bc = __( 'Archives for', 'wordpress-seo' );


					if ( 0 !== get_query_var( 'day' ) ) {
						$links[] = array(
							'url'  => get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) ),
							'text' => $GLOBALS['wp_locale']->get_month( get_query_var( 'monthnum' ) ) . ' ' . get_query_var( 'year' )
						);
						global $post;
						$original_p = $post;
						$post->post_date = sprintf("%04d-%02d-%02d 00:00:00", get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) );
						$links[] = array( 'text' => $bc . ' ' . get_the_date() );
						$post = $original_p;

					} else if ( 0 !== get_query_var( 'monthnum' ) ) {
						$links[] = array( 'text' => $bc . ' ' . single_month_title( ' ', false ) );
					} else if ( 0 !== get_query_var( 'year' ) ) {
						$links[] = array( 'text' => $bc . ' ' . get_query_var( 'year' ) );
					}
				}
				else {
					if ( isset( $options['breadcrumbs-404crumb'] ) && '' != $options['breadcrumbs-404crumb'] )
						$crumb404 = $options['breadcrumbs-404crumb'];
					else
						$crumb404 = __( 'Error 404: Page not found', 'wordpress-seo' );
							
					$links[] = array( 'text' => $crumb404 );
				}
			}
		}

		$links = apply_filters( 'wpseo_breadcrumb_links', $links );

		$output = $this->create_breadcrumbs_string( $links );

		if ( isset( $options['breadcrumbs-prefix'] ) && $options['breadcrumbs-prefix'] != "" )
			$output = $options['breadcrumbs-prefix'] . " " . $output;

		if ( $display ) {
			echo $before . $output . $after;
			return true;
		} else {
			return $before . $output . $after;
		}
	}

	/**
	 * Take the links array and return a full breadcrumb string.
	 *
	 * Each element of the links array can either have one of these keys:
	 *       "id"            for post types;
	 *    "ptarchive"  for a post type archive;
	 *    "term"         for a taxonomy term.
	 * If either of these 3 are set, the url and text are retrieved. If not, url and text have to be set.
	 *
	 * @link http://support.google.com/webmasters/bin/answer.py?hl=en&answer=185417 Google documentation on RDFA
	 *
	 * @param array  $links   The links that should be contained in the breadcrumb.
	 * @param string $wrapper The wrapping element for the entire breadcrumb path.
	 * @param string $element The wrapping element for each individual link.
	 * @return string
	 */
	function create_breadcrumbs_string( $links, $wrapper = 'span', $element = 'span' ) {
		global $paged;

		$opt    = get_wpseo_options();
		$sep    = ( isset( $opt['breadcrumbs-sep'] ) && $opt['breadcrumbs-sep'] != '' ) ? $opt['breadcrumbs-sep'] : '&raquo;';
		$output = '';

		foreach ( $links as $i => $link ) {
			if ( !empty( $output ) )
				$output .= " $sep ";

			if ( isset( $link['id'] ) ) {
				$link['url']  = get_permalink( $link['id'] );
				$link['text'] = wpseo_get_value( 'bctitle', $link['id'] );
				if ( empty( $link['text'] ) )
					$link['text'] = strip_tags( get_the_title( $link['id'] ) );
				$link['text'] = apply_filters( 'wp_seo_get_bc_title', $link['text'], $link['id'] );
			}

			if ( isset( $link['term'] ) ) {
				$bctitle = wpseo_get_term_meta( $link['term'], $link['term']->taxonomy, 'bctitle' );
				if ( !$bctitle )
					$bctitle = $link['term']->name;
				$link['url']  = get_term_link( $link['term'] );
				$link['text'] = $bctitle;
			}

			if ( isset( $link['ptarchive'] ) ) {
				if ( isset( $opt['bctitle-ptarchive-' . $link['ptarchive']] ) && '' != $opt['bctitle-ptarchive-' . $link['ptarchive']] ) {
					$archive_title = $opt['bctitle-ptarchive-' . $link['ptarchive']];
				} else {
					$post_type_obj = get_post_type_object( $link['ptarchive'] );
					$archive_title = $post_type_obj->labels->menu_name;
				}
				$link['url']  = get_post_type_archive_link( $link['ptarchive'] );
				$link['text'] = $archive_title;
			}

			$element     = esc_attr( apply_filters( 'wpseo_breadcrumb_single_link_wrapper', $element ) );
			$link_output = '<' . $element . ' typeof="v:Breadcrumb">';
			if ( isset( $link['url'] ) && ( $i < ( count( $links ) - 1 ) || $paged ) ) {
				$link_output .= '<a href="' . esc_url( $link['url'] ) . '" rel="v:url" property="v:title">' . esc_html( $link['text'] ) . '</a>';
			} else {
				if ( isset( $opt['breadcrumbs-boldlast'] ) && $opt['breadcrumbs-boldlast'] ) {
					$link_output .= '<strong class="breadcrumb_last" property="v:title">' . esc_html( $link['text'] ) . '</strong>';
				} else {
					$link_output .= '<span class="breadcrumb_last" property="v:title">' . esc_html( $link['text'] ) . '</span>';
				}
			}
			$link_output .= '</' . $element . '>';

			$output .= apply_filters( 'wpseo_breadcrumb_single_link', $link_output, $link );
		}

		$id = apply_filters( 'wpseo_breadcrumb_output_id', false );
		if ( !empty( $id ) )
			$id = ' id="' . esc_attr( $id ) . '"';

		$class = apply_filters( 'wpseo_breadcrumb_output_class', false );
		if ( !empty( $class ) )
			$class = ' class="' . esc_attr( $class ) . '"';

		$wrapper = apply_filters( 'wpseo_breadcrumb_output_wrapper', $wrapper );
		return apply_filters( 'wpseo_breadcrumb_output', '<' . $wrapper . $id . $class . ' xmlns:v="http://rdf.data-vocabulary.org/#">' . $output . '</' . $wrapper . '>' );
	}

}

global $wpseo_bc;
$wpseo_bc = new WPSEO_Breadcrumbs();

if ( !function_exists( 'yoast_breadcrumb' ) ) {
	/**
	 * Template tag for breadcrumbs.
	 *
	 * @param string $before  What to show before the breadcrumb.
	 * @param string $after   What to show after the breadcrumb.
	 * @param bool   $display Whether to display the breadcrumb (true) or return it (false).
	 * @return string
	 */
	function yoast_breadcrumb( $before = '', $after = '', $display = true ) {
		global $wpseo_bc;
		return $wpseo_bc->breadcrumb( $before, $after, $display );
	}
}
