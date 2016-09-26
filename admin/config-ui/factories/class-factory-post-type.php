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
					$label = WPSEO_Utils::decode_html_entities( $post_type_object->label );
					$field = new WPSEO_Config_Field_Choice_Post_Type( $post_type, $label );

					$this->add_custom_properties( $post_type, $field );

					$fields[] = $field;
				}
			}

			self::$fields = $fields;
		}

		return self::$fields;
	}

	/**
	 * Add custom properties for specific post types
	 *
	 * @param string             $post_type Post type of field that is being added.
	 * @param WPSEO_Config_Field $field     Field that corresponds to the post type.
	 */
	private function add_custom_properties( $post_type, $field ) {
		if ( 'attachment' === $post_type ) {
			$field->set_property( 'explanation', __( 'WordPress automatically generates an URL for each media item in the library. Enabling this will allow for google to index the generated URL.', 'wordpress-seo' ) );
		}
	}
}
