<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


if ( ! class_exists( 'WPSEO_Bulk_Index_Editor_List_Table' ) ) {
	/**
	 *
	 */
	class WPSEO_Bulk_Index_Editor_List_Table extends WPSEO_Bulk_List_Table {

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
		protected $target_db_field = 'meta-robots-noindex';


		/**
		 * The columns shown on the table
		 *
		 * @return array
		 */
        public function get_columns() {
			$columns = array(
				'col_existing_yoast_robot_index' => __( 'Existing Yoast Robot Index', 'wordpress-seo' ),
				'col_new_yoast_robot_index'      => __( 'New Yoast Robot Index', 'wordpress-seo' ),
			);

            return parent::get_columns( $columns );
		}


        protected function parse_page_specific_column( $column_name, $record, $attributes ) {

            switch ( $column_name ) {
                case 'col_existing_yoast_seo_title':
                    echo $this->parse_meta_data_field($record->ID, $attributes );
                    break;

                case 'col_new_yoast_seo_title':
                    return sprintf( '<input type="text" id="%1$s" name="%1$s" class="wpseo-new-title" data-id="%2$s" />', 'wpseo-new-title-' . $record->ID, $record->ID );
                    break;
            }

            unset( $meta_data );
        }


	} /* End of class */
} /* End of class-exists wrapper */
