<?php
/**
 * @package WPSEO\Premium\Views
 */

?>
<div id="export-redirects" class="wpseotab">
	<h2><?php _e( 'Export redirects to a CSV file', 'wordpress-seo-premium' ); ?></h2>
	<p><?php _e( 'If you need to have a list of all redirects, you can generate a CSV file using the button below.', 'wordpress-seo-premium' ) ?></p>
	<p><?php _e( 'Please note that the first row in this file is a header. This row should be ignored when parsing or importing the data from the export.', 'wordpress-seo-premium' ) ?></p>
	<form action="" method="post" accept-charset="<?php esc_attr_e( get_bloginfo( 'charset' ), 'wordpress-seo-premium' ); ?>">
		<?php wp_nonce_field( 'wpseo-export', '_wpnonce', true ); ?>
		<input type="submit" class="button button-primary" name="export" value="<?php _e( 'Export redirects', 'wordpress-seo-premium' ); ?>"/>
	</form>
</div>
