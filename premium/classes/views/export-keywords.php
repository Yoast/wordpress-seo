<?php
/**
 * @package WPSEO\Premium\Classes\Export\Views
 */

?>
<div id="keywords-export" class="wpseotab">
	<h2><?php _e( 'Export keywords to a CSV file', 'wordpress-seo' ) ?></h2>
	<p><?php _e( 'If you need to have a list of all public posts and related keywords, you can generate a CSV file using the button below.', 'wordpress-seo' ) ?></p>
	<p><?php _e( 'You can add or remove columns to be included in the export using the checkboxes below.', 'wordpress-seo' ) ?></p>
	<p><?php _e( 'Please note that the first row in this file is a header. This row should be ignored when parsing or importing the data from the export.', 'wordpress-seo' ) ?></p>
	<form action="" method="post" accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
		<?php
		wp_nonce_field( 'wpseo-export', '_wpnonce', true );
		$yform->set_options_value( 'export-post-title', true );
		$yform->checkbox( 'export-post-title', __( 'Export post title', 'wordpress-seo' ) );
		$yform->set_options_value( 'export-post-url', true );
		$yform->checkbox( 'export-post-url', __( 'Export post URL', 'wordpress-seo' ) );
		$yform->checkbox( 'export-seo-score', __( 'Export SEO score', 'wordpress-seo' ) );
		$yform->set_options_value( 'export-keywords', true );
		$yform->checkbox( 'export-keywords', __( 'Export keywords', 'wordpress-seo' ) );
		$yform->checkbox( 'export-keywords-score', __( 'Export keyword scores', 'wordpress-seo' ) );
		?>
		<br class="clear">
		<input type="submit" class="button button-primary" name="export-posts" value="<?php echo __( 'Export keywords', 'wordpress-seo' ); ?>"/>
	</form>
</div>
