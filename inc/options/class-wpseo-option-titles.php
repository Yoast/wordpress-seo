<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

/**
 * Option: wpseo_titles.
 */
class WPSEO_Option_Titles extends WPSEO_Option {

	/**
	 * @var  string  Option name.
	 */
	public $option_name = 'wpseo_titles';

	/**
	 * @var  array  Array of defaults for the option.
	 *        Shouldn't be requested directly, use $this->get_defaults();
	 *
	 * {@internal Note: Some of the default values are added via the translate_defaults() method.}}
	 */
	protected $defaults = array(
		// Non-form fields, set via (ajax) function.
		'title_test'                    => 0,
		// Form fields.
		'forcerewritetitle'             => false,
		'separator'                     => 'sc-dash',
		'title-home-wpseo'              => '%%sitename%% %%page%% %%sep%% %%sitedesc%%', // Text field.
		'title-author-wpseo'            => '', // Text field.
		'title-archive-wpseo'           => '%%date%% %%page%% %%sep%% %%sitename%%', // Text field.
		'title-search-wpseo'            => '', // Text field.
		'title-404-wpseo'               => '', // Text field.

		'metadesc-home-wpseo'           => '', // Text area.
		'metadesc-author-wpseo'         => '', // Text area.
		'metadesc-archive-wpseo'        => '', // Text area.
		'rssbefore'                     => '', // Text area.
		'rssafter'                      => '', // Text area.

		'noindex-author-wpseo'          => false,
		'noindex-author-noposts-wpseo'  => true,
		'noindex-archive-wpseo'         => true,

		'disable-author'                => false,
		'disable-date'                  => false,
		'disable-post_format'           => false,
		'disable-attachment'            => true,
		'is-media-purge-relevant'       => false,

		'breadcrumbs-404crumb'          => '', // Text field.
		'breadcrumbs-display-blog-page' => true,
		'breadcrumbs-boldlast'          => false,
		'breadcrumbs-archiveprefix'     => '', // Text field.
		'breadcrumbs-enable'            => false,
		'breadcrumbs-home'              => '', // Text field.
		'breadcrumbs-prefix'            => '', // Text field.
		'breadcrumbs-searchprefix'      => '', // Text field.
		'breadcrumbs-sep'               => '&raquo;', // Text field.

		'website_name'                  => '',
		'person_name'                   => '',
		'alternate_website_name'        => '',
		'company_logo'                  => '',
		'company_name'                  => '',
		'company_or_person'             => '',

		'stripcategorybase'             => false,

		/**
		 * Uses enrich_defaults to add more along the lines of:
		 * - 'title-' . $pt->name                => ''; // Text field.
		 * - 'metadesc-' . $pt->name             => ''; // Text field.
		 * - 'noindex-' . $pt->name              => false;
		 * - 'showdate-' . $pt->name             => false;
		 * - 'display-metabox-pt-' . $pt->name   => false;
		 *
		 * - 'title-ptarchive-' . $pt->name      => ''; // Text field.
		 * - 'metadesc-ptarchive-' . $pt->name   => ''; // Text field.
		 * - 'bctitle-ptarchive-' . $pt->name    => ''; // Text field.
		 * - 'noindex-ptarchive-' . $pt->name    => false;
		 *
		 * - 'title-tax-' . $tax->name           => '''; // Text field.
		 * - 'metadesc-tax-' . $tax->name        => ''; // Text field.
		 * - 'noindex-tax-' . $tax->name         => false;
		 * - 'display-metabox-tax-' . $tax->name => false;
		 */
	);

	/**
	 * @var  array  Array of variable option name patterns for the option.
	 */
	protected $variable_array_key_patterns = array(
		'title-',
		'metadesc-',
		'noindex-',
		'showdate-',
		'display-metabox-pt-',
		'bctitle-ptarchive-',
		'post_types-',
		'taxonomy-',
	);

	/**
	 * @var array  Array of sub-options which should not be overloaded with multi-site defaults.
	 */
	public $ms_exclude = array(
		/* theme dependent */
		'title_test',
		'forcerewritetitle',
	);

