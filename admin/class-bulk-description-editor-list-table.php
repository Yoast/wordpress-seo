<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


if ( ! class_exists( 'WPSEO_Bulk_Description_List_Table' ) ) {
	/**
	 *
	 */
	class WPSEO_Bulk_Description_List_Table extends WPSEO_Bulk_List_Table {


		/**
		 * Current type for this class will be (meta) description.
		 *
		 * @var string
		 */
		protected $page_type = 'description';

		/**
		 * Settings with are used in __construct
		 *
		 * @var array
		 */
		protected $settings = array(
			'singular' => 'wpseo_bulk_description',
			'plural'   => 'wpseo_bulk_descriptions',
			'ajax'     => true,
		);

		/**
		 * The columns shown on the table
		 *
		 * @return array
		 */
		function get_columns() {
			return $columns = array(
				'col_page_title'                  => __( 'WP Page Title', 'wordpress-seo' ),
				'col_post_type'                   => __( 'Post Type', 'wordpress-seo' ),
				'col_post_status'                 => __( 'Post Status', 'wordpress-seo' ),
				'col_page_slug'                   => __( 'Page URL/Slug', 'wordpress-seo' ),
				'col_existing_yoast_seo_metadesc' => __( 'Existing Yoast Meta Description', 'wordpress-seo' ),
				'col_new_yoast_seo_metadesc'      => __( 'New Yoast Meta Description', 'wordpress-seo' ),
				'col_row_action'                  => __( 'Action', 'wordpress-seo' ),
			);
		}

		/**
		 * Method for setting the meta data, whichs belongs to the records that will be shown on the current page
		 *
		 * This method will loop through the current items ($this->items) for getting the post_id. With this data
		 * ($needed_ids) the method will query the meta-data table for getting the metadescription.
		 *
		 */
		function get_meta_data() {

			global $wpdb;

			$needed_ids = array();
			foreach($this->items AS $item) {
				$needed_ids[] = $item->ID;
			}

			$post_ids  = "'" . implode( "', '", $needed_ids ) . "'";
			$meta_data = $wpdb->get_results(
				"
				 	SELECT *
				 	FROM {$wpdb->postmeta}
				 	WHERE post_id IN({$post_ids}) && meta_key = '". WPSEO_Meta::$meta_prefix ."metadesc'
				"
			);

			foreach($meta_data AS $row) {
				$this->meta_data[ $row->post_id ][ $row->meta_key ] = $row->meta_value;
			}

			// Little housekeeping
			unset( $needed_ids, $post_ids, $meta_data);

		}


	} /* End of class */
} /* End of class-exists wrapper */
