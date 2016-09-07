<?php
/**
 * @package WPSEO\Admin\Configurator
 */

/**
 * Class WPSEO_Config_Factory_Post_Type
 */
class WPSEO_Config_Factory_Post_Type {

	/** @var WPSEO_Config_Field_Choice_Post_Type[] List of fields */
	protected static $fields = array();

	/**
	 * @return WPSEO_Config_Field_Choice_Post_Type[] List of fields.
	 */
	public function get_fields() {

		if ( empty( self::$fields ) ) {

			$fields = array();

			$post_types = get_post_types( array( 'public' => true ), 'objects' );
			if ( ! empty( $post_types ) ) {
				foreach ( $post_types as $post_type => $post_type_object ) {
					$fields[] = new WPSEO_Config_Field_Choice_Post_Type( $post_type, $post_type_object->label );
				}
			}

			self::$fields = $fields;

		}

		return self::$fields;
	}
}