	/**
	 * @var array Array of the separator options. To get these options use WPSEO_Option_Titles::get_instance()->get_separator_options().
	 */
	private $separator_options = array(
		'sc-dash'   => '-',
		'sc-ndash'  => '&ndash;',
		'sc-mdash'  => '&mdash;',
		'sc-colon'  => ':',
		'sc-middot' => '&middot;',
		'sc-bull'   => '&bull;',
		'sc-star'   => '*',
		'sc-smstar' => '&#8902;',
		'sc-pipe'   => '|',
		'sc-tilde'  => '~',
		'sc-laquo'  => '&laquo;',
		'sc-raquo'  => '&raquo;',
		'sc-lt'     => '&lt;',
		'sc-gt'     => '&gt;',
	);

	/**
	 * Add the actions and filters for the option.
	 *
	 * @todo [JRF => testers] Check if the extra actions below would run into problems if an option
	 * is updated early on and if so, change the call to schedule these for a later action on add/update
	 * instead of running them straight away.
	 *
	 * @return \WPSEO_Option_Titles
	 */
	protected function __construct() {
		parent::__construct();
		add_action( 'update_option_' . $this->option_name, array( 'WPSEO_Utils', 'clear_cache' ) );
		add_action( 'init', array( $this, 'end_of_init' ), 999 );

		add_action( 'registered_post_type', array( $this, 'invalidate_enrich_defaults_cache' ) );
		add_action( 'unregistered_post_type', array( $this, 'invalidate_enrich_defaults_cache' ) );
		add_action( 'registered_taxonomy', array( $this, 'invalidate_enrich_defaults_cache' ) );
		add_action( 'unregistered_taxonomy', array( $this, 'invalidate_enrich_defaults_cache' ) );
	}

	/**
	 * Make sure we can recognize the right action for the double cleaning.
	 */
	public function end_of_init() {
		do_action( 'wpseo_double_clean_titles' );
	}

	/**
	 * Get the singleton instance of this class.
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
	 * Get the available separator options.
	 *
	 * @return array
	 */
	public function get_separator_options() {
		$separators = $this->separator_options;

		/**
		 * Allow altering the array with separator options.
		 *
		 * @api  array  $separator_options  Array with the separator options.
		 */
		$filtered_separators = apply_filters( 'wpseo_separator_options', $separators );

		if ( is_array( $filtered_separators ) && $filtered_separators !== array() ) {
			$separators = array_merge( $separators, $filtered_separators );
		}

		return $separators;
	}

	/**
	 * Translate strings used in the option defaults.
	 *
	 * @return void
	 */
	public function translate_defaults() {
		/* translators: 1: Author name; 2: Site name. */
		$this->defaults['title-author-wpseo'] = sprintf( __( '%1$s, Author at %2$s', 'wordpress-seo' ), '%%name%%', '%%sitename%%' ) . ' %%page%% ';
		/* translators: %s expands to the search phrase. */
		$this->defaults['title-search-wpseo'] = sprintf( __( 'You searched for %s', 'wordpress-seo' ), '%%searchphrase%%' ) . ' %%page%% %%sep%% %%sitename%%';
		$this->defaults['title-404-wpseo']    = __( 'Page not found', 'wordpress-seo' ) . ' %%sep%% %%sitename%%';
		/* translators: 1: link to post; 2: link to blog. */
		$this->defaults['rssafter'] = sprintf( __( 'The post %1$s appeared first on %2$s.', 'wordpress-seo' ), '%%POSTLINK%%', '%%BLOGLINK%%' );

		$this->defaults['breadcrumbs-404crumb']      = __( 'Error 404: Page not found', 'wordpress-seo' );
		$this->defaults['breadcrumbs-archiveprefix'] = __( 'Archives for', 'wordpress-seo' );
		$this->defaults['breadcrumbs-home']          = __( 'Home', 'wordpress-seo' );
		$this->defaults['breadcrumbs-searchprefix']  = __( 'You searched for', 'wordpress-seo' );
	}

