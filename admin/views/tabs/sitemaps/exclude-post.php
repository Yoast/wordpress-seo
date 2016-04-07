<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/* Translators: %1$s: expands to '<code>1,2,99,100</code>' */
echo '<p>' , sprintf( __( 'You can exclude posts from the sitemap by entering a comma separated string with the Post ID\'s. The format will become something like: %1$s.', 'wordpress-seo' ), '<code>1,2,99,100</code>' ) , '</p>';
$yform->textinput( 'excluded-posts', __( 'Posts to exclude', 'wordpress-seo' ) );
