<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

/**
 * WPSEO_Custom_Fields
 */
class WPSEO_Custom_Fields {
	/**
	 * @var array Cache the custom fields.
	 */
	protected static $custom_fields = null;

	/**
	 * Retrieves the custom field names as an array.
	 *
	 * @see WordPress core: wp-admin/includes/template.php. Reused query from it.
	 *
	 * @return array The custom fields.
	 */
	public static function get_custom_fields() {
		global $wpdb;

		// Use cached value if available.
		if ( ! is_null( self::$custom_fields ) ) {
			return self::$custom_fields;
		}

		self::$custom_fields = array();

		/**
		 * Filters the number of custom fields to retrieve for the drop-down
		 * in the Custom Fields meta box.
		 *
		 * @param int $limit Number of custom fields to retrieve. Default 30.
		 */
		$limit  = apply_filters( 'postmeta_form_limit', 30 );
		$sql    = "SELECT DISTINCT meta_key
			FROM $wpdb->postmeta
			WHERE meta_key NOT BETWEEN '_' AND '_z'
			HAVING meta_key NOT LIKE %s
			ORDER BY meta_key
			LIMIT %d";
		$fields = $wpdb->get_col( $wpdb->prepare( $sql, $wpdb->esc_like( '_' ) . '%', $limit ) );

		if ( is_array( $fields ) ) {
			self::$custom_fields = array_map( array( 'WPSEO_Custom_Fields', 'add_custom_field_prefix' ), $fields );
		}

		return self::$custom_fields;
	}

	/**
	 * Adds the cf_ prefix to a field.
	 *
	 * @param string $field The field to prefix.
	 *
	 * @return string The prefixed field.
	 */
	private static function add_custom_field_prefix( $field ) {
		return 'cf_' . $field;
	}
}
