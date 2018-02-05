<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes\Export\Views
 */

$button_label = __( 'Export keywords', 'wordpress-seo-premium' );

$wpseo_csv_export_explain = sprintf(
	/* translators: %s resolves to the button label translation. */
	esc_html__(
		'If you need a list of all public posts, terms and related keywords, you can generate a CSV file using the %s button below.',
		'wordpress-seo-premium'
	),
	sprintf( '<code>%s</code>', esc_html( $button_label ) )
);

?>
<div id="keywords-export" class="wpseotab">
	<h2><?php esc_html_e( 'Export keywords to a CSV file', 'wordpress-seo-premium' ); ?></h2>
	<p><?php echo $wpseo_csv_export_explain; ?></p>
	<p><?php esc_html_e( 'You can add or remove columns to be included in the export using the checkboxes below.', 'wordpress-seo-premium' ); ?></p>

	<form action="" method="post" accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
		<?php
		wp_nonce_field( 'wpseo-export', '_wpnonce', true );
		$yform->set_options_value( 'export-keywords-score', true );
		$yform->checkbox( 'export-keywords-score', __( 'Export keyword scores', 'wordpress-seo-premium' ) );

		$yform->set_options_value( 'export-url', true );
		$yform->checkbox( 'export-url', __( 'Export URL', 'wordpress-seo-premium' ) );

		$yform->set_options_value( 'export-title', true );
		$yform->checkbox( 'export-title', __( 'Export title', 'wordpress-seo-premium' ) );

		$yform->set_options_value( 'export-seo-title', false );
		$yform->checkbox( 'export-seo-title', __( 'Export SEO title', 'wordpress-seo-premium' ) );

		$yform->set_options_value( 'export-meta-description', false );
		$yform->checkbox( 'export-meta-description', __( 'Export meta description', 'wordpress-seo-premium' ) );

		$yform->set_options_value( 'export-readability-score', false );
		$yform->checkbox( 'export-readability-score', __( 'Export readability score', 'wordpress-seo-premium' ) );
		?>
		<br class="clear">
		<input type="submit" class="button button-primary" name="export-posts" value="<?php echo esc_attr( $button_label ); ?>"/>
	</form>

	<p><strong><?php esc_html_e( 'Please note:', 'wordpress-seo-premium' ); ?></strong></p>
	<ul>
		<li><?php esc_html_e( 'The first row in this file is the header row. This row should be ignored when parsing or importing the data from the export.', 'wordpress-seo-premium' ); ?></li>
		<li><?php esc_html_e( 'Exporting data can take a long time when there are many posts, pages, public custom post types or terms.', 'wordpress-seo-premium' ); ?></li>
	</ul>
</div>
