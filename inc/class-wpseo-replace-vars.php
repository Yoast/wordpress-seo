<?php
/**
 * @package Internals
 */

// Avoid direct calls to this file
if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'WPSEO_Replace_Vars' ) ) {
	/**
	 * @package    WordPress\Plugins\WPSeo
	 * @subpackage Internals
	 * @since      1.5.4
	 * @version    1.5.4
	 *
	 */
	class WPSEO_Replace_Vars {

		/**
		 * @var  object  Instance of this class
		 */
		protected static $instance;
		
		/**
		 * @var	array
		 */
		protected $defaults = array(
			'ID'            => '',
			'name'          => '',
			'post_author'   => '',
			'post_content'  => '',
			'post_date'     => '',
			'post_excerpt'  => '',
			'post_modified' => '',
			'post_title'    => '',
			'taxonomy'      => '',
			'term_id'       => '',
			'term404'		=> '',
		);

		/**
		 * @var object
		 */
		protected $args;

		/**
		 * @var	array
		 */
		protected $help_texts = array();



		/**
		 *
		 * @return \WPSEO_Replace_Vars
		 */
		protected function __construct() {
			$this->set_basic_help_texts();
			$this->set_advanced_help_texts();
		}


		/**
		 * Get the singleton instance of this class
		 *
		 * @return object
		 */
		public static function get_instance() {
			if ( ! ( self::$instance instanceof self ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
		
		
		/**
		 * @param string $string the string to replace the variables in.
		 * @param array  $args   the object some of the replacement values might come from, could be a post, taxonomy or term.
		 * @param array  $omit   variables that should not be replaced by this function.
		 * @return string
		 */
		public function replace( $string, $args, $omit = array(), $final = false ) {
			$args = (array) $args;
		
			$string = strip_tags( $string );
		
			// Let's see if we can bail super early.
			if ( strpos( $string, '%%' ) === false ) {
				return trim( preg_replace( '`\s+`u', ' ', $string ) );
			}
			

			if ( isset( $args['post_content'] ) && ! empty( $args['post_content'] ) ) {
				$args['post_content'] = wpseo_strip_shortcode( $args['post_content'] );
			}
			if ( isset( $args['post_excerpt'] ) && ! empty( $args['post_excerpt'] ) ) {
				$args['post_excerpt'] = wpseo_strip_shortcode( $args['post_excerpt'] );
			}
		
			$this->args = (object) wp_parse_args( $args, $this->defaults );





		}

/**
 * @param string $string the string to replace the variables in.
 * @param array  $args   the object some of the replacement values might come from, could be a post, taxonomy or term.
 * @param array  $omit   variables that should not be replaced by this function.
 * @return string
 */
function wpseo_replace_vars( $string, $args, $omit = array() ) {
	
/*	$args = (array) $args;

	$string = strip_tags( $string );

	// Let's see if we can bail super early.
	if ( strpos( $string, '%%' ) === false ) {
		return trim( preg_replace( '`\s+`u', ' ', $string ) );
	}
*/
/*	global $sep;
	if ( ! isset( $sep ) || empty( $sep ) ) {
		$sep = '-';
	}
*/
/*	$simple_replacements = array(
		'%%sep%%'          => $sep,
		'%%sitename%%'     => get_bloginfo( 'name' ),
		'%%sitedesc%%'     => get_bloginfo( 'description' ),
		'%%currenttime%%'  => date_i18n( get_option( 'time_format' ) ),
		'%%currentdate%%'  => date_i18n( get_option( 'date_format' ) ),
		'%%currentday%%'   => date_i18n( 'j' ),
		'%%currentmonth%%' => date_i18n( 'F' ),
		'%%currentyear%%'  => date_i18n( 'Y' ),
	);

	$string = str_replace( array_keys( $simple_replacements ), array_values( $simple_replacements ), $string );
*/

	// Let's see if we can bail early.
/*	if ( strpos( $string, '%%' ) === false ) {
		return trim( preg_replace( '`\s+`u', ' ', $string ) );
	}
*/
	global $wp_query;

/*	$defaults = array(
		'ID'            => '',
		'name'          => '',
		'post_author'   => '',
		'post_content'  => '',
		'post_date'     => '',
		'post_excerpt'  => '',
		'post_modified' => '',
		'post_title'    => '',
		'taxonomy'      => '',
		'term_id'       => '',
		'term404'		=> '',
	);

	if ( isset( $args['post_content'] ) ) {
		$args['post_content'] = wpseo_strip_shortcode( $args['post_content'] );
	}
	if ( isset( $args['post_excerpt'] ) ) {
		$args['post_excerpt'] = wpseo_strip_shortcode( $args['post_excerpt'] );
	}

	$r = (object) wp_parse_args( $args, $defaults );
*/
	$max_num_pages = 1;
	if ( ! is_singular() ) {
		$pagenum = get_query_var( 'paged' );
		if ( $pagenum === 0 ) {
			$pagenum = 1;
		}

		if ( isset( $wp_query->max_num_pages ) && $wp_query->max_num_pages != '' && $wp_query->max_num_pages != 0 ) {
			$max_num_pages = $wp_query->max_num_pages;
		}
	}
	else {
		global $post;
		$pagenum       = get_query_var( 'page' );
		$max_num_pages = ( isset( $post->post_content ) ) ? substr_count( $post->post_content, '<!--nextpage-->' ) : 1;
		if ( $max_num_pages >= 1 ) {
			$max_num_pages++;
		}
	}

	// Let's do date first as it's a bit more work to get right.
/*	if ( $r->post_date != '' ) {
		$date = mysql2date( get_option( 'date_format' ), $r->post_date, true );
	}
	else {
		if ( get_query_var( 'day' ) && get_query_var( 'day' ) != '' ) {
			$date = get_the_date();
		}
		else {
			if ( single_month_title( ' ', false ) && single_month_title( ' ', false ) != '' ) {
				$date = single_month_title( ' ', false );
			}
			elseif ( get_query_var( 'year' ) != '' ) {
				$date = get_query_var( 'year' );
			}
			else {
				$date = '';
			}
		}
	}
*/
	$replacements = array(
//		'%%date%%'         => $date,
//		'%%searchphrase%%' => esc_html( get_query_var( 's' ) ),
		'%%page%%'         => ( $max_num_pages > 1 && $pagenum > 1 ) ? sprintf( $sep . ' ' . __( 'Page %d of %d', 'wordpress-seo' ), $pagenum, $max_num_pages ) : '',
		'%%pagetotal%%'    => $max_num_pages,
		'%%pagenumber%%'   => $pagenum,
//		'%%term404%%'	   => sanitize_text_field( str_replace( '-', ' ', $r->term404 ) ),
//		'%%name%%'         => get_the_author_meta( 'display_name', ! empty( $r->post_author ) ? $r->post_author : get_query_var( 'author' ) ),
//		'%%userid%%'       => ! empty( $r->post_author ) ? $r->post_author : get_query_var( 'author' ),

	);

	if ( ! empty( $r->ID ) ) {
		$replacements = array_merge(
			$replacements, array(
				'%%caption%%'      => $r->post_excerpt,
				'%%category%%'     => $this->get_terms( $r->ID, 'category' ),
				'%%excerpt%%'      => ( ! empty( $r->post_excerpt ) ) ? strip_tags( $r->post_excerpt ) : wp_html_excerpt( strip_shortcodes( $r->post_content ),155 ),
				'%%excerpt_only%%' => strip_tags( $r->post_excerpt ),
				'%%focuskw%%'      => WPSEO_Meta::get_value( 'focuskw', $r->ID ),
				'%%id%%'           => $r->ID,
				'%%title%%'        => stripslashes( $r->post_title ),
			)
		);
	}

	// Support %%tag%% even if the ID is empty
	if ( isset( $r->ID ) ) {
		$replacements = array_merge(
			$replacements, array(
				'%%tag%%' => $this->get_terms( $r->ID, 'post_tag' ),
			)
		);
	}
	
	if ( ! empty( $r->post_modified ) ) {
		$replacements = array_merge(
			$replacements, array(
				'%%modified%%'     => mysql2date( get_option( 'date_format' ), $r->post_modified, true ),
			)
		);
	}
	

	if ( isset( $r->cat_name ) && ! empty( $r->cat_name ) ) {
		$replacements = array_merge(
			$replacements, array( '%%category%%' => $r->cat_name )
		);
	}

	if ( ! empty( $r->taxonomy ) ) {
		$replacements = array_merge(
			$replacements, array(
				'%%category_description%%' => trim( strip_tags( get_term_field( 'description', $r->term_id, $r->taxonomy ) ) ),
				'%%tag_description%%'      => trim( strip_tags( get_term_field( 'description', $r->term_id, $r->taxonomy ) ) ),
				'%%term_description%%'     => trim( strip_tags( get_term_field( 'description', $r->term_id, $r->taxonomy ) ) ),
				'%%term_title%%'           => $r->name,
			)
		);
	}

	/**
	* Filter: 'wpseo_replacements' - Allow customization of the replacements before they are applied
	*
	* @api array $replacements The replacements
	*/
	$replacements = apply_filters( 'wpseo_replacements', $replacements );

	foreach ( $replacements as $var => $repl ) {
		if ( ! in_array( $var, $omit ) ) {
			$string = str_replace( $var, $repl, $string );
		}
	}

	if ( strpos( $string, '%%' ) === false ) {
		$string = preg_replace( '`\s+`u', ' ', $string );
		return trim( $string );
	}

	if ( isset( $wp_query->query_vars['post_type'] ) && preg_match_all( '`%%pt_([^%]+)%%`u', $string, $matches, PREG_SET_ORDER ) ) {
		$post_type = $wp_query->query_vars['post_type'];

		if ( is_array( $post_type ) ) {
			$post_type = reset( $post_type );
		}

		$pt        = get_post_type_object( $post_type );
		$pt_plural = $pt_singular = $pt->name;
		if ( isset( $pt->labels->singular_name ) ) {
			$pt_singular = $pt->labels->singular_name;
		}
		if ( isset( $pt->labels->name ) ) {
			$pt_plural = $pt->labels->name;
		}
		$string = str_replace( '%%pt_single%%', $pt_singular, $string );
		$string = str_replace( '%%pt_plural%%', $pt_plural, $string );
	}

	if ( ( is_singular() || is_admin() ) && preg_match_all( '`%%cf_([^%]+)%%`u', $string, $matches, PREG_SET_ORDER ) ) {
		global $post;
		if( is_object( $post ) && isset( $post->ID ) ) {
			foreach ( $matches as $match ) {
				$string = str_replace( $match[0], get_post_meta( $post->ID, $match[1], true ), $string );
			}
		}
	}

	if ( ( is_singular() || is_admin() ) && false !== strpos( $string, '%%parent_title%%' ) ) {
		global $post;
		if ( isset( $post->post_parent ) && 0 != $post->post_parent ) {
			$parent_title = get_the_title( $post->post_parent );
			$string = str_replace( '%%parent_title%%', $parent_title, $string );
		}
	}

	if ( preg_match_all( '`%%ct_desc_([^%]+)?%%`u', $string, $matches, PREG_SET_ORDER ) ) {
		global $post;
		foreach ( $matches as $match ) {
			$terms = get_the_terms( $post->ID, $match[1] );
			if ( is_array( $terms ) && $terms !== array() ) {
				$term   = current( $terms );
				$string = str_replace( $match[0], get_term_field( 'description', $term->term_id, $match[1] ), $string );
			}
			else {
				// Make sure that the variable is removed ?
				$string = str_replace( $match[0], '', $string );

				/* Check for WP_Error object (=invalid taxonomy entered) and if it's an error,
				 notify in admin dashboard */
				if ( is_wp_error( $terms ) && is_admin() ) {
					add_action( 'admin_notices', 'wpseo_invalid_custom_taxonomy' );
				}
			}
		}
	}

	if ( preg_match_all( '`%%ct_([^%]+)%%(single%%)?`u', $string, $matches, PREG_SET_ORDER ) ) {
		foreach ( $matches as $match ) {
			$single = false;
			if ( isset( $match[2] ) && $match[2] == 'single%%' ) {
				$single = true;
			}
			$ct_terms = $this->get_terms( $r->ID, $match[1], $single );

			$string = str_replace( $match[0], $ct_terms, $string );
		}
	}

	$string = preg_replace( '`\s+`u', ' ', $string );
	return trim( $string );
}


		/* *********************** BASIC VARIABLES ************************** */

		/**
		 * Retrieve the date of the post/page/cpt for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_date() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				if ( $this->args->post_date != '' ) {
					$replacement = mysql2date( get_option( 'date_format' ), $this->args->post_date, true );
				}
				else {
					if ( get_query_var( 'day' ) && get_query_var( 'day' ) != '' ) {
						$replacement = get_the_date();
					}
					else {
						if ( single_month_title( ' ', false ) && single_month_title( ' ', false ) != '' ) {
							$replacement = single_month_title( ' ', false );
						}
						elseif ( get_query_var( 'year' ) != '' ) {
							$replacement = get_query_var( 'year' );
						}
						else {
							$replacement = '';
						}
					}
				}
			}

			return $replacement;
		}

		/**
		 * Retrieve the title of the post/page/cpt for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_title() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the title of the parent page of the current page/cpt for use as replacement string.
		 * Only applicable for hierarchical post types.
		 *
		 * @return string
		 */
		private function retrieve_parent_title() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the site's name for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_sitename() {
			static $replacement;
			
			if( ! isset( $replacement ) ) {
				$replacement = get_bloginfo( 'name' );
			}

			return $replacement;
		}

		/**
		 * Retrieve the site's tagline / description for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_sitedesc() {
			static $replacement;
			
			if( ! isset( $replacement ) ) {
				$replacement = get_bloginfo( 'description' );
			}

			return $replacement;
		}

		/**
		 * Retrieve the post/page/cpt excerpt for use as replacement string.
		 * The excerpt will be auto-generated if it does not exist.
		 *
		 * @return string
		 */
		private function retrieve_excerpt() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the post/page/cpt excerpt for use as replacement string (without auto-generation).
		 *
		 * @return string
		 */
		private function retrieve_excerpt_only() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the current tag/tags for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_tag() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the post/cpt categories (comma separated) for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_category() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the category description for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_category_description() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the tag description for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_tag_description() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the term description for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_term_description() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the term name for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_term_title() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the current search phrase for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_searchphrase() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = esc_html( get_query_var( 's' ) );
			}

			return $replacement;
		}

		/**
		 * Retrieve he separator defined in your theme's <code>wp_title()</code> tag for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_sep() {
			static $replacement;
			
			if ( ! isset( $replacement ) ) {
				$replacement = '-';
				if ( isset( $GLOBALS['sep'] ) && is_string( $GLOBALS['sep'] ) && $GLOBALS['sep'] !== '' ) {
					$replacement = $GLOBALS['sep'];
				}
			}

			return $replacement;
		}


		/* *********************** ADVANCED VARIABLES ************************** */

		/**
		 * Retrieve the post type single label for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_pt_single() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the post type plural label for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_pt_plural() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the post/page/cpt modified time for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_modified() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the post/page/cpt ID for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_id() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the post/page/cpt author's "nicename" for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_name() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = get_the_author_meta( 'display_name', ! empty( $this->args->post_author ) ? $this->args->post_author : get_query_var( 'author' ) );
			}

			return $replacement;
		}

		/**
		 * Retrieve the post/page/cpt author's userid for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_userid() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ! empty( $this->args->post_author ) ? $this->args->post_author : get_query_var( 'author' );
			}

			return $replacement;
		}

		/**
		 * Retrieve the current time for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_currenttime() {
			static $replacement;
			
			if( ! isset( $replacement ) ) {
				$replacement = date_i18n( get_option( 'time_format' ) );
			}

			return $replacement;
		}

		/**
		 * Retrieve the current date for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_currentdate() {
			static $replacement;
			
			if( ! isset( $replacement ) ) {
				$replacement = date_i18n( get_option( 'date_format' ) );
			}

			return $replacement;
		}

		/**
		 * Retrieve the current day for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_currentday() {
			static $replacement;
			
			if( ! isset( $replacement ) ) {
				$replacement = date_i18n( 'j' );
			}

			return $replacement;
		}

		/**
		 * Retrieve the current month for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_currentmonth() {
			static $replacement;
			
			if( ! isset( $replacement ) ) {
				$replacement = date_i18n( 'F' );
			}

			return $replacement;
		}

		/**
		 * Retrieve the current year for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_currentyear() {
			static $replacement;
			
			if( ! isset( $replacement ) ) {
				$replacement = date_i18n( 'Y' );
			}

			return $replacement;
		}

		/**
		 * Retrieve the current page number (i.e. page 2 of 4) for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_page() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the current page total for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_pagetotal() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the current page number for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_pagenumber() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the attachment caption for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_caption() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the post/page/cpt's focus keyword for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_focuskw() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve the slug which caused the 404 for use as replacement string.
		 *
		 * @return string
		 */
		private function retrieve_term404() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = sanitize_text_field( str_replace( '-', ' ', $this->args->term404 ) );
			}

			return $replacement;
		}

		/**
		 * Retrieve a post/page/cpt's custom field value for use as replacement string
		 *
		 * @return string
		 */
		private function retrieve_cf_custom_field_name() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve a post/page/cpt's custom taxonomies for use as replacement string
		 *
		 * @return string
		 */
		private function retrieve_ct_custom_tax_name() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}

		/**
		 * Retrieve a post/page/cpt's custom taxonomies description for use as replacement string
		 *
		 * @return string
		 */
		private function retrieve_ct_desc_custom_tax_name() {
			static $replacement;

			if( ! isset( $replacement ) ) {
				$replacement = ''; //...tbd...
			}

			return $replacement;
		}



		/* *********************** HELP TEXT RELATED ************************** */

		/**
		 * Set/translate the help texts for the WPSEO standard basic variables.
		 */
		private function set_basic_help_texts() {
			$this->help_texts['basic'] = array(
				'date'                 => __( 'Replaced with the date of the post/page', 'wordpress-seo' ),
				'title'                => __( 'Replaced with the title of the post/page', 'wordpress-seo' ),
				'parent_title'         => __( 'Replaced with the title of the parent page of the current page', 'wordpress-seo' ),
				'sitename'             => __( 'The site\'s name', 'wordpress-seo' ),
				'sitedesc'             => __( 'The site\'s tagline / description', 'wordpress-seo' ),
				'excerpt'              => __( 'Replaced with the post/page excerpt (or auto-generated if it does not exist)', 'wordpress-seo' ),
				'excerpt_only'         => __( 'Replaced with the post/page excerpt (without auto-generation)', 'wordpress-seo' ),
				'tag'                  => __( 'Replaced with the current tag/tags', 'wordpress-seo' ),
				'category'             => __( 'Replaced with the post categories (comma separated)', 'wordpress-seo' ),
				'category_description' => __( 'Replaced with the category description', 'wordpress-seo' ),
				'tag_description'      => __( 'Replaced with the tag description', 'wordpress-seo' ),
				'term_description'     => __( 'Replaced with the term description', 'wordpress-seo' ),
				'term_title'           => __( 'Replaced with the term name', 'wordpress-seo' ),
				'searchphrase'         => __( 'Replaced with the current search phrase', 'wordpress-seo' ),
				'sep'                  => __( 'The separator defined in your theme\'s <code>wp_title()</code> tag.', 'wordpress-seo' ),
			);
		}
		
		/**
		 * Set/translate the help texts for the WPSEO standard advanced variables.
		 */
		private function set_advanced_help_texts() {
			$this->help_texts['advanced'] = array(
				'pt_single'                 => __( 'Replaced with the post type single label', 'wordpress-seo' ),
				'pt_plural'                 => __( 'Replaced with the post type plural label', 'wordpress-seo' ),
				'modified'                  => __( 'Replaced with the post/page modified time', 'wordpress-seo' ),
				'id'                        => __( 'Replaced with the post/page ID', 'wordpress-seo' ),
				'name'                      => __( 'Replaced with the post/page author\'s \'nicename\'', 'wordpress-seo' ),
				'userid'                    => __( 'Replaced with the post/page author\'s userid', 'wordpress-seo' ),
				'currenttime'               => __( 'Replaced with the current time', 'wordpress-seo' ),
				'currentdate'               => __( 'Replaced with the current date', 'wordpress-seo' ),
				'currentday'                => __( 'Replaced with the current day', 'wordpress-seo' ),
				'currentmonth'              => __( 'Replaced with the current month', 'wordpress-seo' ),
				'currentyear'               => __( 'Replaced with the current year', 'wordpress-seo' ),
				'page'                      => __( 'Replaced with the current page number (i.e. page 2 of 4)', 'wordpress-seo' ),
				'pagetotal'                 => __( 'Replaced with the current page total', 'wordpress-seo' ),
				'pagenumber'                => __( 'Replaced with the current page number', 'wordpress-seo' ),
				'caption'                   => __( 'Attachment caption', 'wordpress-seo' ),
				'focuskw'                   => __( 'Replaced with the posts focus keyword', 'wordpress-seo' ),
				'term404'                   => __( 'Replaced with the slug which caused the 404', 'wordpress-seo' ),
				'cf_<custom-field-name>'    => __( 'Replaced with a posts custom field value', 'wordpress-seo' ),
				'ct_<custom-tax-name>'      => __( 'Replaced with a posts custom taxonomies, comma separated.', 'wordpress-seo' ),
				'ct_desc_<custom-tax-name>' => __( 'Replaced with a custom taxonomies description', 'wordpress-seo' ),
			);
		}


		/**
		 * Set the help text for a user/plugin defined extra variable.
		 *
		 * @param        $type
		 * @param        $replace
		 * @param string $help_text
		 */
		public function register_help_text( $type, $replace, $help_text = '' ) {
			if ( is_string( $replace ) && $replace !== '' ) {
				$replace = trim( $replace, '%' );
				
				if ( ( is_string( $type ) && in_array( $type, array( 'basic', 'advanced' ), true ) ) && ( $replace !== '' && ! isset( $this->help_texts[$type][$replace] ) ) ) {
					$this->help_texts[$type][$replace] = $help_text;
				}
			}
		}


		/**
		 * Create the help text table for the basic variables for use in a help tab
		 *
		 * @return string
		 */
		protected function get_basic_help_texts() {
			return $this->create_variable_help_table( 'basic' );
		}


		/**
		 * Create the help text table for the advanced variables for use in a help tab
		 *
		 * @return string
		 */
		protected function get_advanced_help_texts() {
			return $this->create_variable_help_table( 'advanced' );
		}


		/**
		 * Create a variable help text table
		 *
		 * @param	string	$type	Either 'basic' or 'advanced'
		 *
		 * @return	string			Help text table
		 */
		private function create_variable_help_table( $type ) {
			if ( ! in_array( $type, array( 'basic', 'advanced' ), true ) ) {
				return '';
			}

			$table = '
			<table class="yoast_help">';

			foreach ( $this->help_texts[$type] as $replace => $help_text ) {
				$table .= '
				<tr>
					<th>%%' . esc_html( $replace ) . '%%</th>
					<td>' . $help_text . '</td>
				</tr>';
			}

			$table .= '
			</table>';

			return $table;
		}


		/**
		 * Throw a notice about an invalid custom taxonomy used
		 *
		 * @since 1.4.14
		 */
		public function notify_invalid_custom_taxonomy() {
			echo '<div class="error"><p>' . sprintf( __( 'The taxonomy you used in (one of your) %s variables is <strong>invalid</strong>. Please %sadjust your settings%s.' ), '%%ct_desc_&lt;custom-tax-name&gt;%%', '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_titles#top#taxonomies' ) ) . '">', '</a>' ) . '</p></div>';
		}

		
		/**
		 * Retrieve a post's terms, comma delimited.
		 *
		 * @param int    $id            ID of the post to get the terms for.
		 * @param string $taxonomy      The taxonomy to get the terms for this post from.
		 * @param bool   $return_single If true, return the first term.
		 * @return string either a single term or a comma delimited string of terms.
		 */
		public function get_terms( $id, $taxonomy, $return_single = false ) {
		
			$output = '';
		
			// If we're on a specific tag, category or taxonomy page, use that.
			if ( is_category() || is_tag() || is_tax() ) {
				global $wp_query;
				$term   = $wp_query->get_queried_object();
				$output = $term->name;
			}
			elseif ( ! empty( $id ) && ! empty( $taxonomy ) ) {
				$terms = get_the_terms( $id, $taxonomy );
				if ( is_array( $terms ) && $terms !== array() ) {
					foreach ( $terms as $term ) {
						if ( $return_single ) {
							$output = $term->name;
							break;
						}
						else {
							$output .= $term->name . ', ';
						}
					}
					$output = rtrim( trim( $output ), ',' );
				}
			}
			/**
			 * Allows filtering of the terms list used to replace %%category%%, %%tag%% and %%ct_<custom-tax-name>%% variables
			 * @api	string	$output	Comma-delimited string containing the terms
			 */
			return apply_filters( 'wpseo_terms', $output );
		}

	} /* End of class WPSEO_Replace_Vars */

} /* End of class-exists wrapper */
