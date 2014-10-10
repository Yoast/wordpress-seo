<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


if ( ! class_exists( 'WPSEO_Bulk_Title_Editor_List_Table' ) ) {
	/**
	 *
	 */
	class WPSEO_Bulk_Title_Editor_List_Table extends WPSEO_Bulk_List_Table {

		/**
		 * Current type for this class will be title
		 *
		 * @var string
		 */
		protected $page_type = 'title';


		/**
		 * Settings with are used in __construct
		 *
		 * @var array
		 */
		protected $settings = array(
			'singular' => 'wpseo_bulk_title',
			'plural'   => 'wpseo_bulk_titles',
			'ajax'     => true,
		);

		/**
		 * The field in the database where meta field is saved.
		 * @var string
		 */
		protected $target_db_field = 'title';

		/**
		 * The columns shown on the table
		 *
		 * @return array
		 */
		function get_columns() {

			return $columns = array(
				'col_page_title'               => __( 'WP Page Title', 'wordpress-seo' ),
				'col_post_type'                => __( 'Post Type', 'wordpress-seo' ),
				'col_post_status'              => __( 'Post Status', 'wordpress-seo' ),
				'col_post_date'                => __( 'Publication date', 'wordpress-seo' ),
				'col_page_slug'                => __( 'Page URL/Slug', 'wordpress-seo' ),
				'col_existing_yoast_seo_title' => __( 'Existing Yoast SEO Title', 'wordpress-seo' ),
				'col_new_yoast_seo_title'      => __( 'New Yoast SEO Title', 'wordpress-seo' ),
				'col_row_action'               => __( 'Action', 'wordpress-seo' ),
			);
		}

		protected function parse_page_specific_column( $column_name, $record, $attributes ) {

			// Fill meta data if exists in $this->meta_data
			$meta_data = ( ! empty( $this->meta_data[$record->ID] ) ) ? $this->meta_data[$record->ID] : array();


			switch ( $column_name ) {

				case 'col_existing_yoast_seo_title':
					$cell_value = ( ( ! empty( $meta_data[WPSEO_Meta::$meta_prefix . 'title'] ) ) ? $meta_data[WPSEO_Meta::$meta_prefix . 'title'] : '' );
					echo sprintf( '<td %2$s id="wpseo-existing-title-%3$s">%1$s</td>', $cell_value, $attributes, $record->ID );
					break;

				case 'col_new_yoast_seo_title':
					return sprintf( '<input type="text" id="%1$s" name="%1$s" class="wpseo-new-title" data-id="%2$s" />', 'wpseo-new-title-' . $record->ID, $record->ID );
					break;
			}

			unset( $meta_data );
		}


	} /* End of class */
} /* End of class-exists wrapper */
