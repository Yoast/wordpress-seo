<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'Excluded posts settings', 'wordpress-seo' ) . '</h2>';

echo '<p>';
printf(
	/* Translators: %1$s: expands to '<code>1,2,99,100</code>' */
	esc_html__( 'You can exclude posts from the sitemap by entering a comma separated string with the Post ID\'s. The format will become something like: %1$s.', 'wordpress-seo' ),
	'<code>1,2,99,100</code>'
);
echo '</p>';

$yform->textinput( 'excluded-posts', __( 'Posts to exclude', 'wordpress-seo' ) );