	/**
	 * Add dynamically created default options based on available post types and taxonomies.
	 *
	 * @return  void
	 */
	public function enrich_defaults() {
		$cache_key = 'yoast_titles_rich_defaults_' . $this->option_name;

		$enriched_defaults = wp_cache_get( $cache_key );
		if ( false !== $enriched_defaults ) {
			$this->defaults += $enriched_defaults;
			return;
		}

		$enriched_defaults = array();

		/*
		 * Retrieve all the relevant post type and taxonomy arrays.
		 *
		 * WPSEO_Post_Type::get_accessible_post_types() should *not* be used here.
		 * These are the defaults and can be prepared for any public post type.
		 */
		$post_type_objects = get_post_types( array( 'public' => true ), 'objects' );

		if ( $post_type_objects ) {
			/* translators: %s expands to the name of a post type (plural). */
			$archive = sprintf( __( '%s Archive', 'wordpress-seo' ), '%%pt_plural%%' );

			foreach ( $post_type_objects as $pt ) {
				$enriched_defaults[ 'title-' . $pt->name ]                   = '%%title%% %%page%% %%sep%% %%sitename%%'; // Text field.
				$enriched_defaults[ 'metadesc-' . $pt->name ]                = ''; // Text area.
				$enriched_defaults[ 'noindex-' . $pt->name ]                 = false;
				$enriched_defaults[ 'showdate-' . $pt->name ]                = false;
				$enriched_defaults[ 'display-metabox-pt-' . $pt->name ]      = true;
				$enriched_defaults[ 'post_types-' . $pt->name . '-maintax' ] = 0; // Select box.

				if ( ! $pt->_builtin && WPSEO_Post_Type::has_archive( $pt ) ) {
					$enriched_defaults[ 'title-ptarchive-' . $pt->name ]    = $archive . ' %%page%% %%sep%% %%sitename%%'; // Text field.
					$enriched_defaults[ 'metadesc-ptarchive-' . $pt->name ] = ''; // Text area.
					$enriched_defaults[ 'bctitle-ptarchive-' . $pt->name ]  = ''; // Text field.
					$enriched_defaults[ 'noindex-ptarchive-' . $pt->name ]  = false;
				}
			}
		}

		$taxonomy_objects = get_taxonomies( array( 'public' => true ), 'object' );

		if ( $taxonomy_objects ) {
			/* translators: %s expands to the variable used for term title. */
			$archives = sprintf( __( '%s Archives', 'wordpress-seo' ), '%%term_title%%' );

			foreach ( $taxonomy_objects as $tax ) {
				$enriched_defaults[ 'title-tax-' . $tax->name ]           = $archives . ' %%page%% %%sep%% %%sitename%%'; // Text field.
				$enriched_defaults[ 'metadesc-tax-' . $tax->name ]        = ''; // Text area.
				$enriched_defaults[ 'display-metabox-tax-' . $tax->name ] = true;

				$enriched_defaults[ 'noindex-tax-' . $tax->name ] = ( $tax->name === 'post_format' );

				if ( ! $tax->_builtin ) {
					$enriched_defaults[ 'taxonomy-' . $tax->name . '-ptparent' ] = 0; // Select box;.
				}
			}
		}

		wp_cache_set( $cache_key, $enriched_defaults );
		$this->defaults += $enriched_defaults;
	}

	/**
	 * Invalidates enrich_defaults() cache.
	 *
	 * Called from actions:
	 *     (un)registered_post_type
	 *     (un)registered_taxonomy
	 *
	 * @return void
	 */
	public function invalidate_enrich_defaults_cache() {
		wp_cache_delete( 'yoast_titles_rich_defaults_' . $this->option_name );
	}

