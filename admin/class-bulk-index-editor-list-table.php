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
		protected $page_type = 'index';


		/**
		 * Settings with are used in __construct
		 *
		 * @var array
		 */
		protected $settings = array(
			'singular' => 'wpseo_bulk_index',
			'plural'   => 'wpseo_bulk_indexes',
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

            $meta_data_values = $this->get_meta_data_values( $record->post_type );

            switch ( $column_name ) {
                case 'col_existing_yoast_robot_index':
                    echo $this->parse_meta_data_field($record->ID, $attributes, $this->get_meta_data_values( $record->post_type ) );
                    break;

                case 'col_new_yoast_robot_index':
                    $options = '';
                    foreach( $meta_data_values AS $key => $value  ) {
                        $options .= "<option value='{$key}'>{$value}</option>";
                    }
                    return sprintf( '<select id="%1$s" name="%1$s" class="wpseo-new-index" data-id="%2$s">%3$s</select>', 'wpseo-new-index-' . $record->ID, $record->ID, $options );
                    break;
            }

            unset( $meta_data );
        }

        protected function get_meta_data_values( $post_type ) {
            static $options;
            static $values;

            if ( $options == null ) {
                $options = WPSEO_Options::get_all();
            }

            if($values == null) {
                $values = array(
                    '0' => __( 'Default for post type, currently: %s', 'wordpress-seo' ),
                    '1' => __( 'index', 'wordpress-seo' ),
                    '2' => __( 'noindex', 'wordpress-seo' ),
                );
            }

            $return = $values;

            $return['0'] = sprintf( $return['0'], ( ( isset( $options[ 'noindex-' . $post_type ] ) && $options[ 'noindex-' . $post_type ] === true ) ? 'noindex' : 'index' ) );


            return $return;
        }


	} /* End of class */
} /* End of class-exists wrapper */
