<?php
/**
 * @package Frontend
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'WPSEO_Breadcrumbs' ) ) {
	/**
	 * This class handles the Breadcrumbs generation and display
	 */
	class WPSEO_Breadcrumbs {

		public $options;

		/**
		 * Wrapper function for the breadcrumb so it can be output for the supported themes.
		 *
		 * @deprecated 1.5.0
		 */
		public function breadcrumb_output() {
			_deprecated_function( __FUNCTION__, '1.5.0', 'yoast_breadcrumb' );
			$this->breadcrumb( '<div id="wpseobreadcrumb">', '</div>' );
		}

		/**
		 * Get a term's parents.
		 *
		 * @param	object	$term	Term to get the parents for
		 * @return	array
		 */
		public function get_term_parents( $term ) {
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
		 * @param	string	$before		The prefix for the breadcrumb, usually something like "You're here".
		 * @param	string	$after		The suffix for the breadcrumb.
		 * @param	bool	$display	When true, echo the breadcrumb, if not, return it as a string.
		 * @return	string
		 */
		public function breadcrumb( $before = '', $after = '', $display = true ) {
			$this->options = WPSEO_Options::get_all();

			global $wp_query, $post;

			$on_front  = get_option( 'show_on_front' );
			$blog_page = get_option( 'page_for_posts' );

			$links = array(
				array(
					'url'  => get_home_url(),
					'text' => $this->options['breadcrumbs-home'],
				),
			);

			if ( 'page' == $on_front && 'post' == get_post_type() && ! is_home() ) {
				if ( $blog_page && $this->options['breadcrumbs-blog-remove'] === false ) {
					$links[] = array( 'id' => $blog_page );
				}
			}

			if ( ( $on_front == 'page' && is_front_page() ) || ( $on_front == 'posts' && is_home() ) ) {

			}
			elseif ( $on_front == 'page' && is_home() ) {
				$links[] = array( 'id' => $blog_page );
			}
			elseif ( is_singular() ) {
				if ( get_post_type_archive_link( $post->post_type ) ) {
					$links[] = array( 'ptarchive' => $post->post_type );
				}

				if ( 0 == $post->post_parent ) {
					if ( isset( $this->options['post_types-' . $post->post_type . '-maintax'] ) && $this->options['post_types-' . $post->post_type . '-maintax'] != '0' ) {
						$main_tax = $this->options['post_types-' . $post->post_type . '-maintax'];
						$terms    = wp_get_object_terms( $post->ID, $main_tax );

						if ( is_array( $terms ) && $terms !== array() ) {
							/* Let's find the deepest term in this array, by looping through and then
							   unsetting every term that is used as a parent by another one in the array. */
							$terms_by_id = array();
							foreach ( $terms as $term ) {
								$terms_by_id[$term->term_id] = $term;
							}
							foreach ( $terms as $term ) {
								unset( $terms_by_id[$term->parent] );
							}

							/* As we could still have two subcategories, from different parent categories,
							   let's pick the one with the lowest ordered ancestor. */
							$parents_count = 0;
							$term_order    = 9999; //because ASC
							reset( $terms_by_id );
							$deepest_term = current( $terms_by_id );
							foreach ( $terms_by_id as $term ) {
								$parents = $this->get_term_parents( $term );

								if ( sizeof( $parents ) >= $parents_count ) {
									$parents_count = sizeof( $parents );

									//if higher count
									if ( sizeof( $parents ) > $parents_count ) {
										//reset order
										$term_order = 9999;
									}

									$parent_order = 9999; //set default order
									foreach ( $parents as $parent ) {
										if ( $parent->parent == 0 && isset( $parent->term_order ) ) {
											$parent_order = $parent->term_order;
										}
									}

									//check if parent has lowest order
									if ( $parent_order < $term_order ) {
										$term_order = $parent_order;

										$deepest_term = $term;
									}
								}
							}

							if ( is_taxonomy_hierarchical( $main_tax ) && $deepest_term->parent != 0 ) {
								foreach ( $this->get_term_parents( $deepest_term ) as $parent_term ) {
									$links[] = array( 'term' => $parent_term );
								}
							}
							$links[] = array( 'term' => $deepest_term );
						}
					}
				}
				else {
					if ( isset( $post->ancestors ) ) {
						if ( is_array( $post->ancestors ) ) {
							$ancestors = array_values( $post->ancestors );
						}
						else {
							$ancestors = array( $post->ancestors );
						}
					}
					else {
						$ancestors = array( $post->post_parent );
					}

					/**
					 * Allow changing the ancestors for the WP SEO breadcrumbs output
					 *
					 * @api array $ancestors Ancestors
					 */
					$ancestors = apply_filters( 'wp_seo_get_bc_ancestors', $ancestors );

					// Reverse the order so it's oldest to newest
					$ancestors = array_reverse( $ancestors );

					foreach ( $ancestors as $ancestor ) {
						$links[] = array( 'id' => $ancestor );
					}
				}
				$links[] = array( 'id' => $post->ID );
			}
			else {
				if ( is_post_type_archive() ) {
					$links[] = array( 'ptarchive' => $wp_query->query['post_type'] );
				}
				elseif ( is_tax() || is_tag() || is_category() ) {
					$term = $wp_query->get_queried_object();

					if ( isset( $this->options['taxonomy-' . $term->taxonomy . '-ptparent'] ) && $this->options['taxonomy-' . $term->taxonomy . '-ptparent'] != '0' ) {
						if ( 'post' == $this->options['taxonomy-' . $term->taxonomy . '-ptparent'] && get_option( 'show_on_front' ) == 'page' ) {
							if ( get_option( 'page_for_posts' ) ) {
								$links[] = array( 'id' => get_option( 'page_for_posts' ) );
							}
						}
						else {
							$links[] = array( 'ptarchive' => $this->options['taxonomy-' . $term->taxonomy . '-ptparent'] );
						}
					}

					if ( is_taxonomy_hierarchical( $term->taxonomy ) && $term->parent != 0 ) {
						foreach ( $this->get_term_parents( $term ) as $parent_term ) {
							$links[] = array( 'term' => $parent_term );
						}
					}

					$links[] = array( 'term' => $term );
				}
				elseif ( is_date() ) {
					$bc = $this->options['breadcrumbs-archiveprefix'];
					if ( is_day() ) {
						global $wp_locale;
						$links[] = array(
							'url'  => get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) ),
							'text' => $wp_locale->get_month( get_query_var( 'monthnum' ) ) . ' ' . get_query_var( 'year' ),
						);
						$links[] = array( 'text' => trim( $bc . ' ' . get_the_date() ) );
					}
					elseif ( is_month() ) {
						$links[] = array( 'text' => trim( $bc . ' ' . single_month_title( ' ', false ) ) );
					}
					elseif ( is_year() ) {
						$links[] = array( 'text' => trim( $bc . ' ' . get_query_var( 'year' ) ) );
					}
				}
				elseif ( is_author() ) {
					$user    = $wp_query->get_queried_object();
					$links[] = array( 'text' => trim( $this->options['breadcrumbs-archiveprefix'] . ' ' . $user->display_name ) );
				}
				elseif ( is_search() ) {
					$links[] = array( 'text' => trim( $this->options['breadcrumbs-searchprefix'] . ' "' . get_search_query() . '"' ) );
				}
				elseif ( is_404() ) {

					if ( 0 !== get_query_var( 'year' ) || ( 0 !== get_query_var( 'monthnum' ) || 0 !== get_query_var( 'day' ) ) ) {

						if ( 'page' == $on_front && ! is_home() ) {
							if ( $blog_page && $this->options['breadcrumbs-blog-remove'] === false ) {
								$links[] = array( 'id' => $blog_page );
							}
						}

						$bc = $this->options['breadcrumbs-archiveprefix'];

						if ( 0 !== get_query_var( 'day' ) ) {
							$links[] = array(
								'url'  => get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) ),
								'text' => $GLOBALS['wp_locale']->get_month( get_query_var( 'monthnum' ) ) . ' ' . get_query_var( 'year' ),
							);
							/* @todo [JRF => JRF/whomever] this probably needs fixing as objects are passed
							   by reference and this might actually change the real $post object the way
							   it's done now. Maybe use clone() ? or figure out another way to get round
							   the get_the_date() function */
							global $post;
							$original_p = $post;
							$post->post_date = sprintf( '%04d-%02d-%02d 00:00:00', get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) );
							$links[] = array( 'text' => $bc . ' ' . get_the_date() );
							$post = $original_p;

						}
						elseif ( 0 !== get_query_var( 'monthnum' ) ) {
							$links[] = array( 'text' => $bc . ' ' . single_month_title( ' ', false ) );
						}
						elseif ( 0 !== get_query_var( 'year' ) ) {
							$links[] = array( 'text' => $bc . ' ' . get_query_var( 'year' ) );
						}
					}
					else {
						$links[] = array( 'text' => $this->options['breadcrumbs-404crumb'] );
					}
				}
			}

			/**
			 * Filter: 'wpseo_breadcrumb_links' - Allow the developer to filter the WP SEO breadcrumb links, add to them, change order, etc.
			 *
			 * @api array $links The links array
			 */
			$links = apply_filters( 'wpseo_breadcrumb_links', $links );

			$output = $this->create_breadcrumbs_string( $links );

			if ( $this->options['breadcrumbs-prefix'] !== '' ) {
				$output = $this->options['breadcrumbs-prefix'] . ' ' . $output;
			}

			if ( $display ) {
				echo $before . $output . $after;
				return true;
			}
			else {
				return $before . $output . $after;
			}
		}

		/**
		 * Take the links array and return a full breadcrumb string.
		 *
		 * Each element of the links array can either have one of these keys:
		 *    "id"         for post types;
		 *    "ptarchive"  for a post type archive;
		 *    "term"       for a taxonomy term.
		 * If either of these 3 are set, the url and text are retrieved. If not, url and text have to be set.
		 *
		 * @link http://support.google.com/webmasters/bin/answer.py?hl=en&answer=185417 Google documentation on RDFA
		 *
		 * @param	array	$links		The links that should be contained in the breadcrumb.
		 * @param	string	$wrapper	The wrapping element for the entire breadcrumb path.
		 * @param	string	$element	The wrapping element for each individual link.
		 * @return	string
		 */
		public function create_breadcrumbs_string( $links, $wrapper = 'span', $element = 'span' ) {
			if ( ! is_array( $links ) || $links === array() ) {
				return '';
			}

			global $paged;

			/**
			 * Filter: 'wpseo_breadcrumb_separator' - Allow (theme) developer to change the WP SEO breadcrumb separator.
			 *
			 * @api string $breadcrumbs_sep Breadcrumbs separator
			 */
			$sep    = apply_filters( 'wpseo_breadcrumb_separator', $this->options['breadcrumbs-sep'] );
			$output = '';

			/**
			 * Filter: 'wpseo_breadcrumb_single_link_wrapper' - Allows developer to change or wrap each breadcrumb element
			 *
			 * @api string $element
			 */
			$element = esc_attr( apply_filters( 'wpseo_breadcrumb_single_link_wrapper', $element ) );

			foreach ( $links as $i => $link ) {

				if ( isset( $link['id'] ) ) {
					$link['url']  = get_permalink( $link['id'] );
					$link['text'] = WPSEO_Meta::get_value( 'bctitle', $link['id'] );
					if ( $link['text'] === '' ) {
						$link['text'] = strip_tags( get_the_title( $link['id'] ) );
					}
					/**
					 * Filter: 'wp_seo_get_bc_title' - Allow developer to filter the WP SEO Breadcrumb title.
					 *
					 * @api string $link_text The Breadcrumb title text
					 *
					 * @param int $link_id The post ID
					 */
					$link['text'] = apply_filters( 'wp_seo_get_bc_title', $link['text'], $link['id'] );
				}

				if ( isset( $link['term'] ) ) {
					$bctitle = WPSEO_Taxonomy_Meta::get_term_meta( $link['term'], $link['term']->taxonomy, 'bctitle' );
					if ( ! is_string( $bctitle ) || $bctitle === '' ) {
						$bctitle = $link['term']->name;
					}
					$link['url']  = get_term_link( $link['term'] );
					$link['text'] = $bctitle;
				}

				if ( isset( $link['ptarchive'] ) ) {
					/* @todo [JRF => whomever] add something along the lines of the below to make it work with WooCommerce.. ?
					if ( false === $link['ptarchive'] && true === is_post_type_archive( 'product' ) ) {
						$link['ptarchive'] = 'product'; // translate ?
					}*/
					if ( isset( $this->options['bctitle-ptarchive-' . $link['ptarchive']] ) && $this->options['bctitle-ptarchive-' . $link['ptarchive']] !== '' ) {

						$archive_title = $this->options['bctitle-ptarchive-' . $link['ptarchive']];
					}
					else {
						$post_type_obj = get_post_type_object( $link['ptarchive'] );
						if ( isset( $post_type_obj->label ) && $post_type_obj->label !== '' ) {
							$archive_title = $post_type_obj->label;
						}
						else {
							$archive_title = $post_type_obj->labels->menu_name;
						}
					}
					$link['url']  = get_post_type_archive_link( $link['ptarchive'] );
					$link['text'] = $archive_title;
				}

				$link_output = '';
				if ( isset( $link['text'] ) && ( is_string( $link['text'] ) && $link['text'] !== '' ) ) {
					$link_output = '<' . $element . ' typeof="v:Breadcrumb">';
					if ( ( isset( $link['url'] ) && ( is_string( $link['url'] ) && $link['url'] !== '' ) ) && ( $i < ( count( $links ) - 1 ) || $paged ) ) {
						$link_output .= '<a href="' . esc_url( $link['url'] ) . '" rel="v:url" property="v:title">' . esc_html( $link['text'] ) . '</a>';
					}
					else {
						if ( $this->options['breadcrumbs-boldlast'] === true && $i === ( count( $links ) - 1 ) ) {
							$link_output .= '<strong class="breadcrumb_last" property="v:title">' . esc_html( $link['text'] ) . '</strong>';
						}
						else {
							$link_output .= '<span class="breadcrumb_last" property="v:title">' . esc_html( $link['text'] ) . '</span>';
						}
					}
					$link_output .= '</' . $element . '>';

				}
				$link_sep = ( ( '' != $output ) ? " $sep " : '' );
				/**
				 * Filter: 'wpseo_breadcrumb_single_link' - Allow changing of each link being put out by the WP SEO breadcrumbs class
				 *
				 * @api string $link_output The output string
				 *
				 * @param array $link The link array
				 */
				$link_output = apply_filters( 'wpseo_breadcrumb_single_link', $link_output, $link );
				if ( is_string( $link_output ) && $link_output !== '' ) {
					$output .= $link_sep . $link_output;
				}
			}

			/**
			 * Filter: 'wpseo_breadcrumb_output_id' - Allow changing the HTML ID on the WP SEO breadcrumbs wrapper element
			 *
			 * @api string $unsigned ID to add to the wrapper element
			 */
			$id = apply_filters( 'wpseo_breadcrumb_output_id', '' );
			if ( is_string( $id ) && '' != $id ) {
				$id = ' id="' . esc_attr( $id ) . '"';
			}

			/**
			 * Filter: 'wpseo_breadcrumb_output_class' - Allow changing the HTML class on the WP SEO breadcrumbs wrapper element
			 *
			 * @api string $unsigned class to add to the wrapper element
			 */
			$class = apply_filters( 'wpseo_breadcrumb_output_class', '' );
			if ( is_string( $class ) && '' != $class ) {
				$class = ' class="' . esc_attr( $class ) . '"';
			}

			/**
			 * Filter: 'wpseo_breadcrumb_output_wrapper' - Allow changing the HTML wrapper element for the WP SEO breadcrumbs output
			 *
			 * @api string $wrapper The wrapper element
			 */
			$wrapper = apply_filters( 'wpseo_breadcrumb_output_wrapper', $wrapper );
			if ( ! is_string( $wrapper ) || '' == $wrapper ) {
				$wrapper = 'span';
			}

			/**
			 * Filter: 'wpseo_breadcrumb_output' - Allow changing the HTML output of the WP SEO breadcrumbs class
			 *
			 * @api string $unsigned HTML output
			 */
			return apply_filters( 'wpseo_breadcrumb_output', '<' . $wrapper . $id . $class . ' xmlns:v="http://rdf.data-vocabulary.org/#">' . $output . '</' . $wrapper . '>' );
		}

	} /* End of class */

} /* End of class-exists wrapper */
