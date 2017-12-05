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

			// WPSEO_Post_type::get_accessible_post_types() should *not* be used to get a similar experience from the settings.
			$post_types = get_post_types( array( 'public' => true ), 'objects' );
			if ( ! empty( $post_types ) ) {
				foreach ( $post_types as $post_type => $post_type_object ) {
					$label = $this->decode_html_entities( $post_type_object->label );
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

	/**
	 * Replaces the HTML entity with it's actual symbol.
	 *
	 * Because we do not not know what consequences it will have if we convert every HTML entity,
	 * we will only replace the characters that we have known problems with in text's.
	 *
	 * @param string $text The text to decode.
	 *
	 * @return string String with decoded HTML entities.
	 */
	private function decode_html_entities( $text ) {
		return str_replace( '&#39;', '’', $text );
	}
}
