<?php

/**
 * @package WPSEO\Frontend
 */

/**
 * Class that handles all canonical and related code for Yoast SEO.
 */
class WPSEO_Canonical {

	/**
	 * @var    object    Instance of this class.
	 */
	public static $instance;

	/**
	 * Holds the canonical URL for the current page.
	 *
	 * @var string
	 */
	private $canonical = null;

	/**
	 * Holds the canonical URL for the current page that cannot be overriden by a manual canonical input.
	 *
	 * @var string
	 */
	private $canonical_no_override = null;

	/**
	 * Holds the canonical URL for the current page without pagination.
	 *
	 * @var string
	 */
	private $canonical_unpaged = null;

	/**
	 * Holds the names of the required options.
	 *
	 * @var array
	 */
	private $required_options = array( 'wpseo', 'wpseo_rss', 'wpseo_social', 'wpseo_permalinks', 'wpseo_titles' );

	/**
	 * WPSEO_Canonical constructor
	 */
	protected function __construct() {
		$this->options = WPSEO_Options::get_options( $this->required_options );

		// Remove actions that we will handle through our wpseo_head call, and probably change the output of.
		remove_action( 'wp_head', 'rel_canonical' );
		remove_action( 'wp_head', 'index_rel_link' );
		remove_action( 'wp_head', 'start_post_rel_link' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );

		// Doesn't do output, but makes sure the canonical is generated.
		add_action( 'wpseo_head', array( $this, 'generate_canonical' ), 1 );
		add_action( 'wpseo_head', array( $this, 'canonical' ), 20 );
		add_action( 'wpseo_head', array( $this, 'adjacent_rel_links' ), 21 );
	}


	/**
	 * Get the singleton instance of this class.
	 *
	 * @return WPSEO_Frontend
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * This function normally outputs the canonical but is also used in other places to retrieve
	 * the canonical URL for the current page.
	 *
	 * @param bool $echo        Whether or not to output the canonical element.
	 * @param bool $un_paged    Whether or not to return the canonical with or without pagination added to the URL.
	 * @param bool $no_override Whether or not to return a manually overridden canonical.
	 *
	 * @return string $canonical
	 */
	public function canonical( $echo = true, $un_paged = false, $no_override = false ) {
		if ( is_null( $this->canonical ) ) {
			$this->generate_canonical();
		}

		$canonical = $this->canonical;

		if ( $un_paged ) {
			$canonical = $this->canonical_unpaged;
		}
		elseif ( $no_override ) {
			$canonical = $this->canonical_no_override;
		}

		if ( $echo === false ) {
			return $canonical;
		}

		if ( is_string( $canonical ) && '' !== $canonical ) {
			echo '<link rel="canonical" href="' . esc_url( $canonical, null, 'other' ) . '" />' . "\n";
		}
	}

