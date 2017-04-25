<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 *
 * This is the view for the modal box that appears when premium isn't loaded.
 */

/* Translators: %s: expands to Yoast SEO Premium */
echo '<h1 class="wpseo-redirect-url-title">', sprintf( __( 'Creating redirects is a %s feature', 'wordpress-seo' ), 'Yoast SEO Premium' ), '</h1>';
echo '<p>';
echo sprintf(
	/* Translators: %1$s: expands to 'Yoast SEO Premium', %2$s: links to Yoast SEO Premium plugin page. */
	__( 'To be able to create a redirect and fix this issue, you need %1$s. You can buy the plugin, including one year of support and updates, on %2$s.', 'wordpress-seo' ),
	'Yoast SEO Premium',
	'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/redirects' ) . '" target="_blank">yoast.com</a>'
);
echo '</p>';
echo '<button type="button" class="button wpseo-redirect-close">' . __( 'Close', 'wordpress-seo' ) . '</button>';
