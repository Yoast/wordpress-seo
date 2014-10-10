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
		 * The field in the database where meta field is saved.
		 * @var string
		 */
		protected $target_db_field = 'metadesc';

		/**
		 * The columns shown on the table
		 *
		 * @return array
		 */
		public function get_columns() {
			$columns = array(
				'col_existing_yoast_seo_metadesc' => __( 'Existing Yoast Meta Description', 'wordpress-seo' ),
				'col_new_yoast_seo_metadesc'      => __( 'New Yoast Meta Description', 'wordpress-seo' ),
			);

				return parent::get_columns( $columns );

		}

		protected function parse_page_specific_column( $column_name, $record, $attributes ) {

			// Fill meta data if exists in $this->meta_data
			$meta_data = ( ! empty( $this->meta_data[$record->ID] ) ) ? $this->meta_data[$record->ID] : array();

			switch ( $column_name ) {

				case 'col_new_yoast_seo_metadesc' :
					return sprintf( '<textarea id="%1$s" name="%1$s" class="wpseo-new-metadesc" data-id="%2$s"></textarea>', 'wpseo-new-metadesc-' . $record->ID, $record->ID );
					break;


				case 'col_existing_yoast_seo_metadesc':
					echo $this->parse_meta_data_field($record->ID, $attributes );
					break;
			}
		}

	} /* End of class */
} /* End of class-exists wrapper */
