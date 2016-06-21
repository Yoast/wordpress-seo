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
	printf( esc_html__( 'You can find your XML Sitemap here: %sXML Sitemap%s', 'wordpress-seo' ), '<a target="_blank" class="button-secondary" href="' . esc_url( WPSEO_Sitemaps_Router::get_base_url( 'sitemap_index.xml' ) ) . '">', '</a>' );
	echo '<br/>';
	echo '<br/>';
	_e( 'You do <strong>not</strong> need to generate the XML sitemap, nor will it take up time to generate after publishing a post.', 'wordpress-seo' );
	echo '</p>';
}
else {
	echo '<p>', __( 'Save your settings to activate your XML Sitemap.', 'wordpress-seo' ), '</p>';
}

echo '<h2>' . esc_html__( 'Entries per sitemap page', 'wordpress-seo' ) . '</h2>';
?>
	<p>
		<?php printf( __( 'Please enter the maximum number of entries per sitemap page (defaults to %s, you might want to lower this to prevent memory issues on some installs):', 'wordpress-seo' ), WPSEO_Options::get_default( 'wpseo_xml', 'entries-per-page' ) ); ?>
	</p>

<?php
$yform->textinput( 'entries-per-page', __( 'Max entries per sitemap', 'wordpress-seo' ) );
