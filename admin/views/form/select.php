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
 * @var string $attributes Additional attributes for the select
 * @var string $name       Value for the select name attribute.
 * @var string $id         ID attribute for the select.
 * @var array  $options    Array with the options to show.
 * @var string $selected   The current set options.
 */
?>
<select <?php echo $attributes; ?>name="<?php echo esc_attr( $name ); ?>" id="<?php echo esc_attr( $id ); ?>">
	<?php foreach ( $options as $option_attribute_value => $option_html_value ) : ?>
	<option value="<?php echo esc_attr( $option_attribute_value ); ?>"<?php echo selected( $selected, $option_attribute_value, false ); ?>><?php echo esc_html( $option_html_value ); ?></option>
	<?php endforeach; ?>
</select>
