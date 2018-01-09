<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'Your XML Sitemap', 'wordpress-seo' ) . '</h2>';

if ( $options['enablexmlsitemap'] === true ) {
	echo '<p>';
	printf(
		/* translators: %1$s opening tag of the link to the Sitemap, %2$s closing tag for the link. */
		esc_html__( 'You can find your XML Sitemap here: %1$sXML Sitemap%2$s', 'wordpress-seo' ),
		'<a target="_blank" href="' . esc_url( WPSEO_Sitemaps_Router::get_base_url( 'sitemap_index.xml' ) ) . '">',
		'</a>'
	);
	echo '<br/>';
	echo '<br/>';
	printf(
		/* translators: 1: <strong> open tag; 2: close tag. */
		esc_html__( 'You do %1$snot%2$s need to generate the XML sitemap, nor will it take up time to generate after publishing a post.', 'wordpress-seo' ),
		'<strong>',
		'</strong>'
	);
	echo '</p>';
}
else {
	echo '<p>', esc_html__( 'Save your settings to activate your XML Sitemap.', 'wordpress-seo' ), '</p>';
}

echo '<h2>' . esc_html__( 'Entries per sitemap page', 'wordpress-seo' ) . '</h2>';
?>
	<p>
		<?php
		printf(
			/* translators: %d expands to default number of entries per sitemap. */
			esc_html__( 'Please enter the maximum number of entries per sitemap page (defaults to %d, you might want to lower this to prevent memory issues on some installs):', 'wordpress-seo' ),
			(int) WPSEO_Options::get_default( 'wpseo_xml', 'entries-per-page' )
		);
		?>
	</p>

<?php
$yform->textinput( 'entries-per-page', __( 'Max entries per sitemap', 'wordpress-seo' ) );
