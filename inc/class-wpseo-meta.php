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
		 * Titles, help texts, description text etc are added via translate_meta_boxes() method in class-metabox.php
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
					'std'				=> '',
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'autocomplete'		=> 'off',
					'help'				=> '', // translation added later
					'description'		=> '<div id="focuskwresults"></div>',
				),
				'title'				=> array(
/*v*/					'name'				=> 'title',
					'std'				=> '',
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'description'		=> '', // translation added later
					'help'				=> '', // translation added later
				),
				'metadesc'			=> array(
/*v*/					'name'				=> 'metadesc',
					'std'				=> '',
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
					'std'				=> '',
					'class'				=> 'metakeywords',
					'type'				=> 'text',
					'title'				=> '', // translation added later
					'description'		=> '', // translation added later
				),
			),
			'advanced'	=> array(
				'meta-robots-noindex'	=> array(
/*xxx*/					'name'	  => 'meta-robots-noindex',
					'std'	  => '-',
					'type'	  => 'select',
					'title'   => '', // translation added later
					'options' => array(
						'0' => '', // translation added later
						'2' => '', // translation added later
						'1' => '', // translation added later
					),
				),
				'meta-robots-nofollow'	=> array(
/*xxx*/					'name'	  => 'meta-robots-nofollow',
					'std'	  => 'follow',
					'type'	  => 'radio',
					'title'   => '', // translation added later
					'options' => array(
						'0' => '', // translation added later
						'1' => '', // translation added later
					),
				),
				'meta-robots-adv'		=> array(
/*v*/					'name'		  => 'meta-robots-adv',
					'std'		  => 'none',
					'type'		  => 'multiselect',
					'title' 	  => '', // translation added later
					'description' => '', // translation added later
					'options'	  => array(
						'noodp' 	=> '', // translation added later
						'noydir'	=> '', // translation added later
						'noarchive' => '', // translation added later
						'nosnippet' => '', // translation added later
					),
				),
				'bctitle'				=> array(
/*v*/					'name'		  => 'bctitle',
					'std'		  => '',
					'type'		  => 'text',
					'title' 	  => '', // translation added later
					'description' => '', // translation added later
				),
				'sitemap-include' 		=> array(
/*v*/					'name'		  => 'sitemap-include',
					'std'		  => '-',
					'type'		  => 'select',
					'title' 	  => '', // translation added later
					'description' => '', // translation added later
					'options'	  => array(
						'-' 	 => '', // translation added later
						'always' => '', // translation added later
						'never'  => '', // translation added later
					),
				),
				'sitemap-prio'			=> array(
/*v*/					'name'		  => 'sitemap-prio',
					'std'		  => '-',
					'type'		  => 'select',
					'title' 	  => '', // translation added later
					'description' => '', // translation added later
					'options'	  => array(
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
/*v*/					'name'		  => 'sitemap-html-include',
					'std'		  => '-',
					'type'		  => 'select',
					'title' 	  => '', // translation added later
					'description' => '', // translation added later
					'options'	  => array(
						'-' 	 => '', // translation added later
						'always' => '', // translation added later
						'never'  => '', // translation added later
					),
				),
				'canonical'			 	=> array(
/*v*/					'name'		  => 'canonical',
					'std'		  => '',
					'type'		  => 'text',
					'title' 	  => '', // translation added later
					'description' => '', // translation added later
				),
				'redirect'			 	=> array(
/*v*/					'name'		  => 'redirect',
					'std'		  => '',
					'type'		  => 'text',
					'title' 	  => '', // translation added later
					'description' => '', // translation added later
				),
			),
			'social'	=> array(
				'opengraph-description'		=> array(
/*v*/					'name'		  => 'opengraph-description',
					'type'		  => 'textarea',
					'std'		  => '',
					'richedit'	  => false,
					'title' 	  => '', // translation added later
					'description' => '', // translation added later
				),
				'opengraph-image'			=> array(
/*v*/					'name'		  => 'opengraph-image',
					'type'		  => 'upload',
					'std'		  => '',
					'title' 	  => '', // translation added later
					'description' => '', // translation added later
				),
				'google-plus-description'	=> array(
/*v*/					'name'		  => 'google-plus-description',
					'type'		  => 'textarea',
					'std'		  => '',
					'richedit'	  => false,
					'title' 	  => '', // translation added later
					'description' => '', // translation added later
				),
			),
		);





		public static function init() {

			
			add_filter( 'wpseo_metabox_entries_general', array( __CLASS__, 'deprecated_filter_wpseo_metabox_entries' ) );
		}







		/**
		 * Retrieve the meta boxes for the given post type.
		 *
		 * @param	string	$post_type
		 * @return	array	Array containing the meta box field definitions
		 */
		public function get_general_meta_boxes( $post_type = 'post' ) {
			
			$mbs = self::$meta_fields['general'];

			$options = get_option( 'wpseo_titles' );
			if ( $options['usemetakeywords'] === true ) {
				$mbs['metakeywords']['description'] = sprintf( $mbs['metakeywords']['description'], '<a target="_blank" href="' . esc_url( admin_url( 'admin.php?page=wpseo_titles#' . urlencode( $post_type ) ) ) . '">', '</a>' );
			}
			else {
				unset( $mbs['metakeywords'] );
			}

			// Apply filters before entering the advanced section and return the result
			return apply_filters( 'wpseo_metabox_entries_general', $mbs );
		}
		
		
		/**
		 * Apply the 'wpseo_metabox_entries' filter, backward compatibility
		 *
		 * @deprecated 1.5.0
		 * @deprecated use the 'wpseo_metabox_entries_general' filter instead
		 * @see WPSEO_Meta::get_meta_boxes()
		 *
		 * @param	array	$mbs    metabox form definitions
		 * @return	array
		 */
		public static function deprecated_filter_wpseo_metabox_entries( $mbs ) {
			_deprecated_function( 'Filter "wpseo_metabox_entries"', 'WPSEO 1.5.0', 'wpseo_metabox_entries_general' );
			return apply_filters( 'wpseo_metabox_entries', $mbs ); // old deprecated
		}


		/**
		 * Retrieve the meta boxes for the advanced tab.
		 *
		 * @return	array	Array containing the meta box field definitions
		 */
		public function get_advanced_meta_boxes() {
			global $post;
	
			$post_type = '';
			if ( isset( $post->post_type ) )
				$post_type = $post->post_type;
			else if ( ! isset( $post->post_type ) && isset( $_GET['post_type'] ) )
				$post_type = sanitize_text_field( $_GET['post_type'] );

			$options = WPSEO_Options::get_all();
	
			$mbs = self::$meta_fields['advanced'];
	
			$mbs['meta-robots-noindex']['options']['0'] = sprintf( $mbs['meta-robots-noindex']['options']['0'], ( ( isset( $options['noindex-' . $post_type] ) && $options['noindex-' . $post_type] === true ) ? 'noindex' : 'index' ) );

			if ( $options['breadcrumbs-enable'] !== true ) {
				unset( $mbs['bctitle'] );
			}
			if ( $options['enablexmlsitemap'] !== true ) {
				unset( $mbs['sitemap-include'], $mbs['sitemap-prio'] );
			}

			// Apply filters for in advanced section and return the result
			return apply_filters( 'wpseo_metabox_entries_advanced', $mbs );
		}
	

		/**
		 * Define the meta boxes for the Social tab
		 *
		 * @return	array	Array containing the meta box field definitions
		 */
		public function get_social_meta_boxes() {
			// Apply filters for in social section and return the result
			return apply_filters( 'wpseo_metabox_entries_social', self::$meta_fields['social'] );
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
	
	
	
	
/**
 * To use for checking for default value
 *
 * If = default value, stop the saving and delete existing key if exists
 */
	
/*function myplugin_init() {
	add_filter( 'update_user_metadata', 'myplugin_update_foo', 10, 5 );
}

function myplugin_update_foo( $null, $object_id, $meta_key, $meta_value, $prev_value ) {

	if ( 'foo' == $meta_key && empty( $meta_value ) ) {
		return true; // this means: stop saving the value into the database
	}

	return null; // this means: go on with the normal execution in meta.php

}

add_action( 'init', 'myplugin_init' );

*/

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
		 * @param string $meta	 the meta to change
		 * @param mixed  $val	 the value to set the meta to
		 * @param int	 $postid the ID of the post to change the meta for.
		 */
		public static function set_value( $meta, $val, $postid ) {
			update_post_meta( $postid, '_yoast_wpseo_' . $meta, $val );
		}
		
		
		
		
		public static function save_post() {
			// Validate & save
			// = action, not filter, do call update_post_meta/delete_post_meta
		}


	}
	// File is loaded from wpseo-functions.php on action plugins_loaded set in wp-seo.php
//	WPSEO_Meta::plugins_loaded();
}
