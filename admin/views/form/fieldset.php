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
 * @var string $id                  ID attribute for the fieldset.
 * @var string $fieldset_attributes Additional attributes for the fieldset.
 * @var string $legend_attributes   Additional attributes for the legend.
 * @var string $legend_content      The legend text.
 * @var string $content             The fieldset content, i.e. a set of logically grouped form controls.
 */
?>
<fieldset id="<?php esc_attr_e( $id ); ?>" <?php echo $fieldset_attributes; ?>>
	<legend id="<?php esc_attr_e( $id ); ?>-legend" <?php echo $legend_attributes; ?>><?php esc_html_e( $legend_content ); ?></legend>
	<?php echo $content ?>
</fieldset>