	/**
	 * Validate the option.
	 *
	 * @param  array $dirty New value for the option.
	 * @param  array $clean Clean value for the option, normally the defaults.
	 * @param  array $old   Old value of the option.
	 *
	 * @return  array      Validated clean value for the option to be saved to the database.
	 */
	protected function validate_option( $dirty, $clean, $old ) {
		$allowed_post_types = $this->get_allowed_post_types();

		foreach ( $clean as $key => $value ) {
			$switch_key = $this->get_switch_key( $key );

			switch ( $switch_key ) {
				/* Breadcrumbs text fields. */
				case 'breadcrumbs-404crumb':
				case 'breadcrumbs-archiveprefix':
				case 'breadcrumbs-home':
				case 'breadcrumbs-prefix':
				case 'breadcrumbs-searchprefix':
				case 'breadcrumbs-sep':
					if ( isset( $dirty[ $key ] ) ) {
						$clean[ $key ] = wp_kses_post( $dirty[ $key ] );
					}
					break;

				/*
				 * Text fields.
				 */

				/*
				 * Covers:
				 *  'title-home-wpseo', 'title-author-wpseo', 'title-archive-wpseo',
				 *  'title-search-wpseo', 'title-404-wpseo'
				 *  'title-' . $pt->name
				 *  'title-ptarchive-' . $pt->name
				 *  'title-tax-' . $tax->name
				 */
				case 'website_name':
				case 'alternate_website_name':
				case 'title-':
					if ( isset( $dirty[ $key ] ) ) {
						$clean[ $key ] = WPSEO_Utils::sanitize_text_field( $dirty[ $key ] );
					}
					break;

				case 'company_or_person':
					if ( isset( $dirty[ $key ] ) && $dirty[ $key ] !== '' ) {
						if ( in_array( $dirty[ $key ], array( 'company', 'person' ), true ) ) {
							$clean[ $key ] = $dirty[ $key ];
						}
					}
					break;

				case 'company_logo':
					$this->validate_url( $key, $dirty, $old, $clean );
					break;

				/*
				 * Covers:
				 *  'metadesc-home-wpseo', 'metadesc-author-wpseo', 'metadesc-archive-wpseo'
				 *  'metadesc-' . $pt->name
				 *  'metadesc-ptarchive-' . $pt->name
				 *  'metadesc-tax-' . $tax->name
				 *  and also:
				 *  'bctitle-ptarchive-' . $pt->name
				 */
				case 'metadesc-':
				case 'bctitle-ptarchive-':
				case 'company_name':
				case 'person_name':
					if ( isset( $dirty[ $key ] ) && $dirty[ $key ] !== '' ) {
						$clean[ $key ] = WPSEO_Utils::sanitize_text_field( $dirty[ $key ] );
					}
					break;

				/*
				 * Covers: 'rssbefore', 'rssafter'
				 */
				case 'rssbefore':
				case 'rssafter':
					if ( isset( $dirty[ $key ] ) ) {
						$clean[ $key ] = wp_kses_post( $dirty[ $key ] );
					}
					break;

				/* 'post_types-' . $pt->name . '-maintax' fields. */
				case 'post_types-':
					$post_type  = str_replace( array( 'post_types-', '-maintax' ), '', $key );
					$taxonomies = get_object_taxonomies( $post_type, 'names' );

					if ( isset( $dirty[ $key ] ) ) {
						if ( $taxonomies !== array() && in_array( $dirty[ $key ], $taxonomies, true ) ) {
							$clean[ $key ] = $dirty[ $key ];
						}
						elseif ( (string) $dirty[ $key ] === '0' || (string) $dirty[ $key ] === '' ) {
							$clean[ $key ] = 0;
						}
						elseif ( sanitize_title_with_dashes( $dirty[ $key ] ) === $dirty[ $key ] ) {
							// Allow taxonomies which may not be registered yet.
							$clean[ $key ] = $dirty[ $key ];
						}
						else {
							if ( isset( $old[ $key ] ) ) {
								$clean[ $key ] = sanitize_title_with_dashes( $old[ $key ] );
							}
							/**
							 * @todo [JRF => whomever] maybe change the untranslated $pt name in the
							 * error message to the nicely translated label ?
							 */
							add_settings_error(
								$this->group_name, // Slug title of the setting.
								'_' . $key, // Suffix-id for the error message box.
								/* translators: %s expands to a post type. */
								sprintf( __( 'Please select a valid taxonomy for post type "%s"', 'wordpress-seo' ), $post_type ), // The error message.
								'error' // Error type, either 'error' or 'updated'.
							);
						}
					}
					elseif ( isset( $old[ $key ] ) ) {
						$clean[ $key ] = sanitize_title_with_dashes( $old[ $key ] );
					}
					unset( $taxonomies, $post_type );
					break;

				/* 'taxonomy-' . $tax->name . '-ptparent' fields. */
				case 'taxonomy-':
					if ( isset( $dirty[ $key ] ) ) {
						if ( $allowed_post_types !== array() && in_array( $dirty[ $key ], $allowed_post_types, true ) ) {
							$clean[ $key ] = $dirty[ $key ];
						}
						elseif ( (string) $dirty[ $key ] === '0' || (string) $dirty[ $key ] === '' ) {
							$clean[ $key ] = 0;
						}
						elseif ( sanitize_key( $dirty[ $key ] ) === $dirty[ $key ] ) {
							// Allow taxonomies which may not be registered yet.
							$clean[ $key ] = $dirty[ $key ];
						}
						else {
							if ( isset( $old[ $key ] ) ) {
								$clean[ $key ] = sanitize_key( $old[ $key ] );
							}
							/**
							 * @todo [JRF =? whomever] maybe change the untranslated $tax name in the
							 * error message to the nicely translated label ?
							 */
							$tax = str_replace( array( 'taxonomy-', '-ptparent' ), '', $key );
							add_settings_error(
								$this->group_name, // Slug title of the setting.
								'_' . $tax, // Suffix-id for the error message box.
								/* translators: %s expands to a taxonomy slug. */
								sprintf( __( 'Please select a valid post type for taxonomy "%s"', 'wordpress-seo' ), $tax ), // The error message.
								'error' // Error type, either 'error' or 'updated'.
							);
							unset( $tax );
						}
					}
					elseif ( isset( $old[ $key ] ) ) {
						$clean[ $key ] = sanitize_key( $old[ $key ] );
					}
					break;

				/* Integer field - not in form. */
				case 'title_test':
					if ( isset( $dirty[ $key ] ) ) {
						$int = WPSEO_Utils::validate_int( $dirty[ $key ] );
						if ( $int !== false && $int >= 0 ) {
							$clean[ $key ] = $int;
						}
					}
					elseif ( isset( $old[ $key ] ) ) {
						$int = WPSEO_Utils::validate_int( $old[ $key ] );
						if ( $int !== false && $int >= 0 ) {
							$clean[ $key ] = $int;
						}
					}
					break;

				/* Separator field - Radio */
				case 'separator':
					if ( isset( $dirty[ $key ] ) && $dirty[ $key ] !== '' ) {

						// Get separator fields.
						$separator_fields = $this->get_separator_options();

						// Check if the given separator is exists.
						if ( isset( $separator_fields[ $dirty[ $key ] ] ) ) {
							$clean[ $key ] = $dirty[ $key ];
						}
					}
					break;

				/*
				 * Boolean fields.
				 */

				/*
				 * Covers:
				 *  'noindex-author-wpseo', 'noindex-author-noposts-wpseo', 'noindex-archive-wpseo'
				 *  'noindex-' . $pt->name
				 *  'noindex-ptarchive-' . $pt->name
				 *  'noindex-tax-' . $tax->name
				 *  'forcerewritetitle':
				 *  'noodp':
				 *  'noydir':
				 *  'disable-author':
				 *  'disable-date':
				 *  'disable-post_format';
				 *  'noindex-'
				 *  'showdate-'
				 *  'showdate-'. $pt->name
				 *  'display-metabox-pt-'
				 *  'display-metabox-pt-'. $pt->name
				 *  'display-metabox-tax-'
				 *  'display-metabox-tax-' . $tax->name
				 *  'breadcrumbs-display-blog-page'
				 *  'breadcrumbs-boldlast'
				 *  'breadcrumbs-enable'
				 *  'stripcategorybase'
				 *  'is-media-purge-relevant'
				 */
				default:
					$clean[ $key ] = ( isset( $dirty[ $key ] ) ? WPSEO_Utils::validate_bool( $dirty[ $key ] ) : false );
					break;
			}
		}

		return $clean;
	}

