<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * @var string $select_class    The class name for the select.
 * @var string $select_name     Value for the select name attribute.
 * @var string $select_id       ID attribute for the select.
 * @var array  $select_options  Array with the options to show.
 * @var string $selected_option The current set options.
 */
?>
<select class="<?php esc_attr_e( $select_class ); ?>" name="<?php esc_attr_e( $select_name ); ?>" id="<?php esc_attr_e( $select_id ); ?>">
	<?php foreach ( $select_options as $option_attribute_value => $option_html_value ) : ?>
	<option value="<?php esc_attr_e( $option_attribute_value ); ?>"<?php echo selected( $selected_option, $option_attribute_value, false ); ?>><?php esc_html_e( $option_html_value ); ?></option>
	<?php endforeach; ?>
</select>
