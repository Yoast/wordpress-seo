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

/* @todo
Found in db, not as form = taxonomy meta data. Should be kept separate, but maybe we should add validation to it too.
(1697, 'wpseo_taxonomy_meta', 'a:1:{s:8:"category";a:4:{i:4;a:3:{s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";s:10:"wpseo_desc";s:6:"testje";}i:2;a:2:{s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";}i:1;a:2:{s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";}i:7;a:3:{s:10:"wpseo_desc";s:4:"test";s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";}}}', 'yes'),
*/


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
		 *													  an empty value
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
		 *
		 * @todo check if we can get rid of the 'name' item as it is the same as the array key
		 */
		public static $meta_fields = array(
			'general'	=> array(
/*verified*/				'snippetpreview'	=> array(
					'name'				=> 'snippetpreview',
					'type'				=> 'snippetpreview',
					'title'				=> '', // translation added later
				),
/*verified*/				'focuskw' 	   		=> array(
/*v*/					'name'				=> 'focuskw',
					'default_value'		=> '',
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'autocomplete'		=> false,
					'help'				=> '', // translation added later
					'description'		=> '<div id="focuskwresults"></div>',
				),
/*verified*/				'title'				=> array(
/*v*/					'name'				=> 'title',
					'default_value'		=> '',
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'description'		=> '', // translation added later
					'help'				=> '', // translation added later
				),
/*verified*/				'metadesc'			=> array(
/*v*/					'name'				=> 'metadesc',
					'default_value'		=> '',
					'class'				=> 'metadesc',
					'type'				=> 'textarea',
					'title'				=> '', // translation added later
					'rows'				=> 2,
					'richedit'			=> false,
					'description'		=> '', // translation added later
					'help'				=> '', // translation added later
				),
/*verified*/				'metakeywords'		=> array(
/*v*/					'name'				=> 'metakeywords',
					'default_value'		=> '',
					'class'				=> 'metakeywords',
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'description'		=> '', // translation added later
				),
			),
			'advanced'	=> array(
/*verified*/				'meta-robots-noindex'	=> array(
/*xxx*/					'name'			=> 'meta-robots-noindex',
					// @todo in upgrade routine verify values
					'default_value'	=> '0', // = post-type default - !!!! changed default, was invalid value '-'
					'type'			=> 'select',
					'title' 		=> '', // translation added later
					'options'		=> array(
						'0' 	=> '', // post type default - translation added later
						'2' 	=> '', // index - translation added later
						'1' 	=> '', // no-index - translation added later
					),
				),
/*verified*/				'meta-robots-nofollow'	=> array(
/*xxx*/					'name'			=> 'meta-robots-nofollow',
					// @todo in upgrade routine verify values
					'default_value'	=> '0', // = follow - there may be some saved 'follow' values floating around

					'type'			=> 'radio',
					'title'			=> '', // translation added later
					'options'		=> array(
						'0' 	=> '', // follow - translation added later
						'1' 	=> '', // no-follow - translation added later
					),
				),
/*verified*/				'meta-robots-adv'		=> array(
/*v*/					'name'				=> 'meta-robots-adv',
					// @todo in upgrade routine verify values and change from single 'none' to '-' to maintain the same behaviour as the olde plugin versions had
					'default_value'	=> '-', // !!!! changed default, was none
					'type'			=> 'multiselect',
					'title' 		=> '', // translation added later
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
/*verified*/				'bctitle'				=> array(
/*v*/					'name'			=> 'bctitle',
					'default_value'	=> '',
					'type'			=> 'text',
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
/*verified*/				'sitemap-include' 		=> array(
/*v*/					'name'			  => 'sitemap-include',
					'default_value'	=> '-',
					'type'		  	=> 'select',
					'title' 	  	=> '', // translation added later
					'description' 	=> '', // translation added later
					'options'	  	=> array(
						'-' 	 => '', // translation added later
						'always' => '', // translation added later
						'never'  => '', // translation added later
					),
				),
/*verified*/				'sitemap-prio'			=> array(
/*v*/					'name'			=> 'sitemap-prio',
					'default_value'	=> '-',
					'type'			=> 'select',
					'title' 		=> '', // translation added later
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
/*verified*/				'sitemap-html-include'	=> array(
/*v*/					'name'			=> 'sitemap-html-include',
					'default_value'	=> '-',
					'type'			=> 'select',
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
					'options'		=> array(
						'-' 			=> '', // translation added later
						'always'		=> '', // translation added later
						'never' 		=> '', // translation added later
					),
				),
/*verified*/				'canonical'			 	=> array(
/*v*/					'name'			=> 'canonical',
					'default_value'	=> '',
					'type'			=> 'text',
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
/*verified*/				'redirect'			 	=> array(
/*v*/					'name'			=> 'redirect',
					'default_value'	=> '',
					'type'			=> 'text',
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
			),
			'social'	=> array(
/*verified*/				'opengraph-description'		=> array(
/*v*/					'name'			=> 'opengraph-description',
					'type'			=> 'textarea',
					'default_value'	=> '',
					'richedit'		=> false,
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
/*verified*/				'opengraph-image'			=> array(
/*v*/					'name'			=> 'opengraph-image',
					'type'			=> 'upload',
					'default_value'	=> '',
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
				/* @todo verify where this is used... it doesn't seem to be retrieve anywhere... */
/*verified*/				'google-plus-description'	=> array(
/*v*/					'name'			=> 'google-plus-description',
					'type'			=> 'textarea',
					'default_value'	=> '',
					'richedit'		=> false,
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
			),
			
			/* Fields we should validate & save, but not show on any form */
			'non_form'	=> array(
/*verified*/				'linkdex'	=> array(
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
		 * Retrieve the meta box form field definitions for the given post type.
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
		 *
		 * @param	mixed	$meta_value	The new value
		 * @param	string	$meta_key	The full meta key (including prefix)
		 * @return	string				Validated meta value
		 */
		public static function sanitize_post_meta( $meta_value, $meta_key ) {
			$internal_key = self::$fields_index[$meta_key]['key'];
			$field_def    = self::$meta_fields[self::$fields_index[$meta_key]['subset']][$internal_key];
			
			$clean = self::$defaults[$meta_key];

//trigger_error( 'Sanitation routine:: Current meta key: ' . $meta_key . ', meta value: ' . $meta_value );
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
					/**
					 * @todo - upgrade routine: with the old way of saving all sorts of strange values
					 * could have resulted, the key name as the value, combinations which included none.
					 * Basically all the values for this key need verifying!
					 * Also: the default has changed from 'none' to '-', check how we want to deal with that
					 *
					 *
					 * @todo Verify with @yoast that this logic for the prioritisation is correct
					 */
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
								if ( isset( $field_def['options'][$value] ) ) {
									$cleaning[] = $value;
								}
							}
							if ( $cleaning !== array() ) {
								$clean = implode( ',', $cleaning );
							}
							unset( $cleaning, $value );
						}
					}
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
			
			
//trigger_error( 'Sanitation routine:: Current meta key: ' . $meta_key . ', clean value: ' . $meta_value );

			return $clean;
		}






/**
83	 * Update metadata for the specified object. If no value already exists for the specified object
84	 * ID and metadata key, the metadata will be added.
85	 *
86	 * @since 2.9.0
87	 * @uses $wpdb WordPress database object for queries.
88	 * @uses do_action() Calls 'update_{$meta_type}_meta' before updating metadata with meta_id of
89	 *				metadata entry to update, object ID, meta key, and meta value
90	 * @uses do_action() Calls 'updated_{$meta_type}_meta' after updating metadata with meta_id of
91	 *				updated metadata entry, object ID, meta key, and meta value
92	 *
93	 * @param string $meta_type Type of object metadata is for (e.g., comment, post, or user)
94	 * @param int $object_id ID of the object metadata is for
95	 * @param string $meta_key Metadata key
96	 * @param mixed $meta_value Metadata value. Must be serializable if non-scalar.
97	 * @param mixed $prev_value Optional. If specified, only update existing metadata entries with
98	 *				the specified value. Otherwise, update all entries.
99	 * @return bool True on successful update, false on failure.
100	 */
//101	function update_metadata($meta_type, $object_id, $meta_key, $meta_value, $prev_value = '') {
	

	
	
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
			// If it's one of our meta fields, check against default
			if ( isset( self::$fields_index[$meta_key] ) && self::meta_value_is_default( $meta_key, $meta_value ) === true ) {
				if ( $prev_value !== '' ) {
/*
* @param mixed $meta_value Optional. Metadata value. Must be serializable if non-scalar. If specified, only delete metadata entries with this value. Otherwise, delete all entries with the specified meta_key.
*/
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
			// If it's one of our meta fields, check against default
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
		 * @todo check all uses!!!!!!
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
				self::$meta_prefix . '%',
				self::$meta_prefix . 'linkdex'

			);
			$oldies = $wpdb->get_results( $query );

			foreach ( $oldies as $old ) {
				update_post_meta( $old->post_id, $new_metakey, $old->meta_value );
			}

			// Delete old keys
			if ( $delete_old === true ) {
				delete_post_meta_by_key( $old_metakey );
			}
		}


	} /* End of class */

} /* End of class-exists wrapper */