	/**
	 * Retrieve a list of the allowed post types as breadcrumb parent for a taxonomy.
	 * Helper method for validation.
	 *
	 * {@internal Don't make static as new types may still be registered.}}
	 *
	 * @return array
	 */
	protected function get_allowed_post_types() {
		$allowed_post_types = array();

		/*
		 * WPSEO_Post_Type::get_accessible_post_types() should *not* be used here.
		 */
		$post_types = get_post_types( array( 'public' => true ), 'objects' );

		if ( get_option( 'show_on_front' ) === 'page' && get_option( 'page_for_posts' ) > 0 ) {
			$allowed_post_types[] = 'post';
		}

		if ( is_array( $post_types ) && $post_types !== array() ) {
			foreach ( $post_types as $type ) {
				if ( WPSEO_Post_Type::has_archive( $type ) ) {
					$allowed_post_types[] = $type->name;
				}
			}
		}

		return $allowed_post_types;
	}

	/**
	 * Clean a given option value.
	 *
	 * @param  array  $option_value          Old (not merged with defaults or filtered) option value to
	 *                                       clean according to the rules for this option.
	 * @param  string $current_version       Optional. Version from which to upgrade, if not set,
	 *                                       version specific upgrades will be disregarded.
	 * @param  array  $all_old_option_values Optional. Only used when importing old options to have
	 *                                       access to the real old values, in contrast to the saved ones.
	 *
	 * @return  array            Cleaned option.
	 */
	protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {
		static $original = null;

		// Double-run this function to ensure renaming of the taxonomy options will work.
		if ( ! isset( $original ) && has_action( 'wpseo_double_clean_titles', array(
				$this,
				'clean',
			) ) === false
		) {
			add_action( 'wpseo_double_clean_titles', array( $this, 'clean' ) );
			$original = $option_value;
		}

		/*
		 * Move options from very old option to this one.
		 *
		 * {@internal Don't rename to the 'current' names straight away as that would prevent
		 *            the rename/unset combi below from working.}}
		 *
		 * @todo [JRF] maybe figure out a smarter way to deal with this.
		 */
		$old_option = null;
		if ( isset( $all_old_option_values ) ) {
			// Ok, we have an import.
			if ( isset( $all_old_option_values['wpseo_indexation'] ) && is_array( $all_old_option_values['wpseo_indexation'] ) && $all_old_option_values['wpseo_indexation'] !== array() ) {
				$old_option = $all_old_option_values['wpseo_indexation'];
			}
		}
		else {
			$old_option = get_option( 'wpseo_indexation' );
		}
		if ( is_array( $old_option ) && $old_option !== array() ) {
			$move = array(
				'noindexauthor'     => 'noindex-author',
				'disableauthor'     => 'disable-author',
				'noindexdate'       => 'noindex-archive',
				'noindexcat'        => 'noindex-category',
				'noindextag'        => 'noindex-post_tag',
				'noindexpostformat' => 'noindex-post_format',
			);
			foreach ( $move as $old => $new ) {
				if ( isset( $old_option[ $old ] ) && ! isset( $option_value[ $new ] ) ) {
					$option_value[ $new ] = $old_option[ $old ];
				}
			}
			unset( $move, $old, $new );
		}
		unset( $old_option );


		// Fix wrongness created by buggy version 1.2.2.
		if ( isset( $option_value['title-home'] ) && $option_value['title-home'] === '%%sitename%% - %%sitedesc%% - 12345' ) {
			$option_value['title-home-wpseo'] = '%%sitename%% - %%sitedesc%%';
		}


		/*
		 * Renaming these options to avoid ever overwritting these if a (bloody stupid) user /
		 * programmer would use any of the following as a custom post type or custom taxonomy:
		 * 'home', 'author', 'archive', 'search', '404', 'subpages'.
		 *
		 * Similarly, renaming the tax options to avoid a custom post type and a taxonomy
		 * with the same name occupying the same option.
		 */
		$rename = array(
			'title-home'       => 'title-home-wpseo',
			'title-author'     => 'title-author-wpseo',
			'title-archive'    => 'title-archive-wpseo',
			'title-search'     => 'title-search-wpseo',
			'title-404'        => 'title-404-wpseo',
			'metadesc-home'    => 'metadesc-home-wpseo',
			'metadesc-author'  => 'metadesc-author-wpseo',
			'metadesc-archive' => 'metadesc-archive-wpseo',
			'noindex-author'   => 'noindex-author-wpseo',
			'noindex-archive'  => 'noindex-archive-wpseo',
		);
		foreach ( $rename as $old => $new ) {
			if ( isset( $option_value[ $old ] ) && ! isset( $option_value[ $new ] ) ) {
				$option_value[ $new ] = $option_value[ $old ];
				unset( $option_value[ $old ] );
			}
		}
		unset( $rename, $old, $new );


		/**
		 * {@internal This clean-up action can only be done effectively once the taxonomies
		 *            and post_types have been registered, i.e. at the end of the init action.}}
		 */
		if ( isset( $original ) && current_filter() === 'wpseo_double_clean_titles' || did_action( 'wpseo_double_clean_titles' ) > 0 ) {
			$rename = array(
				'title-'           => 'title-tax-',
				'metadesc-'        => 'metadesc-tax-',
				'noindex-'         => 'noindex-tax-',
				'tax-hideeditbox-' => 'hideeditbox-tax-',

			);

			$taxonomy_names  = get_taxonomies( array( 'public' => true ), 'names' );
			$post_type_names = get_post_types( array( 'public' => true ), 'names' );
			$defaults        = $this->get_defaults();
			if ( $taxonomy_names !== array() ) {
				foreach ( $taxonomy_names as $tax ) {
					foreach ( $rename as $old_prefix => $new_prefix ) {
						if (
							( isset( $original[ $old_prefix . $tax ] ) && ! isset( $original[ $new_prefix . $tax ] ) )
							&& ( ! isset( $option_value[ $new_prefix . $tax ] )
								|| ( isset( $option_value[ $new_prefix . $tax ] )
									&& $option_value[ $new_prefix . $tax ] === $defaults[ $new_prefix . $tax ] ) )
						) {
							$option_value[ $new_prefix . $tax ] = $original[ $old_prefix . $tax ];

							/*
							 * Check if there is a cpt with the same name as the tax,
							 * if so, we should make sure that the old setting hasn't been removed.
							 */
							if ( ! isset( $post_type_names[ $tax ] ) && isset( $option_value[ $old_prefix . $tax ] ) ) {
								unset( $option_value[ $old_prefix . $tax ] );
							}
							else {
								if ( isset( $post_type_names[ $tax ] ) && ! isset( $option_value[ $old_prefix . $tax ] ) ) {
									$option_value[ $old_prefix . $tax ] = $original[ $old_prefix . $tax ];
								}
							}

							if ( $old_prefix === 'tax-hideeditbox-' ) {
								unset( $option_value[ $old_prefix . $tax ] );
							}
						}
					}
				}
			}
			unset( $rename, $taxonomy_names, $post_type_names, $defaults, $tax, $old_prefix, $new_prefix );
		}


		/*
		 * Make sure the values of the variable option key options are cleaned as they
		 * may be retained and would not be cleaned/validated then.
		 */
		if ( is_array( $option_value ) && $option_value !== array() ) {
			foreach ( $option_value as $key => $value ) {
				$switch_key = $this->get_switch_key( $key );

				// Similar to validation routine - any changes made there should be made here too.
				switch ( $switch_key ) {
					/* text fields */
					case 'title-':
					case 'metadesc-':
					case 'bctitle-ptarchive-':
						$option_value[ $key ] = WPSEO_Utils::sanitize_text_field( $value );
						break;

					case 'separator':
						if ( ! array_key_exists( $value, $this->get_separator_options() ) ) {
							$option_value[ $key ] = false;
						}
						break;

					/*
					 * Boolean fields.
					 */

					/*
					 * Covers:
					 *  'noindex-'
					 *  'showdate-'
					 *  'hideeditbox-'
					 */
					default:
						$option_value[ $key ] = WPSEO_Utils::validate_bool( $value );
						break;
				}
			}
			unset( $key, $value, $switch_key );
		}

		return $option_value;
	}

