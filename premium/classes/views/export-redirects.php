<?php
/**
 * @package WPSEO\Premium\Views
 */

?>
<div id="export-redirects" class="wpseotab">
	<h2><?php _e( 'Export redirects to a CSV file', 'wordpress-seo-premium' ); ?></h2>
	<form action="" method="post" accept-charset="<?php esc_attr_e( get_bloginfo( 'charset' ), 'wordpress-seo-premium' ); ?>">
		<?php wp_nonce_field( 'wpseo-export', '_wpnonce', true ); ?>
        <input type="submit" class="button button-primary" name="export" value="<?php _e( 'Export redirects', 'wordpress-seo-premium' ); ?>"/>
    </form>
</div>