	/**
	 * This function normally outputs the canonical but is also used in other places to retrieve
	 * the canonical URL for the current page.
	 *
	 * @return void
	 */
	private function generate_canonical() {
		$canonical          = false;
		$canonical_override = false;

		// Set decent canonicals for homepage, singulars and taxonomy pages.
		if ( is_singular() ) {
			$obj       = get_queried_object();
			$canonical = get_permalink( $obj->ID );

			$this->canonical_unpaged = $canonical;

			$canonical_override = WPSEO_Meta::get_value( 'canonical' );

			// Fix paginated pages canonical, but only if the page is truly paginated.
			if ( get_query_var( 'page' ) > 1 ) {
				$num_pages = ( substr_count( $obj->post_content, '<!--nextpage-->' ) + 1 );
				if ( $num_pages && get_query_var( 'page' ) <= $num_pages ) {
					if ( ! $GLOBALS['wp_rewrite']->using_permalinks() ) {
						$canonical = add_query_arg( 'page', get_query_var( 'page' ), $canonical );
					}
					else {
						$canonical = user_trailingslashit( trailingslashit( $canonical ) . get_query_var( 'page' ) );
					}
				}
			}
		}
		else {
			if ( is_search() ) {
				$search_query = get_search_query();

				// Regex catches case when /search/page/N without search term is itself mistaken for search term. R.
				if ( ! empty( $search_query ) && ! preg_match( '|^page/\d+$|', $search_query ) ) {
					$canonical = get_search_link();
				}
			}
			elseif ( is_front_page() ) {
				$canonical = WPSEO_Utils::home_url();
			}
			elseif ( $this->is_posts_page() ) {

				$posts_page_id = get_option( 'page_for_posts' );
				$canonical     = WPSEO_Meta::get_value( 'canonical', $posts_page_id );

				if ( empty( $canonical ) ) {
					$canonical = get_permalink( $posts_page_id );
				}
			}
			elseif ( is_tax() || is_tag() || is_category() ) {

				$term = get_queried_object();

				if ( ! empty( $term ) && ! $this->is_multiple_terms_query() ) {

					$canonical_override = WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'canonical' );
					$term_link          = get_term_link( $term, $term->taxonomy );

					if ( ! is_wp_error( $term_link ) ) {
						$canonical = $term_link;
					}
				}
			}
			elseif ( is_post_type_archive() ) {
				$post_type = get_query_var( 'post_type' );
				if ( is_array( $post_type ) ) {
					$post_type = reset( $post_type );
				}
				$canonical = get_post_type_archive_link( $post_type );
			}
			elseif ( is_author() ) {
				$canonical = get_author_posts_url( get_query_var( 'author' ), get_query_var( 'author_name' ) );
			}
			elseif ( is_archive() ) {
				if ( is_date() ) {
					if ( is_day() ) {
						$canonical = get_day_link( get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) );
					}
					elseif ( is_month() ) {
						$canonical = get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) );
					}
					elseif ( is_year() ) {
						$canonical = get_year_link( get_query_var( 'year' ) );
					}
				}
			}

			$this->canonical_unpaged = $canonical;

			if ( $canonical && get_query_var( 'paged' ) > 1 ) {
				global $wp_rewrite;
				if ( ! $wp_rewrite->using_permalinks() ) {
					if ( is_front_page() ) {
						$canonical = trailingslashit( $canonical );
					}
					$canonical = add_query_arg( 'paged', get_query_var( 'paged' ), $canonical );
				}
				else {
					if ( is_front_page() ) {
						$canonical = WPSEO_Sitemaps_Router::get_base_url( '' );
					}
					$canonical = user_trailingslashit( trailingslashit( $canonical ) . trailingslashit( $wp_rewrite->pagination_base ) . get_query_var( 'paged' ) );
				}
			}
		}

		$this->canonical_no_override = $canonical;

		if ( is_string( $canonical ) && $canonical !== '' ) {
			// Force canonical links to be absolute, relative is NOT an option.
			if ( WPSEO_Utils::is_url_relative( $canonical ) === true ) {
				$canonical = $this->base_url( $canonical );
			}
		}

		if ( is_string( $canonical_override ) && $canonical_override !== '' ) {
			$canonical = $canonical_override;
		}

		/**
		 * Filter: 'wpseo_canonical' - Allow filtering of the canonical URL put out by Yoast SEO.
		 *
		 * @api string $canonical The canonical URL.
		 */
		$this->canonical = apply_filters( 'wpseo_canonical', $canonical );
	}

	/**
	 * Parse the home URL setting to find the base URL for relative URLs.
	 *
	 * @param string $path Optional path string.
	 *
	 * @return string
	 */
	private function base_url( $path = null ) {
		$url = get_option( 'home' );

		$parts = wp_parse_url( $url );

		$base_url = trailingslashit( $parts['scheme'] . '://' . $parts['host'] );

		if ( ! is_null( $path ) ) {
			$base_url .= ltrim( $path, '/' );
		}

		return $base_url;
	}

	/**
	 * Adds 'prev' and 'next' links to archives.
	 *
	 * @link  http://googlewebmastercentral.blogspot.com/2011/09/pagination-with-relnext-and-relprev.html
	 * @since 1.0.3
	 */
	public function adjacent_rel_links() {
		// Don't do this for Genesis, as the way Genesis handles homepage functionality is different and causes issues sometimes.
		/**
		 * Filter 'wpseo_genesis_force_adjacent_rel_home' - Allows devs to allow echoing rel="next" / rel="prev" by Yoast SEO on Genesis installs.
		 *
		 * @api bool $unsigned Whether or not to rel=next / rel=prev .
		 */
		if ( is_home() && function_exists( 'genesis' ) && apply_filters( 'wpseo_genesis_force_adjacent_rel_home', false ) === false ) {
			return;
		}

		/**
		 * Filter: 'wpseo_disable_adjacent_rel_links' - Allows disabling of Yoast adjacent links if this is being handled by other code.
		 *
		 * @api bool $links_generated Indicates if other code has handled adjacent links.
		 */
		if ( true === apply_filters( 'wpseo_disable_adjacent_rel_links', false ) ) {
			return;
		}

		global $wp_query;

		if ( ! is_singular() ) {
			$url = $this->canonical( false, true, true );

			if ( is_string( $url ) && $url !== '' ) {
				$paged = get_query_var( 'paged' );

				if ( 0 === $paged ) {
					$paged = 1;
				}

				if ( $paged === 2 ) {
					$this->adjacent_rel_link( 'prev', $url, ( $paged - 1 ), true );
				}

				// Make sure to use index.php when needed, done after paged == 2 check so the prev links to homepage will not have index.php erroneously.
				if ( is_front_page() ) {
					$url = WPSEO_Sitemaps_Router::get_base_url( '' );
				}

				if ( $paged > 2 ) {
					$this->adjacent_rel_link( 'prev', $url, ( $paged - 1 ), true );
				}

				if ( $paged < $wp_query->max_num_pages ) {
					$this->adjacent_rel_link( 'next', $url, ( $paged + 1 ), true );
				}
			}
		}
		else {
			$numpages = 0;
			if ( isset( $wp_query->post->post_content ) ) {
				$numpages = ( substr_count( $wp_query->post->post_content, '<!--nextpage-->' ) + 1 );
			}
			if ( $numpages > 1 ) {
				$page = get_query_var( 'page' );
				if ( ! $page ) {
					$page = 1;
				}

				$url = get_permalink( $wp_query->post->ID );

				// If the current page is the frontpage, pagination should use /base/.
				if ( $this->is_home_static_page() ) {
					$usebase = true;
				}
				else {
					$usebase = false;
				}

				if ( $page > 1 ) {
					$this->adjacent_rel_link( 'prev', $url, ( $page - 1 ), $usebase, 'single_paged' );
				}
				if ( $page < $numpages ) {
					$this->adjacent_rel_link( 'next', $url, ( $page + 1 ), $usebase, 'single_paged' );
				}
			}
		}
	}

	/**
	 * Get adjacent pages link for archives.
	 *
	 * @since 1.0.2
	 *
	 * @param string  $rel                  Link relationship, prev or next.
	 * @param string  $url                  The un-paginated URL of the current archive.
	 * @param string  $page                 The page number to add on to $url for the $link tag.
	 * @param boolean $incl_pagination_base Whether or not to include /page/ or not.
	 *
	 * @return void
	 */
	private function adjacent_rel_link( $rel, $url, $page, $incl_pagination_base ) {
		global $wp_rewrite;
		if ( ! $wp_rewrite->using_permalinks() ) {
			if ( $page > 1 ) {
				$url = add_query_arg( 'paged', $page, $url );
			}
		}
		else {
			if ( $page > 1 ) {
				$base = '';
				if ( $incl_pagination_base ) {
					$base = trailingslashit( $wp_rewrite->pagination_base );
				}
				$url = user_trailingslashit( trailingslashit( $url ) . $base . $page );
			}
		}
		/**
		 * Filter: 'wpseo_' . $rel . '_rel_link' - Allow changing link rel output by Yoast SEO.
		 *
		 * @api string $unsigned The full `<link` element.
		 */
		$link = apply_filters( 'wpseo_' . $rel . '_rel_link', '<link rel="' . esc_attr( $rel ) . '" href="' . esc_url( $url ) . "\" />\n" );

		if ( is_string( $link ) && $link !== '' ) {
			echo $link;
		}
	}
}