	/**
	 * Make sure that any set option values relating to post_types and/or taxonomies are retained,
	 * even when that post_type or taxonomy may not yet have been registered.
	 *
	 * {@internal Overrule the abstract class version of this to make sure one extra renamed
	 *            variable key does not get removed. IMPORTANT: keep this method in line with
	 *            the parent on which it is based!}}
	 *
	 * @param  array $dirty Original option as retrieved from the database.
	 * @param  array $clean Filtered option where any options which shouldn't be in our option
	 *                      have already been removed and any options which weren't set
	 *                      have been set to their defaults.
	 *
	 * @return  array
	 */
	protected function retain_variable_keys( $dirty, $clean ) {
		if ( ( is_array( $this->variable_array_key_patterns ) && $this->variable_array_key_patterns !== array() ) && ( is_array( $dirty ) && $dirty !== array() ) ) {

			// Add the extra pattern.
			$patterns   = $this->variable_array_key_patterns;
			$patterns[] = 'tax-hideeditbox-';

			/**
			 * Allow altering the array with variable array key patterns.
			 *
			 * @api  array  $patterns  Array with the variable array key patterns.
			 */
			$patterns = apply_filters( 'wpseo_option_titles_variable_array_key_patterns', $patterns );

			foreach ( $dirty as $key => $value ) {

				// Do nothing if already in filtered option array.
				if ( isset( $clean[ $key ] ) ) {
					continue;
				}

				foreach ( $patterns as $pattern ) {
					if ( strpos( $key, $pattern ) === 0 ) {
						$clean[ $key ] = $value;
						break;
					}
				}
			}
		}

		return $clean;
	}
}
