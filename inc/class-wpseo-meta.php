<?php
/**
 * @package Internals
 */

// Avoid direct calls to this file
if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

if ( ! class_exists( 'WPSEO_Meta' ) ) {
	/**
	 * @package WordPress\Plugins\WPSeo
	 * @subpackage Internals
	 * @since 1.5.0
	 * @version 1.5.0
	 *
	 * @internal all WP native get_meta() results get cached internally, so no need to cache locally.
	 * @internal use $key when the key is the WPSEO internal name (without prefix), $meta_key when it includes the prefix
	 *
	 */
	class WPSEO_Meta {

		/**
		 * Prefix for all WPSEO meta values in the database
		 * 
		 * @internal if at any point this would change, quite apart from an upgrade routine, this also will need to
		 * be changed in the wpml-config.xml file.
		 */
		public static $meta_prefix = '_yoast_wpseo_';
		
		
		/**
		 * Prefix for all WPSEO meta value form field names and ids
		 *
		 * @todo - ought to be passed to js via wp_localize_script() and used as a variable for the jQuery stuff
		 */
		public static $form_prefix = 'yoast_wpseo_';


		/**
		 * @var int $meta_length Allowed length of the meta description.
		 */
		public static $meta_length = 156;

		/**
		 * @var string $meta_length_reason Reason the meta description is not the default length.
		 */
		public static $meta_length_reason = '';


/*
		public $defaults = array(

/*v* /			'_yoast_wpseo_focuskw'					=> '',
/*v* /			'_yoast_wpseo_title'					=> '',
/*v* /			'_yoast_wpseo_metadesc'					=> '',
/*v* /			'_yoast_wpseo_metakeywords'				=> '',


/*xxx* /			'_yoast_wpseo_meta-robots-noindex'		=> '0', // vs '-'
/*xxx* /			'_yoast_wpseo_meta-robots-nofollow'		=> '0', // vs 'follow'
/*v* /			'_yoast_wpseo_meta-robots-adv'			=> 'none',
			'_yoast_wpseo_meta-robots-adv'			=> '', // ????

/*v* /			'_yoast_wpseo_bctitle'					=> '',
/*v* /			'_yoast_wpseo_sitemap-prio'				=> '-',
/*v* /			'_yoast_wpseo_sitemap-include'			=> '-',
/*v* /			'_yoast_wpseo_sitemap-html-include'		=> '-',
/*v* /			'_yoast_wpseo_canonical'				=> '',
/*v* /			'_yoast_wpseo_redirect'					=> '',



/*v* /			'_yoast_wpseo_opengraph-description'	=> '',
/*v* /			'_yoast_wpseo_opengraph-image'			=> '',
/*v* /			'_yoast_wpseo_google-plus-description'	=> '',



// Check:
			'_yoast_wpseo_linkdex'					=> '0',
			'_yoast_wpseo_meta-robots'				=> 'index,follow', => looks to be no longer in use
		);
*/

		/**
		 * @var	array	$meta_fields	Meta box field definitions for the meta box form
		 *
		 *				Array format:
		 *				(required)		'type'			=> (string) field type. i.e. text / textarea / checkbox /
		 *													radio / select / multiselect / upload / snippetpreview etc
		 *				(required)		'title'			=> (string) table row title
		 *				(recommended)	'default_value' => (string) default value for the field
		 *													IMPORTANT:
		 *													- if the field has options, the default has to be the
		 *													  key of one of the options
		 *													- if the field is a text field, the default **has** to be
		 *													  an empty string as otherwise the user can't save
		 *													  an empty value/delete the meta value
		 *													- if the field is a checkbox, the only valid values
		 *													  are 'on' or 'off'
		 *				(semi-required)	'options'		=> (array) options for used with (multi-)select and radio
		 *													fields, required if that's the field type
		 *													key = (string) value which will be saved to db
		 *													value = (string) text label for the option
		 *				(optional)		'autocomplete'	=> (bool) whether autocomplete is on for text fields,
		 *													defaults to true
		 *				(optional)		'class'			=> (string) classname(s) to add to the actual <input> tag
		 *				(optional)		'description'	=> (string) description to show underneath the field
		 *				(optional)		'expl'			=> (string) label for a checkbox
		 *				(optional)		'help'			=> (string) help text to show on mouse over ? image
		 *				(optional)		'rows'			=> (int) number of rows for a textarea, defaults to 3
		 *
		 *				(optional)		'richedit'		=> (bool) seems currently to be unused
		 *				(optional)		'placeholder'	=> (string) does not seem to be defined anywhere... ?
		 *
		 * @todo - check usage of richedit and placeholder and what to do with those
		 *
		 *
		 * - Titles, help texts, description text and option labels are added via a translate_meta_boxes() method
		 *	 in the relevant child classes (WPSEO_Metabox and WPSEO_Social_admin)
		 * - Beware: even though the meta keys are divided into subsets, they still have to be uniquely named!
		 */
		public static $meta_fields = array(
			'general'	=> array(
				'snippetpreview'	=> array(
					'type'				=> 'snippetpreview',
					'title'				=> '', // translation added later
				),
				'focuskw' 	   		=> array(
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'default_value'		=> '',
					'autocomplete'		=> false,
					'help'				=> '', // translation added later
					'description'		=> '<div id="focuskwresults"></div>',
				),
				'title'				=> array(
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'default_value'		=> '',
					'description'		=> '', // translation added later
					'help'				=> '', // translation added later
				),
				'metadesc'			=> array(
					'type'				=> 'textarea',
					'title'				=> '', // translation added later
					'default_value'		=> '',
					'class'				=> 'metadesc',
					'rows'				=> 2,
					'richedit'			=> false,
					'description'		=> '', // translation added later
					'help'				=> '', // translation added later
				),
				'metakeywords'		=> array(
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'default_value'		=> '',
					'class'				=> 'metakeywords',
					'description'		=> '', // translation added later
				),
			),
			'advanced'	=> array(
				'meta-robots-noindex'	=> array(
					'type'			=> 'select',
					'title' 		=> '', // translation added later
					'default_value'	=> '0', // = post-type default
					'options'		=> array(
						'0' 	=> '', // post type default - translation added later
						'2' 	=> '', // index - translation added later
						'1' 	=> '', // no-index - translation added later
					),
				),
				'meta-robots-nofollow'	=> array(
					'type'			=> 'radio',
					'title'			=> '', // translation added later
					'default_value'	=> '0', // = follow
					'options'		=> array(
						'0' 	=> '', // follow - translation added later
						'1' 	=> '', // no-follow - translation added later
					),
				),
				'meta-robots-adv'		=> array(
					'type'			=> 'multiselect',
					'title' 		=> '', // translation added later
					'default_value'	=> '-', // = site-wide default
					'description'	=> '', // translation added later
					'options'		=> array(
						'-'				=> '', // site-wide default - translation added later
						'none'			=> '', // translation added later
						'noodp' 		=> '', // translation added later
						'noydir'		=> '', // translation added later
						'noarchive' 	=> '', // translation added later
						'nosnippet' 	=> '', // translation added later
					),
				),
				'bctitle'				=> array(
					'type'			=> 'text',
					'title' 		=> '', // translation added later
					'default_value'	=> '',
					'description'	=> '', // translation added later
				),
				'sitemap-include' 		=> array(
					'type'		  	=> 'select',
					'title' 	  	=> '', // translation added later
					'default_value'	=> '-',
					'description' 	=> '', // translation added later
					'options'	  	=> array(
						'-' 	 => '', // translation added later
						'always' => '', // translation added later
						'never'  => '', // translation added later
					),
				),
				'sitemap-prio'			=> array(
					'type'			=> 'select',
					'title' 		=> '', // translation added later
					'default_value'	=> '-',
					'description'	=> '', // translation added later
					'options'		=> array(
						'-'   => '', // translation added later
						'1'   => '', // translation added later
						'0.9' => '0.9',
						'0.8' => '0.8 - ', // translation added later
						'0.7' => '0.7',
						'0.6' => '0.6 - ', // translation added later
						'0.5' => '0.5 - ', // translation added later
						'0.4' => '0.4',
						'0.3' => '0.3',
						'0.2' => '0.2',
						'0.1' => '0.1 - ', // translation added later
					),
				),
				'sitemap-html-include'	=> array(
					'type'			=> 'select',
					'title' 		=> '', // translation added later
					'default_value'	=> '-',
					'description'	=> '', // translation added later
					'options'		=> array(
						'-' 			=> '', // translation added later
						'always'		=> '', // translation added later
						'never' 		=> '', // translation added later
					),
				),
				'canonical'			 	=> array(
					'type'			=> 'text',
					'title' 		=> '', // translation added later
					'default_value'	=> '',
					'description'	=> '', // translation added later
				),
				'redirect'			 	=> array(
					'type'			=> 'text',
					'title' 		=> '', // translation added later
					'default_value'	=> '',
					'description'	=> '', // translation added later
				),
			),
			'social'	=> array(
				'opengraph-description'		=> array(
					'type'			=> 'textarea',
					'title' 		=> '', // translation added later
					'default_value'	=> '',
					'richedit'		=> false,
					'description'	=> '', // translation added later
				),
				'opengraph-image'			=> array(
					'type'			=> 'upload',
					'title' 		=> '', // translation added later
					'default_value'	=> '',
					'description'	=> '', // translation added later
				),
				/* @todo verify where this is used... it doesn't seem to be retrieve anywhere... */
				'google-plus-description'	=> array(
					'type'			=> 'textarea',
					'title' 		=> '', // translation added later
					'default_value'	=> '',
					'richedit'		=> false,
					'description'	=> '', // translation added later
				),
			),
			
			/* Fields we should validate & save, but not show on any form */
			'non_form'	=> array(
				'linkdex'	=> array(
					'type'				=> null,
					'default_value'		=> '0',
				),
			),
		);
		
		
		public static $fields_index = array();
		
		
		public static $defaults = array();





		public static function init() {
			$register = function_exists( 'register_meta' );

			foreach ( self::$meta_fields as $subset => $field_group ) {
				foreach ( $field_group as $key => $field_def ) {
					if ( $field_def['type'] !== 'snippetpreview' ) {
						/* register_meta() is undocumented and not used by WP internally, wrapped in
						   function_exists as a precaution in case they remove it. */
						if ( $register === true ) {
							register_meta( 'post', self::$meta_prefix . $key, array( __CLASS__, 'sanitize_post_meta' ) );
						}
						else {
							add_filter( 'sanitize_post_meta_' . self::$meta_prefix . $key, array( __CLASS__, 'sanitize_post_meta' ), 10, 2 );
						}

						// Set the $fields_index property for efficiency
						self::$fields_index[self::$meta_prefix . $key] = array(
							'subset' => $subset,
							'key'	 => $key,
						);
						
						// Set the $defaults property for efficiency
						if ( isset( $field_def['default_value'] ) ) {
							self::$defaults[self::$meta_prefix . $key] = $field_def['default_value'];
						}
						else {
							// meta will be always be string, so let's make the meta meta default also a string
							self::$defaults[self::$meta_prefix . $key] = '';
						}
					}
				}
			}

			add_filter( 'update_post_metadata', array( __CLASS__, 'remove_meta_if_default' ), 10, 5 );
			add_filter( 'add_post_metadata', array( __CLASS__, 'dont_save_meta_if_default' ), 10, 4 );
		}


		/**
		 * Retrieve the meta box form field definitions for the given tab and post type.
		 *
		 * @param	string	$tab		Tab for which to retrieve the field definitions
		 * @param	string	$post_type	Post type of the current post
		 * @return	array				Array containing the meta box field definitions
		 */
		public function get_meta_field_defs( $tab, $post_type = 'post' ) {
			if ( ! isset( self::$meta_fields[$tab] ) ) {
				return array();
			}
			
			$field_defs = self::$meta_fields[$tab];

			switch ( $tab ) {
				case 'non-form':
					// prevent non-form fields from being passed to forms
					$field_defs = array();
					break;


				case 'general':
					$options = get_option( 'wpseo_titles' );
					if ( $options['usemetakeywords'] === true ) {
						/* Adjust the link in the keywords description text string based on the post type */
						$field_defs['metakeywords']['description'] = sprintf( $field_defs['metakeywords']['description'], '<a target="_blank" href="' . esc_url( admin_url( 'admin.php?page=wpseo_titles#' . urlencode( $post_type ) ) ) . '">', '</a>' );
					}
					else {
						/* Don't show the keywords field if keywords aren't enabled */
						unset( $field_defs['metakeywords'] );
					}
					/**
					 * Filter the WPSEO metabox form field definitions for the general tab, backward compatibility
					 *
					 * @deprecated 1.5.0
					 * @deprecated use the 'wpseo_metabox_entries_general' filter instead
					 * @see WPSEO_Meta::get_meta_field_defs()
					 *
					 * @param	array	$field_defs    metabox form definitions
					 * @return	array
					 */
					$field_defs = apply_filters( 'wpseo_metabox_entries', $field_defs );
					break;


				case 'advanced':
					global $post;
					
					$options = WPSEO_Options::get_all();

					$post_type = '';
					if ( isset( $post->post_type ) ) {
						$post_type = $post->post_type;
					}
					else if ( ! isset( $post->post_type ) && isset( $_GET['post_type'] ) ) {
						$post_type = sanitize_text_field( $_GET['post_type'] );
					}


					/* Don't show the robots index field if it's overruled by a blog-wide option */
					if ( '0' == get_option( 'blog_public' ) ) {
						unset( $field_defs['meta-robots-noindex'] );
					}

					/* Adjust the no-index 'default for post type' text string based on the post type */
					$field_defs['meta-robots-noindex']['options']['0'] = sprintf( $field_defs['meta-robots-noindex']['options']['0'], ( ( isset( $options['noindex-' . $post_type] ) && $options['noindex-' . $post_type] === true ) ? 'noindex' : 'index' ) );

					/* Adjust the robots advanced 'site-wide default' text string based on those settings */
					if ( $options['noodp'] !== false || $options['noydir'] !== false ) {
						$robots_adv = array();
						foreach ( array( 'noodp', 'noydir' ) as $robot ) {
							if ( $options[$robot] === true ) {
								// use translation from field def options - mind that $options and $field_def['options'] keys should be the same!
								$robots_adv[] = $field_defs['meta-robots-adv']['options'][$robot];
							}
						}
						$robots_adv = implode( ', ', $robots_adv );
					}
					else {
						$robots_adv = __( 'None', 'wordpress-seo' );
					}
					$field_defs['meta-robots-adv']['options']['-'] = sprintf( $field_defs['meta-robots-adv']['options']['-'], $robots_adv );
					unset( $robots_adv );


					/* Don't show the breadcrumb title field if breadcrumbs aren't enabled */
					if ( $options['breadcrumbs-enable'] !== true ) {
						unset( $field_defs['bctitle'] );
					}
					
					/* Don't show the xml sitemap fields, if xml sitemaps aren't enabled */
					if ( $options['enablexmlsitemap'] !== true ) {
						unset(
							$field_defs['sitemap-include'],
							$field_defs['sitemap-prio']
						);
					}
					break;
			}

			/**
			 * Filter the WPSEO metabox form field definitions for a tab
			 * {tab} can be 'general', 'advanced' or 'social'
			 *
			 * @param	array	$field_defs    metabox form definitions
			 * @return	array
			 */
			return apply_filters( 'wpseo_metabox_entries_' . $tab, $field_defs );
		}



		/**
		 * Validate the post meta values
		 *
		 * @param	mixed	$meta_value	The new value
		 * @param	string	$meta_key	The full meta key (including prefix)
		 * @return	string				Validated meta value
		 */
		public static function sanitize_post_meta( $meta_value, $meta_key ) {
			$field_def = self::$meta_fields[self::$fields_index[$meta_key]['subset']][self::$fields_index[$meta_key]['key']];
			$clean     = self::$defaults[$meta_key];

			switch ( true ) {
				case ( $meta_key === self::$meta_prefix . 'linkdex' ):
					$int = WPSEO_Options::validate_int( $meta_value );
					if ( $int !== false ) {
						$clean = $int;
					}
					break;


				case ( $field_def['type'] === 'checkbox' ):
					// Only allow value if it's one of the predefined options
					if ( in_array( $meta_value, array( 'on', 'off' ), true ) ) {
						$clean = $meta_value;
					}
					break;


				case ( $field_def['type'] === 'select' || $field_def['type'] === 'radio' ):
					// Only allow value if it's one of the predefined options
					if ( isset( $field_def['options'][$meta_value] ) ) {
						$clean = $meta_value;
					}
					break;


				case ( $field_def['type'] === 'multiselect' && $meta_key === self::$meta_prefix . 'meta-robots-adv' ):
					$clean = self::validate_meta_robots_adv( $meta_value );
					break;
					

				case ( $field_def['type'] === 'text' && $meta_key === self::$meta_prefix . 'canonical' ):
				case ( $field_def['type'] === 'text' && $meta_key === self::$meta_prefix . 'redirect' ):
					// Validate as url(-part)
					// @todo check/improve url verification
					$url = esc_url_raw( trim( $meta_value ), array( 'http', 'https' ) );
					if ( $url !== '' ) {
						$clean = $url;
					}
					break;


				case ( $field_def['type'] === 'upload' && $meta_key === self::$meta_prefix . 'opengraph-image' ):
					// Validate as url
					// @todo check/improve url verification
					$url = esc_url_raw( trim( $meta_value ), array( 'http', 'https', 'ftp', 'ftps' ) );
					if ( $url !== '' ) {
						$clean = $url;
					}
					break;


				case ( $field_def['type'] === 'textarea' ):
					if ( is_string( $meta_value ) ) {
						// Remove line breaks and tabs
						// @todo verify with @yoast that those aren't allowed/recommended in meta header fields
						$meta_value = str_replace( array( "\n", "\r", "\t", '  ' ), ' ', $meta_value );
						$clean      = sanitize_text_field( trim( $meta_value ) );
					}
					break;


				case ( $field_def['type'] === 'text' ):
				default:
					if ( is_string( $meta_value ) ) {
						$clean = sanitize_text_field( trim( $meta_value ) );
					}
					break;
			}

			return $clean;
		}
		
		
		/**
		 * Validate a meta-robots-adv meta value
		 *
		 * @todo Verify with @yoast that this logic for the prioritisation is correct
		 *
		 * @param	array|string	$meta_value	The value to validate
		 * @return	string			Clean value
		 */
		public static function validate_meta_robots_adv( $meta_value ) {
			$clean   = self::$meta_fields['advanced']['meta-robots-adv']['default_value'];
			$options = self::$meta_fields['advanced']['meta-robots-adv']['options'];

			if ( is_string( $meta_value ) ) {
				$meta_value = explode( ',', $meta_value );
			}

			if ( is_array( $meta_value ) && $meta_value !== array() ) {
				if ( in_array( 'none', $meta_value, true ) ) {
					// None is one of the selected values, takes priority over everything else
					$clean = 'none';
				}
				else if ( in_array( '-', $meta_value, true ) ) {
					// Site-wide defaults is one of the selected values, takes priority over
					// individual selected entries
					$clean = '-';
				}
				else {
					// Individual selected entries
					$cleaning = array();
					foreach ( $meta_value as $value ) {
						if ( isset( $options[$value] ) ) {
							$cleaning[] = $value;
						}
					}

					if ( $cleaning !== array() ) {
						$clean = implode( ',', $cleaning );
					}
					unset( $cleaning, $value );
				}
			}
			
			return $clean;
		}


		/**
		 * Prevent saving of default values and remove potential old value from the database if replaced by a default
		 *
		 * @param	null	$null		old, disregard
		 * @param	int		$object_id	ID of the current object for which the meta is being updated
		 * @param	string	$meta_key	The full meta key (including prefix)
		 * @param	string	$meta_value	New meta value
		 * @param	string	$prev_value	The old meta value
		 * @return	null|bool			true = stop saving, null = continue saving
		 */
		public static function remove_meta_if_default( $null, $object_id, $meta_key, $meta_value, $prev_value = '' ) {
			/* If it's one of our meta fields, check against default */
			if ( isset( self::$fields_index[$meta_key] ) && self::meta_value_is_default( $meta_key, $meta_value ) === true ) {
				if ( $prev_value !== '' ) {
					delete_post_meta( $object_id, $meta_key, $prev_value );
				}
				else {
					delete_post_meta( $object_id, $meta_key );
				}
				return true; // stop saving the value
			}

			return null; // go on with the normal execution (update) in meta.php
		}


		/**
		 * Prevent adding of default values to the database
		 *
		 * @param	null	$null		old, disregard
		 * @param	int		$object_id	ID of the current object for which the meta is being added
		 * @param	string	$meta_key	The full meta key (including prefix)
		 * @param	string	$meta_value	New meta value
		 * @return	null|bool			true = stop saving, null = continue saving
		 */
		public static function dont_save_meta_if_default( $null, $object_id, $meta_key, $meta_value ) {
			/* If it's one of our meta fields, check against default */
			if ( isset( self::$fields_index[$meta_key] ) && self::meta_value_is_default( $meta_key, $meta_value ) === true ) {
				return true; // stop saving the value
			}

			return null; // go on with the normal execution (add) in meta.php
		}


		/**
		 * Is the given meta value the same as the default value ?
		 *
		 * @param	string	$meta_key	The full meta key (including prefix)
		 * @param	mixed	$meta_value	The value to check
		 * @return	bool
		 */
		public static function meta_value_is_default( $meta_key, $meta_value ) {
			return ( isset( self::$defaults[$meta_key] ) && $meta_value === self::$defaults[$meta_key] );
		}




		/**
		 * Get a custom post meta value
		 * Returns the default value if the meta value has not been set
		 *
		 * @internal Unfortunately there isn't a filter available to hook into before returning the results
		 * for get_post_meta(), get_post_custom() and the likes. That would have been the preferred solution.
		 *
		 * @param   string  $key		internal key of the value to get (without prefix)
		 * @param   int     $postid		post ID of the post to get the value for
		 * @return  string				All 'normal' values returned from get_post_meta() are strings.
		 *								Objects and arrays are possible, but not used by this plugin
		 *								Will return the default value if no value was found.
		 *								Will return empty string if no default was found either or
		 *								if the post does not exist
		 */
		public static function get_value( $key, $postid = 0 ) {
			global $post;

			$postid = absint( $postid );
			if ( $postid === 0 ) {
				if ( ( isset( $post ) && is_object( $post ) ) && ( isset( $post->post_status ) && $post->post_status !== 'auto-draft' ) ){
					$postid = $post->ID;
				}
				else {
					return '';
				}
			}

			$custom = get_post_custom( $postid );
			if ( isset( $custom[self::$meta_prefix . $key][0] ) && $custom[self::$meta_prefix . $key][0] !== '' ) {
				return maybe_unserialize( $custom[self::$meta_prefix . $key][0] );
			}
			else if ( isset( self::$defaults[self::$meta_prefix . $key] ) ) {
				return (string) self::$defaults[self::$meta_prefix . $key];
			}
			else {
				return '';
			}
		}


		/**
		 * Update a meta value for a post
		 *
		 * @param	string	$key			the internal key of the meta value to change (without prefix)
		 * @param	mixed	$meta_value		the value to set the meta to
		 * @param	int		$post_id		the ID of the post to change the meta for.
		 * @return	bool	whether the value was changed
		 */
		public static function set_value( $key, $meta_value, $post_id ) {
			return update_post_meta( $post_id, self::$meta_prefix . $key, $meta_value );
		}


		/**
		 * Used for imports, this functions imports the value of $old_metakey into $new_metakey for those post
		 * where no WPSEO meta data has been set.
		 * Optionally deletes the $old_metakey values.
		 *
		 * @param	string	$old_metakey	The old key of the meta value.
		 * @param	string	$new_metakey	The new key, usually the WPSEO meta key (including prefix).
		 * @param	bool	$delete_old		Whether to delete the old meta key/value-sets.
		 * @return	void
		 */
		public static function replace_meta( $old_metakey, $new_metakey, $delete_old = false ) {
			global $wpdb;
			
			/* Get only those rows where no wpseo meta values exist for the same post
			   (with the exception of linkdex as that will be set independently of whether the post has been edited)
			   @internal Query is pretty well optimized this way */
			$query = $wpdb->prepare(
				"
				SELECT `a`.*
				FROM {$wpdb->postmeta} AS a
				WHERE `a`.`meta_key` = %s
					AND NOT	EXISTS (
						SELECT DISTINCT `post_id` , count( `meta_id` ) AS count
						FROM {$wpdb->postmeta} AS b
						WHERE `a`.`post_id` = `b`.`post_id`
							AND `meta_key` LIKE %s
							AND `meta_key` <> %s
						GROUP BY `post_id`
					)
				;",
				$old_metakey,
				like_escape( self::$meta_prefix . '%' ),
				self::$meta_prefix . 'linkdex'

			);
			$oldies = $wpdb->get_results( $query );

			if( is_array( $oldies ) && $oldies !== array() ) {
				foreach ( $oldies as $old ) {
					update_post_meta( $old->post_id, $new_metakey, $old->meta_value );
				}
			}

			// Delete old keys
			if ( $delete_old === true ) {
				delete_post_meta_by_key( $old_metakey );
			}
		}



		/**
		 * General clean-up of the saved meta values
		 * - Remove potentially lingering old meta keys
		 * - Remove all default and invalid values
		 */
		public static function clean_up() {
			global $wpdb;

			/**
			 * Clean up '_yoast_wpseo_meta-robots'
			 *
			 * Retrieve all '_yoast_wpseo_meta-robots' meta values and convert if no new values found
			 * @internal Query is pretty well optimized this way
			 *
			 * @todo find out all possible values which the old '_yoast_wpseo_meta-robots' could contain
			 * to convert the data correctly
			 */
			$query = $wpdb->prepare(
				"
				SELECT `a`.*
				FROM {$wpdb->postmeta} AS a
				WHERE `a`.`meta_key` = %s
					AND NOT	EXISTS (
						SELECT DISTINCT `post_id` , count( `meta_id` ) AS count
						FROM {$wpdb->postmeta} AS b
						WHERE `a`.`post_id` = `b`.`post_id`
							AND ( `meta_key` = %s
							OR `meta_key` = %s )
						GROUP BY `post_id`
					)
				;",
				self::$meta_prefix . 'meta-robots',
				self::$meta_prefix . 'meta-robots-noindex',
				self::$meta_prefix . 'meta-robots-nofollow'
			);
			$oldies = $wpdb->get_results( $query );

			if ( is_array( $oldies ) && $oldies !== array() ) {
				foreach ( $oldies as $old ) {
					$old_values = explode( ',', $old->meta_value );
					foreach ( $old_values as $value ) {
						if ( $value === 'noindex' ) {
							update_post_meta( $old->post_id, self::$meta_prefix . 'meta-robots-noindex', 1 );
						}
						else if ( $value === 'nofollow' ) {
							update_post_meta( $old->post_id, self::$meta_prefix . 'meta-robots-nofollow', 1 );
						}
					}
				}
			}
			unset( $query, $oldies, $old, $old_values, $value );

			// Delete old keys
			delete_post_meta_by_key( self::$meta_prefix . 'meta-robots' );

			

			
			/**
			 * Remove all default values and (most) invalid option values
			 * Invalid option values for the multiselect (meta-robots-adv) field will be dealt with seperately
			 *
			 * @internal some of the defaults have changed in v1.5, but as the defaults will be removed and
			 * new defaults will now automatically be passed when no data found, this update is automatic
			 * (as long as we remove the old values which we do in the below routine)
			 *
			 * @internal unfortunately we can't use the normal delete_meta() with key/value combination as ''
			 * (empty string) values will be ignored and would result in all metas with that key being deleted,
			 * not just the empty fields.
			 * Still, the below implementation is largely based on the delete_meta() function
			 */
			$query = array();

			foreach ( self::$meta_fields as $subset => $field_group ) {
				foreach ( $field_group as $key => $field_def ) {
					if ( $field_def['type'] === 'snippetpreview' || ! isset( $field_def['default_value'] ) ) {
						continue;
					}

					$where_or_or = ( $query === array() ? 'WHERE' : 'OR' );

					if( $key === 'meta-robots-adv' ) {
						$query[] = $wpdb->prepare(
							" $where_or_or ( meta_key = %s AND ( meta_value = 'none' OR meta_value = '-' ) )",
							self::$meta_prefix . $key
						);
					}
					else if ( isset( $field_def['options'] ) && is_array( $field_def['options'] ) && $field_def['options'] !== array() ) {
						$valid = array_keys( $field_def['options'] );
						unset( $valid[$field_def['default_value']] ); // remove the default value

						$query[] = $wpdb->prepare(
							" $where_or_or ( meta_key = %s AND meta_value NOT IN ( '" . implode( "','", esc_sql( $valid ) ) . "' ) )",
							self::$meta_prefix . $key
						);
						unset( $valid );
					}
					else if( $field_def['default_value'] !== '' ) {
						$query[] = $wpdb->prepare(
							" $where_or_or ( meta_key = %s AND meta_value = %s )",
							self::$meta_prefix . $key,
							$field_def['default_value']
						);
					}
					else {
						$query[] = $wpdb->prepare(
							" $where_or_or ( meta_key = %s AND meta_value = '' )",
							self::$meta_prefix . $key
						);
					}
				}
			}
			unset( $subset, $field_group, $key, $field_def, $where_or_or );

			$query    = "SELECT meta_id FROM {$wpdb->postmeta} " . implode( '', $query ) . ";";
			$meta_ids = $wpdb->get_col( $query );

			if ( is_array( $meta_ids ) && $meta_ids !== array() ) {
				// wp native action
				do_action( 'delete_post_meta', $meta_ids, null, null, null );

				$query = "DELETE FROM {$wpdb->postmeta} WHERE meta_id IN( " . implode( ',', $meta_ids ) . " )";
				$count = $wpdb->query($query);

				if ( $count ) {
					foreach ( $meta_ids as $object_id ) {
						wp_cache_delete( $object_id, 'post_meta' );
					}

					// wp native action
					do_action( 'deleted_post_meta', $meta_ids, null, null, null );
				}
			}
			unset( $query, $meta_ids, $count, $object_id );
			
			
			
			/**
			 * Deal with the multiselect (meta-robots-adv) field
			 *
			 * Removes invalid option combinations, such as 'none,noarchive'
			 *
			 * Default values have already been removed, so we should have a small result set and
			 * (hopefully) even smaller set of invalid results.
			 */
			$query  = $wpdb->prepare(
				"SELECT meta_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key = %s",
				self::$meta_prefix . 'meta-robots-adv'
			);
			$oldies = $wpdb->get_results( $query );

			if ( is_array( $oldies ) && $oldies !== array() ) {
				foreach ( $oldies as $old ) {
					$clean = self::validate_meta_robots_adv( $old->meta_value );
					
					if( $clean !== $old->meta_value ) {
						if( $clean !== self::$meta_fields['advanced']['meta-robots-adv']['default_value'] ) {
							update_metadata_by_mid( 'post', $old->meta_id, $clean );
						}
						else {
							delete_metadata_by_mid( 'post', $old->meta_id );
						}
					}
				}
			}
			unset( $query, $oldies, $old, $clean );
		}


	} /* End of class */

} /* End of class-exists wrapper */