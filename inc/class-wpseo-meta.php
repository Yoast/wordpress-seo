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
	 * Please note: all methods and properties are static. This class is not instantiated and does not have to be.
	 * Class is basically used as an alternative way of namespacing our functions and variables
	 */
	class WPSEO_Meta {

/* @todo
Found in db, not as form = taxonomy meta data. Should be kept separate, but maybe we should add validation to it too.
(1697, 'wpseo_taxonomy_meta', 'a:1:{s:8:"category";a:4:{i:4;a:3:{s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";s:10:"wpseo_desc";s:6:"testje";}i:2;a:2:{s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";}i:1;a:2:{s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";}i:7;a:3:{s:10:"wpseo_desc";s:4:"test";s:13:"wpseo_noindex";s:7:"default";s:21:"wpseo_sitemap_include";s:1:"-";}}}', 'yes'),
*/

		public static $meta_prefix = '_yoast_wpseo_';


		/**
		 * @var int $meta_length Allowed length of the meta description.
		 */
		public static $meta_length = 156;

		/**
		 * @var string $meta_length_reason Reason the meta description is not the default length.
		 */
		public static $meta_length_reason = '';



		public $defaults = array(

/*v*/			'_yoast_wpseo_focuskw'					=> '',
/*v*/			'_yoast_wpseo_title'					=> '',
/*v*/			'_yoast_wpseo_metadesc'					=> '',
/*v*/			'_yoast_wpseo_metakeywords'				=> '',


/*xxx*/			'_yoast_wpseo_meta-robots-noindex'		=> '0', // vs '-'
/*xxx*/			'_yoast_wpseo_meta-robots-nofollow'		=> '0', // vs 'follow'
/*v*/			'_yoast_wpseo_meta-robots-adv'			=> 'none',
			'_yoast_wpseo_meta-robots-adv'			=> '', // ????

/*v*/			'_yoast_wpseo_bctitle'					=> '',
/*v*/			'_yoast_wpseo_sitemap-prio'				=> '-',
/*v*/			'_yoast_wpseo_sitemap-include'			=> '-',
/*v*/			'_yoast_wpseo_sitemap-html-include'		=> '-',
/*v*/			'_yoast_wpseo_canonical'				=> '',
/*v*/			'_yoast_wpseo_redirect'					=> '',



/*v*/			'_yoast_wpseo_opengraph-description'	=> '',
/*v*/			'_yoast_wpseo_opengraph-image'			=> '',
/*v*/			'_yoast_wpseo_google-plus-description'	=> '',



// Check:
			'_yoast_wpseo_linkdex'					=> '0',
			'_yoast_wpseo_meta-robots'				=> 'index,follow',
		);


		/**
		 * @var	array	$metaboxes	Meta box definitions for form
		 *
		 * - Titles, help texts, description text etc are added via translate_meta_boxes() method in class-metabox.php
		 * - Beware: even though the meta keys are divided into subsets, they still have to be uniquely named!
		 *
		 * @todo check if we can get rid of the 'name' item as it is the same as the array key
		 */
		public static $meta_fields = array(
			'general'	=> array(
				'snippetpreview'	=> array(
					'name'				=> 'snippetpreview',
					'type'				=> 'snippetpreview',
					'title'				=> '', // translation added later
				),
				'focuskw' 	   		=> array(
/*v*/					'name'				=> 'focuskw',
					'default_value'		=> '',
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'autocomplete'		=> 'off',
					'help'				=> '', // translation added later
					'description'		=> '<div id="focuskwresults"></div>',
				),
				'title'				=> array(
/*v*/					'name'				=> 'title',
					'default_value'		=> '',
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'description'		=> '', // translation added later
					'help'				=> '', // translation added later
				),
				'metadesc'			=> array(
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
				'metakeywords'		=> array(
/*v*/					'name'				=> 'metakeywords',
					'default_value'		=> '',
					'class'				=> 'metakeywords',
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'description'		=> '', // translation added later
				),
			),
			'advanced'	=> array(
				'meta-robots-noindex'	=> array(
/*xxx*/					'name'			=> 'meta-robots-noindex',
					'default_value'	=> '-',
					'type'			=> 'select',
					'title' 		=> '', // translation added later
					'options'		=> array(
						'0' 	=> '', // translation added later
						'2' 	=> '', // translation added later
						'1' 	=> '', // translation added later
					),
				),
				'meta-robots-nofollow'	=> array(
/*xxx*/					'name'			=> 'meta-robots-nofollow',
					'default_value'	=> 'follow',
					'type'			=> 'radio',
					'title'			=> '', // translation added later
					'options'		=> array(
						'0' 	=> '', // translation added later
						'1' 	=> '', // translation added later
					),
				),
				'meta-robots-adv'		=> array(
/*v*/					'name'				=> 'meta-robots-adv',
					'default_value'	=> 'none',
					'type'			=> 'multiselect',
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
					'options'		=> array(
						'noodp' 		=> '', // translation added later
						'noydir'		=> '', // translation added later
						'noarchive' 	=> '', // translation added later
						'nosnippet' 	=> '', // translation added later
					),
				),
				'bctitle'				=> array(
/*v*/					'name'			=> 'bctitle',
					'default_value'	=> '',
					'type'			=> 'text',
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
				'sitemap-include' 		=> array(
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
				'sitemap-prio'			=> array(
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
				'sitemap-html-include'	=> array(
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
				'canonical'			 	=> array(
/*v*/					'name'			=> 'canonical',
					'default_value'	=> '',
					'type'			=> 'text',
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
				'redirect'			 	=> array(
/*v*/					'name'			=> 'redirect',
					'default_value'	=> '',
					'type'			=> 'text',
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
			),
			'social'	=> array(
				'opengraph-description'		=> array(
/*v*/					'name'			=> 'opengraph-description',
					'type'			=> 'textarea',
					'default_value'	=> '',
					'richedit'		=> false,
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
				'opengraph-image'			=> array(
/*v*/					'name'			=> 'opengraph-image',
					'type'			=> 'upload',
					'default_value'	=> '',
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
				'google-plus-description'	=> array(
/*v*/					'name'			=> 'google-plus-description',
					'type'			=> 'textarea',
					'default_value'	=> '',
					'richedit'		=> false,
					'title' 		=> '', // translation added later
					'description'	=> '', // translation added later
				),
			),
		);
		
		
		public static $fields_index = array();





		public static function init() {

			foreach( self::$meta_fields as $subset => $field_group ) {
				foreach( $field_group as $key => $field_def ) {
					if ( isset( $field_def['default_value'] ) ) {
						//add_filter( 'sanitize_post_meta_' . self::$meta_prefix . $key, array( __CLASS__, 'sanitize_post_meta' ), 10, 2 );
						// Probably better to use: (undocumented function), this adds the sanitation callback
						register_meta( 'post', self::$meta_prefix . $key, array( __CLASS__, 'sanitize_post_meta' ) );
						
						// Set the $fields_index property for efficiency
						self::$fields_index[self::$meta_prefix . $key] = array(
							'subset' => $subset,
							'key'	 => $key,
						);

					}
				}
			}

			add_filter( 'update_post_metadata', array( __CLASS__, 'remove_meta_if_default' ), 10, 5 );
			add_filter( 'add_post_metadata', array( __CLASS__, 'dont_save_meta_if_default' ), 10, 5 );



			add_filter( 'wpseo_metabox_entries_general', array( __CLASS__, 'deprecated_filter_wpseo_metabox_entries' ) );
		}







		/**
		 * Retrieve the meta box form field definitions for the given post type.
		 *
		 * @param	string	$post_type
		 * @return	array	Array containing the meta box field definitions
		 */
		public function get_meta_field_defs( $tab, $post_type = 'post' ) {
			if ( ! isset( self::$meta_fields[$tab] ) ) {
				return array();
			}
			
			$field_defs = self::$meta_fields[$tab];

			switch( $tab ) {
				case 'general':
					$options = get_option( 'wpseo_titles' );
					if ( $options['usemetakeywords'] === true ) {
						$field_defs['metakeywords']['description'] = sprintf( $field_defs['metakeywords']['description'], '<a target="_blank" href="' . esc_url( admin_url( 'admin.php?page=wpseo_titles#' . urlencode( $post_type ) ) ) . '">', '</a>' );
					}
					else {
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

					$post_type = '';
					if ( isset( $post->post_type ) ) {
						$post_type = $post->post_type;
					}
					else if ( ! isset( $post->post_type ) && isset( $_GET['post_type'] ) ) {
						$post_type = sanitize_text_field( $_GET['post_type'] );
					}
			
					$options = WPSEO_Options::get_all();
			
					$field_defs['meta-robots-noindex']['options']['0'] = sprintf( $field_defs['meta-robots-noindex']['options']['0'], ( ( isset( $options['noindex-' . $post_type] ) && $options['noindex-' . $post_type] === true ) ? 'noindex' : 'index' ) );
			
					if ( $options['breadcrumbs-enable'] !== true ) {
						unset( $field_defs['bctitle'] );
					}
					if ( $options['enablexmlsitemap'] !== true ) {
						unset( $field_defs['sitemap-include'], $field_defs['sitemap-prio'] );
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





		public static function sanitize_post_meta( $meta_value, $meta_key ) {
			$internal_key = self::$fields_index[$meta_key]['key'];
			$field_def    = self::$meta_fields[self::$fields_index[$meta_key]['subset']][$internal_key];
			
			$clean = $field_def['default_value'];


			switch( $field_def['type'] ) {
				case 'checkbox':
					break;
					
				case '':
					break;
					
				case '':
					break;
			}
			
			return $clean;
			
			
			
/*
			if ( 'checkbox' == $meta_box['type'] ) {
				if ( isset( $_POST['yoast_wpseo_' . $meta_box['name']] ) )
					$data = 'on';
				else
					$data = 'off';
			}
			else if ( 'multiselect' == $meta_box['type'] ) {
				if ( isset( $_POST['yoast_wpseo_' . $meta_box['name']] ) ) {
					if ( is_array( $_POST['yoast_wpseo_' . $meta_box['name']] ) )
						$data = implode( ',', $_POST['yoast_wpseo_' . $meta_box['name']] );
					else
						$data = $_POST['yoast_wpseo_' . $meta_box['name']];
				}
				else {
					continue;
				}
			}
			else {
				if ( isset( $_POST['yoast_wpseo_' . $meta_box['name']] ) )
					$data = $_POST['yoast_wpseo_' . $meta_box['name']];
				else
					continue;
			}

			// Prevent saving "empty" values.
			if ( ! in_array( $data, array( '', '0', 'none', '-', 'index,follow' ) ) ) {
				self::set_value( $meta_box['name'], sanitize_text_field( $data ), $post_id );
			}
			else if ( $data == '' ) {
				// If we don't do this, we prevent people from reverting to the default title or description.
				delete_post_meta( $post_id, '_yoast_wpseo_' . $meta_box['name'] );
			}
*/
		}


		public static function sanitize_general_focuskw() {
/*
					'default_value'		=> '',
					'type'				=> 'text',
*/
		}

		public static function sanitize_general_title() {
/*
					'default_value'		=> '',
					'type'				=> 'text',
*/
		}

		public static function sanitize_general_metadesc() {
/*
					'default_value'		=> '',
					'type'				=> 'textarea',
					'richedit'			=> false,
*/
		}
		public static function sanitize_general_metakeywords() {
/*
					'default_value'		=> '',
					'type'				=> 'text',
*/
		}

		public static function sanitize_advanced_meta_robots_noindex() {
/*
					'default_value'	=> '-',
					'type'			=> 'select',
					'options'		=> array(
						'0' 	=> '', // translation added later
						'2' 	=> '', // translation added later
						'1' 	=> '', // translation added later
					),

/*xxx* /			'_yoast_wpseo_meta-robots-noindex'		=> '0', // vs '-'
*/
		}


		public static function sanitize_advanced_meta_robots_nofollow() {
/*
					'default_value'	=> 'follow',
					'type'			=> 'radio',
					'options'		=> array(
						'0' 	=> '', // translation added later
						'1' 	=> '', // translation added later
					),

/*xxx* /			'_yoast_wpseo_meta-robots-nofollow'		=> '0', // vs 'follow'
*/
		}

		public static function sanitize_advanced_meta_robots_adv() {
/*
					'default_value'	=> 'none',
					'type'			=> 'multiselect',
					'options'		=> array(
						'noodp' 		=> '', // translation added later
						'noydir'		=> '', // translation added later
						'noarchive' 	=> '', // translation added later
						'nosnippet' 	=> '', // translation added later
					),
*/
		}

		public static function sanitize_advanced_bctitle() {
/*
					'default_value'	=> '',
					'type'			=> 'text',
*/
		}

		public static function sanitize_advanced_sitemap_include() {
/*
					'default_value'	=> '-',
					'type'		  	=> 'select',
					'options'	  	=> array(
						'-' 	 => '', // translation added later
						'always' => '', // translation added later
						'never'  => '', // translation added later
					),
*/
		}

		public static function sanitize_advanced_sitemap_prio() {
/*
					'default_value'	=> '-',
					'type'			=> 'select',
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
*/
		}

		public static function sanitize_advanced_sitemap_html_include() {
/*
					'default_value'	=> '-',
					'type'			=> 'select',
					'options'		=> array(
						'-' 			=> '', // translation added later
						'always'		=> '', // translation added later
						'never' 		=> '', // translation added later
					),
*/
		}

		public static function sanitize_advanced_canonical() {
/*
					'default_value'	=> '',
					'type'			=> 'text',
*/
		}
		
		public static function sanitize_advanced_redirect() {
/*
					'default_value'	=> '',
					'type'			=> 'text',
*/
		}

		public static function sanitize_social_opengraph_description() {
/*
					'type'			=> 'textarea',
					'default_value'	=> '',
					'richedit'		=> false,
*/
		}
		
		public static function sanitize_social_opengraph_image() {
/*
					'type'			=> 'upload',
					'default_value'	=> '',
*/
		}
		
		public static function sanitize_social_google_plus_description() {
/*
					'type'			=> 'textarea',
					'default_value'	=> '',
					'richedit'		=> false,
*/
		}









/**
 * Use this for adding auto-sanitizion of meta values
 */
/*$clean_value = sanitize_meta( 'birth-year', $user_input, 'user' );

function sanitize_birth_year_meta( $year ) {

	$now = date( 'Y' );
	$then = $now - 115; // No users older than 115.

	if ( $then > $year || $year > $now ) {

		wp_die( 'Invalid entry, go back and try again.' );
	}

	return $year;
}
add_filter( 'sanitize_user_meta_birth-year', 'sanitize_birth_year_meta' );
*/



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

		public static function dont_save_meta_if_default( $null, $object_id, $meta_key, $meta_value, $unique = false ) {
			// If it's one of our meta fields, check against default
			if ( isset( self::$fields_index[$meta_key] ) && self::meta_value_is_default( $meta_key, $meta_value ) === true ) {
				return true; // stop saving the value
			}
			return null; // go on with the normal execution (add) in meta.php
		}


		/**
		 * Is the given meta value the same as the default value ?
		 *
		 * @param	string	$meta_key	Meta key to check against
		 * @param	mixed	$meta_value	The value to check
		 * @return	bool
		 */
		public static function meta_value_is_default( $meta_key, $meta_value ) {
			return ( isset( self::$fields_index[$meta_key] ) && $meta_value === self::$meta_fields[self::$fields_index[$meta_key]['subset']][self::$fields_index[$meta_key]['key']]['default_value'] );
		}



/*  	   on get all meta: array_merge with defaults


	   on save meta:
	   
	   array intersect (?) with defaults to only have the values which are not default
	   then walk through the default values list
	   foreach
	   		  switch()
	   		  		  if exists
	   		  		  	 -> validate


		if not exists in clean: delete



		// add meta box functions ?
		
		// render meta box functions ?


		/**
		 * Get the value from the post custom values
		 *
		 * @param string $val	 name of the value to get
		 * @param int	 $postid post ID of the post to get the value for
		 * @return bool|mixed
		 */
		public static function get_value( $val, $postid = 0 ) {
			$postid = absint( $postid );
			if ( $postid === 0 ) {
				global $post;
				if ( isset( $post ) && isset( $post->post_status ) && $post->post_status != 'auto-draft')
					$postid = $post->ID;
				else
					return false;
			}
			$custom = get_post_custom( $postid );
			if ( ! empty( $custom['_yoast_wpseo_' . $val][0] ) )
				return maybe_unserialize( $custom['_yoast_wpseo_' . $val][0] );
			else
				return false;
		}
		
		/**
		 * Update a meta value for a post
		 *
		 * @param	string	$meta_key		the meta to change
		 * @param	mixed	$meta_value		the value to set the meta to
		 * @param	int		$post_id		the ID of the post to change the meta for.
		 * @return	bool	whether the value was changed
		 */
		public static function set_value( $meta_key, $meta_value, $post_id ) {
			return update_post_meta( $post_id, self::prefix . $meta_key, $meta_value );
		}
		
		
		
		
		public static function save_post() {
			// Validate & save
			// = action, not filter, do call update_post_meta/delete_post_meta
		}


	} /* End of class */
	
	// File is loaded from wpseo-functions.php on action plugins_loaded set in wp-seo.php
//	WPSEO_Meta::plugins_loaded();

} /* End of class-exists wrapper */
