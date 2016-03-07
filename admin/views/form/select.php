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
 * @var string $class    The class name for the select.
 * @var string $name     Value for the select name attribute.
 * @var string $id       ID attribute for the select.
 * @var array  $options  Array with the options to show.
 * @var string $selected The current set options.
 */
?>
<select class="<?php esc_attr_e( $class ); ?>" name="<?php esc_attr_e( $name ); ?>" id="<?php esc_attr_e( $id ); ?>">
	<?php foreach ( $options as $option_attribute_value => $option_html_value ) : ?>
	<option value="<?php esc_attr_e( $option_attribute_value ); ?>"<?php echo selected( $selected, $option_attribute_value, false ); ?>><?php esc_html_e( $option_html_value ); ?></option>
	<?php endforeach; ?>
</select>
