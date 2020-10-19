<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 * @since   1.5.4
 */

// Avoid direct calls to this file.
if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Class: WPSEO_Replace_Vars.
 *
 * This class implements the replacing of `%%variable_placeholders%%` with their real value based on the current
 * requested page/post/cpt/etc in text strings.
 */
class WPSEO_Replace_Vars {

	/**
	 * Default post/page/cpt information.
	 *
	 * @var array
	 */
	protected $defaults = [
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
		'term404'       => '',
	];

	/**
	 * Current post/page/cpt information.
	 *
	 * @var object
	 */
	protected $args;

	/**
	 * The date helper.
	 *
	 * @var WPSEO_Date_Helper
	 */
	protected $date;

	/**
	 * Help texts for use in WPSEO -> Search appearance tabs.
	 *
	 * @var array
	 */
	protected static $help_texts = [];

	/**
	 * Register of additional variable replacements registered by other plugins/themes.
	 *
	 * @var array
	 */
	protected static $external_replacements = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->date = new WPSEO_Date_Helper();
	}

	/**
	 * Setup the help texts and external replacements as statics so they will be available to all instances.
	 */
	public static function setup_statics_once() {
		if ( self::$help_texts === [] ) {
			self::set_basic_help_texts();
			self::set_advanced_help_texts();
		}

		if ( self::$external_replacements === [] ) {
			/**
			 * Action: 'wpseo_register_extra_replacements' - Allows for registration of additional
			 * variables to replace.
			 */
			do_action( 'wpseo_register_extra_replacements' );
		}
	}

	/**
	 * Register new replacement %%variables%%.
	 * For use by other plugins/themes to register extra variables.
	 *
	 * @see wpseo_register_var_replacement() for a usage example.
	 *
	 * @param string $var              The name of the variable to replace, i.e. '%%var%%'.
	 *                                 Note: the surrounding %% are optional.
	 * @param mixed  $replace_function Function or method to call to retrieve the replacement value for the variable.
	 *                                 Uses the same format as add_filter/add_action function parameter and
	 *                                 should *return* the replacement value. DON'T echo it.
	 * @param string $type             Type of variable: 'basic' or 'advanced', defaults to 'advanced'.
	 * @param string $help_text        Help text to be added to the help tab for this variable.
	 *
	 * @return bool Whether the replacement function was succesfully registered.
	 */
	public static function register_replacement( $var, $replace_function, $type = 'advanced', $help_text = '' ) {
		$success = false;

		if ( is_string( $var ) && $var !== '' ) {
			$var = self::remove_var_delimiter( $var );

			if ( preg_match( '`^[A-Z0-9_-]+$`i', $var ) === false ) {
				trigger_error( esc_html__( 'A replacement variable can only contain alphanumeric characters, an underscore or a dash. Try renaming your variable.', 'wordpress-seo' ), E_USER_WARNING );
			}
			elseif ( strpos( $var, 'cf_' ) === 0 || strpos( $var, 'ct_' ) === 0 ) {
				trigger_error( esc_html__( 'A replacement variable can not start with "%%cf_" or "%%ct_" as these are reserved for the WPSEO standard variable variables for custom fields and custom taxonomies. Try making your variable name unique.', 'wordpress-seo' ), E_USER_WARNING );
			}
			elseif ( ! method_exists( __CLASS__, 'retrieve_' . $var ) ) {
				if ( $var !== '' && ! isset( self::$external_replacements[ $var ] ) ) {
					self::$external_replacements[ $var ] = $replace_function;
					$replacement_variable                = new WPSEO_Replacement_Variable( $var, $var, $help_text );
					self::register_help_text( $type, $replacement_variable );
					$success = true;
				}
				else {
					trigger_error( esc_html__( 'A replacement variable with the same name has already been registered. Try making your variable name unique.', 'wordpress-seo' ), E_USER_WARNING );
				}
			}
			else {
				trigger_error( esc_html__( 'You cannot overrule a WPSEO standard variable replacement by registering a variable with the same name. Use the "wpseo_replacements" filter instead to adjust the replacement value.', 'wordpress-seo' ), E_USER_WARNING );
			}
		}

		return $success;
	}

	/**
	 * Replace `%%variable_placeholders%%` with their real value based on the current requested page/post/cpt/etc.
	 *
	 * @param string $string The string to replace the variables in.
	 * @param array  $args   The object some of the replacement values might come from,
	 *                       could be a post, taxonomy or term.
	 * @param array  $omit   Variables that should not be replaced by this function.
	 *
	 * @return string
	 */
	public function replace( $string, $args, $omit = [] ) {

		$string = wp_strip_all_tags( $string );

		// Let's see if we can bail super early.
		if ( strpos( $string, '%%' ) === false ) {
			return YoastSEO()->helpers->string->standardize_whitespace( $string );
		}

		$args = (array) $args;
		if ( isset( $args['post_content'] ) && ! empty( $args['post_content'] ) ) {
			$args['post_content'] = YoastSEO()->helpers->string->strip_shortcode( $args['post_content'] );
		}
		if ( isset( $args['post_excerpt'] ) && ! empty( $args['post_excerpt'] ) ) {
			$args['post_excerpt'] = YoastSEO()->helpers->string->strip_shortcode( $args['post_excerpt'] );
		}
		$this->args = (object) wp_parse_args( $args, $this->defaults );

		// Clean $omit array.
		if ( is_array( $omit ) && $omit !== [] ) {
			$omit = array_map( [ __CLASS__, 'remove_var_delimiter' ], $omit );
		}

		$replacements = [];
		if ( preg_match_all( '`%%([^%]+(%%single)?)%%?`iu', $string, $matches ) ) {
			$replacements = $this->set_up_replacements( $matches, $omit );
		}

		/**
		 * Filter: 'wpseo_replacements' - Allow customization of the replacements before they are applied.
		 *
		 * @api     array   $replacements The replacements.
		 *
		 * @param array $args The object some of the replacement values might come from,
		 *                    could be a post, taxonomy or term.
		 */
		$replacements = apply_filters( 'wpseo_replacements', $replacements, $this->args );

		// Do the actual replacements.
		if ( is_array( $replacements ) && $replacements !== [] ) {
			$string = str_replace(
				array_keys( $replacements ),
				// Make sure to exclude replacement values that are arrays e.g. coming from a custom field serialized value.
				array_filter( array_values( $replacements ), 'is_scalar' ),
				$string
			);
		}

		/**
		 * Filter: 'wpseo_replacements_final' - Allow overruling of whether or not to remove placeholders
		 * which didn't yield a replacement.
		 *
		 * @example <code>add_filter( 'wpseo_replacements_final', '__return_false' );</code>
		 *
		 * @api     bool $final
		 */
		if ( apply_filters( 'wpseo_replacements_final', true ) === true && ( isset( $matches[1] ) && is_array( $matches[1] ) ) ) {
			// Remove non-replaced variables.
			$remove = array_diff( $matches[1], $omit ); // Make sure the $omit variables do not get removed.
			$remove = array_map( [ __CLASS__, 'add_var_delimiter' ], $remove );
			$string = str_replace( $remove, '', $string );
		}

		// Undouble separators which have nothing between them, i.e. where a non-replaced variable was removed.
		if ( isset( $replacements['%%sep%%'] ) && ( is_string( $replacements['%%sep%%'] ) && $replacements['%%sep%%'] !== '' ) ) {
			$q_sep  = preg_quote( $replacements['%%sep%%'], '`' );
			$string = preg_replace( '`' . $q_sep . '(?:\s*' . $q_sep . ')*`u', $replacements['%%sep%%'], $string );
		}

		// Remove superfluous whitespace.
		$string = YoastSEO()->helpers->string->standardize_whitespace( $string );

		return $string;
	}

	/**
	 * Retrieve the replacements for the variables found.
	 *
	 * @param array $matches Variables found in the original string - regex result.
	 * @param array $omit    Variables that should not be replaced by this function.
	 *
	 * @return array Retrieved replacements - this might be a smaller array as some variables
	 *               may not yield a replacement in certain contexts.
	 */
	private function set_up_replacements( $matches, $omit ) {

		$replacements = [];

		// @todo Figure out a way to deal with external functions starting with cf_/ct_.
		foreach ( $matches[1] as $k => $var ) {

			// Don't set up replacements which should be omitted.
			if ( in_array( $var, $omit, true ) ) {
				continue;
			}

			// Deal with variable variable names first.
			if ( strpos( $var, 'cf_' ) === 0 ) {
				$replacement = $this->retrieve_cf_custom_field_name( $var );
			}
			elseif ( strpos( $var, 'ct_desc_' ) === 0 ) {
				$replacement = $this->retrieve_ct_desc_custom_tax_name( $var );
			}
			elseif ( strpos( $var, 'ct_' ) === 0 ) {
				$single      = ( isset( $matches[2][ $k ] ) && $matches[2][ $k ] !== '' ) ? true : false;
				$replacement = $this->retrieve_ct_custom_tax_name( $var, $single );
			} // Deal with non-variable variable names.
			elseif ( method_exists( $this, 'retrieve_' . $var ) ) {
				$method_name = 'retrieve_' . $var;
				$replacement = $this->$method_name();
			} // Deal with externally defined variable names.
			elseif ( isset( self::$external_replacements[ $var ] ) && ! is_null( self::$external_replacements[ $var ] ) ) {
				$replacement = call_user_func( self::$external_replacements[ $var ], $var, $this->args );
			}

			// Replacement retrievals can return null if no replacement can be determined, root those outs.
			if ( isset( $replacement ) ) {
				$var                  = self::add_var_delimiter( $var );
				$replacements[ $var ] = $replacement;
			}
			unset( $replacement, $single, $method_name );
		}

		return $replacements;
	}

	/**
	 * Retrieve the separator for use as replacement string.
	 *
	 * @return string
	 */
	private function retrieve_sep() {
		$replacement = WPSEO_Options::get_default( 'wpseo_titles', 'separator' );

		// Get the titles option and the separator options.
		$separator         = WPSEO_Options::get( 'separator' );
		$seperator_options = WPSEO_Option_Titles::get_instance()->get_separator_options();

		// This should always be set, but just to be sure.
		if ( isset( $seperator_options[ $separator ] ) ) {
			// Set the new replacement.
			$replacement = $seperator_options[ $separator ];
		}

		/**
		 * Filter: 'wpseo_replacements_filter_sep' - Allow customization of the separator character(s).
		 *
		 * @api string $replacement The current separator.
		 */
		return apply_filters( 'wpseo_replacements_filter_sep', $replacement );
	}

	/* *********************** ADVANCED VARIABLES ************************** */

	/**
	 * Determine the page numbering of the current post/page/cpt.
	 *
	 * @param string $request Either 'nr'|'max' - whether to return the page number or the max number of pages.
	 *
	 * @return int|null
	 */
	private function determine_pagenumbering( $request = 'nr' ) {
		global $wp_query, $post;
		$max_num_pages = null;
		$page_number   = null;

		$max_num_pages = 1;

		if ( ! is_singular() ) {
			$page_number = get_query_var( 'paged' );
			if ( $page_number === 0 || $page_number === '' ) {
				$page_number = 1;
			}

			if ( ! empty( $wp_query->max_num_pages ) ) {
				$max_num_pages = $wp_query->max_num_pages;
			}
		}
		else {
			$page_number = get_query_var( 'page' );
			if ( $page_number === 0 || $page_number === '' ) {
				$page_number = 1;
			}

			if ( isset( $post->post_content ) ) {
				$max_num_pages = ( substr_count( $post->post_content, '<!--nextpage-->' ) + 1 );
			}
		}

		$return = null;

		switch ( $request ) {
			case 'nr':
				$return = $page_number;
				break;
			case 'max':
				$return = $max_num_pages;
				break;
		}

		return $return;
	}

	/**
	 * Determine the post type names for the current post/page/cpt.
	 *
	 * @param string $request Either 'single'|'plural' - whether to return the single or plural form.
	 *
	 * @return string|null
	 */
	private function determine_pt_names( $request = 'single' ) {
		global $wp_query;
		$pt_single = null;
		$pt_plural = null;
		$post_type = '';

		if ( isset( $wp_query->query_vars['post_type'] ) && ( ( is_string( $wp_query->query_vars['post_type'] ) && $wp_query->query_vars['post_type'] !== '' ) || ( is_array( $wp_query->query_vars['post_type'] ) && $wp_query->query_vars['post_type'] !== [] ) ) ) {
			$post_type = $wp_query->query_vars['post_type'];
		}
		elseif ( isset( $this->args->post_type ) && ( is_string( $this->args->post_type ) && $this->args->post_type !== '' ) ) {
			$post_type = $this->args->post_type;
		}
		else {
			// Make it work in preview mode.
			$post = $wp_query->get_queried_object();
			if ( $post instanceof WP_Post ) {
				$post_type = $post->post_type;
			}
		}

		if ( is_array( $post_type ) ) {
			$post_type = reset( $post_type );
		}

		if ( $post_type !== '' ) {
			$pt        = get_post_type_object( $post_type );
			$pt_single = $pt->name;
			$pt_plural = $pt->name;
			if ( isset( $pt->labels->singular_name ) ) {
				$pt_single = $pt->labels->singular_name;
			}
			if ( isset( $pt->labels->name ) ) {
				$pt_plural = $pt->labels->name;
			}
		}

		$return = null;

		switch ( $request ) {
			case 'single':
				$return = $pt_single;
				break;
			case 'plural':
				$return = $pt_plural;
				break;
		}

		return $return;
	}

	/**
	 * Retrieve a post/page/cpt's custom field value for use as replacement string.
	 *
	 * @param string $var The complete variable to replace which includes the name of
	 *                    the custom field which value is to be retrieved.
	 *
	 * @return string|null
	 */
	private function retrieve_cf_custom_field_name( $var ) {
		global $post;
		$replacement = null;

		if ( is_string( $var ) && $var !== '' ) {
			$field = substr( $var, 3 );
			if ( ( is_singular() || is_admin() ) && ( is_object( $post ) && isset( $post->ID ) ) ) {
				// Post meta can be arrays and in this case we need to exclude them.
				$name = get_post_meta( $post->ID, $field, true );
				if ( $name !== '' && ! is_array( $name ) ) {
					$replacement = $name;
				}
			}
			elseif ( is_category() || is_tag() || is_tax() ) {
				$term = $GLOBALS['wp_query']->get_queried_object();
				$name = get_term_meta( $term->term_id, $field, true );
				if ( $name !== '' ) {
					$replacement = $name;
				}
			}
		}

		return $replacement;
	}

	/**
	 * Retrieve a post/page/cpt's custom taxonomies for use as replacement string.
	 *
	 * @param string $var    The complete variable to replace which includes the name of
	 *                       the custom taxonomy which value(s) is to be retrieved.
	 * @param bool   $single Whether to retrieve only the first or all values for the taxonomy.
	 *
	 * @return string|null
	 */
	private function retrieve_ct_custom_tax_name( $var, $single = false ) {
		$replacement = null;

		if ( ( is_string( $var ) && $var !== '' ) && ! empty( $this->args->ID ) ) {
			$tax  = substr( $var, 3 );
			$name = $this->get_terms( $this->args->ID, $tax, $single );
			if ( $name !== '' ) {
				$replacement = $name;
			}
		}

		return $replacement;
	}

	/**
	 * Retrieve a post/page/cpt's custom taxonomies description for use as replacement string.
	 *
	 * @param string $var The complete variable to replace which includes the name of
	 *                    the custom taxonomy which description is to be retrieved.
	 *
	 * @return string|null
	 */
	private function retrieve_ct_desc_custom_tax_name( $var ) {
		global $post;
		$replacement = null;

		if ( is_string( $var ) && $var !== '' ) {
			$tax = substr( $var, 8 );
			if ( is_object( $post ) && isset( $post->ID ) ) {
				$terms = get_the_terms( $post->ID, $tax );
				if ( is_array( $terms ) && $terms !== [] ) {
					$term      = current( $terms );
					$term_desc = get_term_field( 'description', $term->term_id, $tax );
					if ( $term_desc !== '' ) {
						$replacement = wp_strip_all_tags( $term_desc );
					}
				}
			}
		}

		return $replacement;
	}

	/* *********************** HELP TEXT RELATED ************************** */

	/**
	 * Set the help text for a user/plugin/theme defined extra variable.
	 *
	 * @param string                     $type                 Type of variable: 'basic' or 'advanced'.
	 * @param WPSEO_Replacement_Variable $replacement_variable The replacement variable to register.
	 */
	private static function register_help_text( $type, WPSEO_Replacement_Variable $replacement_variable ) {
		$identifier = $replacement_variable->get_variable();

		if ( ( is_string( $type ) && in_array( $type, [ 'basic', 'advanced' ], true ) )
			&& ( $identifier !== '' && ! isset( self::$help_texts[ $type ][ $identifier ] ) )
		) {
			self::$help_texts[ $type ][ $identifier ] = $replacement_variable;
		}
	}

	/**
	 * Generates a list of replacement variables based on the help texts.
	 *
	 * @return array List of replace vars.
	 */
	public function get_replacement_variables_list() {
		self::setup_statics_once();

		$replacement_variables = array_merge(
			$this->get_replacement_variables(),
			WPSEO_Custom_Fields::get_custom_fields(),
			WPSEO_Custom_Taxonomies::get_custom_taxonomies()
		);

		return array_map( [ $this, 'format_replacement_variable' ], $replacement_variables );
	}

	/**
	 * Creates a merged associative array of both the basic and advanced help texts.
	 *
	 * @return array Array with the replacement variables.
	 */
	private function get_replacement_variables() {
		$help_texts = array_merge( self::$help_texts['basic'], self::$help_texts['advanced'] );

		return array_filter( array_keys( $help_texts ), [ $this, 'is_not_prefixed' ] );
	}

	/**
	 * Checks whether the replacement variable contains a `ct_` or `cf_` prefix, because they follow different logic.
	 *
	 * @param string $replacement_variable The replacement variable.
	 *
	 * @return bool True when the replacement variable is not prefixed.
	 */
	private function is_not_prefixed( $replacement_variable ) {
		$prefixes = [ 'cf_', 'ct_' ];
		$prefix   = $this->get_prefix( $replacement_variable );

		return ! in_array( $prefix, $prefixes, true );
	}

	/**
	 * Strip the prefix from a replacement variable name.
	 *
	 * @param string $replacement_variable The replacement variable.
	 *
	 * @return string The replacement variable name without the prefix.
	 */
	private function strip_prefix( $replacement_variable ) {
		return substr( $replacement_variable, 3 );
	}

	/**
	 * Gets the prefix from a replacement variable name.
	 *
	 * @param string $replacement_variable The replacement variable.
	 *
	 * @return string The prefix of the replacement variable.
	 */
	private function get_prefix( $replacement_variable ) {
		return substr( $replacement_variable, 0, 3 );
	}

	/**
	 * Strips 'desc_' if present, and appends ' description' at the end.
	 *
	 * @param string $label The replacement variable.
	 *
	 * @return string The altered replacement variable name.
	 */
	private function handle_description( $label ) {
		if ( strpos( $label, 'desc_' ) === 0 ) {
			return substr( $label, 5 ) . ' description';
		}

		return $label;
	}

	/**
	 * Creates a label for prefixed replacement variables that matches the format in the editors.
	 *
	 * @param string $replacement_variable The replacement variable.
	 *
	 * @return string The replacement variable label.
	 */
	private function get_label( $replacement_variable ) {
		$prefix = $this->get_prefix( $replacement_variable );
		if ( $prefix === 'cf_' ) {
			return $this->strip_prefix( $replacement_variable ) . ' (custom field)';
		}

		if ( $prefix === 'ct_' ) {
			$label = $this->strip_prefix( $replacement_variable );
			$label = $this->handle_description( $label );
			return ucfirst( $label . ' (custom taxonomy)' );
		}

		if ( $prefix === 'pt_' ) {
			if ( $replacement_variable === 'pt_single' ) {
				return 'Post type (singular)';
			}

			return 'Post type (plural)';
		}

		return '';
	}

	/**
	 * Formats the replacement variables.
	 *
	 * @param string $replacement_variable The replacement variable to format.
	 *
	 * @return array The formatted replacement variable.
	 */
	private function format_replacement_variable( $replacement_variable ) {
		return [
			'name'  => $replacement_variable,
			'value' => '',
			'label' => $this->get_label( $replacement_variable ),
		];
	}

	/**
	 * Set/translate the help texts for the WPSEO standard basic variables.
	 */
	private static function set_basic_help_texts() {
		/* translators: %s: wp_title() function. */
		$separator_description = __( 'The separator defined in your theme\'s %s tag.', 'wordpress-seo' );
		$separator_description = sprintf(
			$separator_description,
			// '<code>wp_title()</code>'
			'wp_title()'
		);

		$replacement_variables = [
			new WPSEO_Replacement_Variable( 'date', __( 'Date', 'wordpress-seo' ), __( 'Replaced with the date of the post/page', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'title', __( 'Title', 'wordpress-seo' ), __( 'Replaced with the title of the post/page', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'parent_title', __( 'Parent title', 'wordpress-seo' ), __( 'Replaced with the title of the parent page of the current page', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'archive_title', __( 'Archive title', 'wordpress-seo' ), __( 'Replaced with the normal title for an archive generated by WordPress', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'sitename', __( 'Site title', 'wordpress-seo' ), __( 'The site\'s name', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'sitedesc', __( 'Tagline', 'wordpress-seo' ), __( 'The site\'s tagline', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'excerpt', __( 'Excerpt', 'wordpress-seo' ), __( 'Replaced with the post/page excerpt (or auto-generated if it does not exist)', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'excerpt_only', __( 'Excerpt only', 'wordpress-seo' ), __( 'Replaced with the post/page excerpt (without auto-generation)', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'tag', __( 'Tag', 'wordpress-seo' ), __( 'Replaced with the current tag/tags', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'category', __( 'Category', 'wordpress-seo' ), __( 'Replaced with the post categories (comma separated)', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'primary_category', __( 'Primary category', 'wordpress-seo' ), __( 'Replaced with the primary category of the post/page', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'category_description', __( 'Category description', 'wordpress-seo' ), __( 'Replaced with the category description', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'tag_description', __( 'Tag description', 'wordpress-seo' ), __( 'Replaced with the tag description', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'term_description', __( 'Term description', 'wordpress-seo' ), __( 'Replaced with the term description', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'term_title', __( 'Term title', 'wordpress-seo' ), __( 'Replaced with the term name', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'searchphrase', __( 'Search phrase', 'wordpress-seo' ), __( 'Replaced with the current search phrase', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'term_hierarchy', __( 'Term hierarchy', 'wordpress-seo' ), __( 'Replaced with the term ancestors hierarchy', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'sep', __( 'Separator', 'wordpress-seo' ), $separator_description ),
		];

		foreach ( $replacement_variables as $replacement_variable ) {
			self::register_help_text( 'basic', $replacement_variable );
		}
	}

	/**
	 * Set/translate the help texts for the WPSEO standard advanced variables.
	 */
	private static function set_advanced_help_texts() {
		$replacement_variables = [
			new WPSEO_Replacement_Variable( 'pt_single', __( 'Post type (singular)', 'wordpress-seo' ), __( 'Replaced with the content type single label', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'pt_plural', __( 'Post type (plural)', 'wordpress-seo' ), __( 'Replaced with the content type plural label', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'modified', __( 'Modified', 'wordpress-seo' ), __( 'Replaced with the post/page modified time', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'id', __( 'ID', 'wordpress-seo' ), __( 'Replaced with the post/page ID', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'name', __( 'Name', 'wordpress-seo' ), __( 'Replaced with the post/page author\'s \'nicename\'', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'user_description', __( 'User description', 'wordpress-seo' ), __( 'Replaced with the post/page author\'s \'Biographical Info\'', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'page', __( 'Page number', 'wordpress-seo' ), __( 'Replaced with the current page number with context (i.e. page 2 of 4)', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'pagetotal', __( 'Pagetotal', 'wordpress-seo' ), __( 'Replaced with the current page total', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'pagenumber', __( 'Pagenumber', 'wordpress-seo' ), __( 'Replaced with the current page number', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'caption', __( 'Caption', 'wordpress-seo' ), __( 'Attachment caption', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'focuskw', __( 'Focus keyword', 'wordpress-seo' ), __( 'Replaced with the posts focus keyphrase', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'term404', __( 'Term404', 'wordpress-seo' ), __( 'Replaced with the slug which caused the 404', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'cf_<custom-field-name>', '<custom-field-name> ' . __( '(custom field)', 'wordpress-seo' ), __( 'Replaced with a posts custom field value', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'ct_<custom-tax-name>', '<custom-tax-name> ' . __( '(custom taxonomy)', 'wordpress-seo' ), __( 'Replaced with a posts custom taxonomies, comma separated.', 'wordpress-seo' ) ),
			new WPSEO_Replacement_Variable( 'ct_desc_<custom-tax-name>', '<custom-tax-name> ' . __( 'description (custom taxonomy)', 'wordpress-seo' ), __( 'Replaced with a custom taxonomies description', 'wordpress-seo' ) ),
		];

		foreach ( $replacement_variables as $replacement_variable ) {
			self::register_help_text( 'advanced', $replacement_variable );
		}
	}

	/* *********************** GENERAL HELPER METHODS ************************** */

	/**
	 * Remove the '%%' delimiters from a variable string.
	 *
	 * @param string $string Variable string to be cleaned.
	 *
	 * @return string
	 */
	private static function remove_var_delimiter( $string ) {
		return trim( $string, '%' );
	}

	/**
	 * Add the '%%' delimiters to a variable string.
	 *
	 * @param string $string Variable string to be delimited.
	 *
	 * @return string
	 */
	private static function add_var_delimiter( $string ) {
		return '%%' . $string . '%%';
	}

	/**
	 * Retrieve a post's terms, comma delimited.
	 *
	 * @param int    $id            ID of the post to get the terms for.
	 * @param string $taxonomy      The taxonomy to get the terms for this post from.
	 * @param bool   $return_single If true, return the first term.
	 *
	 * @return string Either a single term or a comma delimited string of terms.
	 */
	public function get_terms( $id, $taxonomy, $return_single = false ) {

		$output = '';

		// If we're on a specific tag, category or taxonomy page, use that.
		if ( is_category() || is_tag() || is_tax() ) {
			$term   = $GLOBALS['wp_query']->get_queried_object();
			$output = $term->name;
		}
		elseif ( ! empty( $id ) && ! empty( $taxonomy ) ) {
			$terms = get_the_terms( $id, $taxonomy );
			if ( is_array( $terms ) && $terms !== [] ) {
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
		unset( $terms, $term );

		/**
		 * Allows filtering of the terms list used to replace %%category%%, %%tag%%
		 * and %%ct_<custom-tax-name>%% variables.
		 *
		 * @api    string    $output    Comma-delimited string containing the terms.
		 * @api    string    $taxonomy  The taxonomy of the terms.
		 */
		return apply_filters( 'wpseo_terms', $output, $taxonomy );
	}

	/**
	 * Gets a taxonomy term hierarchy including the term to get the parents for.
	 *
	 * @return string
	 */
	private function get_term_hierarchy() {
		if ( ! is_taxonomy_hierarchical( $this->args->taxonomy ) ) {
			return '';
		}

		$separator = ' ' . $this->retrieve_sep() . ' ';

		$args = [
			'format'    => 'name',
			'separator' => $separator,
			'link'      => false,
			'inclusive' => true,
		];

		return rtrim(
			get_term_parents_list( $this->args->term_id, $this->args->taxonomy, $args ),
			$separator
		);
	}
}
