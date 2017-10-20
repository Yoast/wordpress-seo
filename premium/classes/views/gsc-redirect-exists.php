<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 *
 * This is the view for the modal box, when the url is already redirected.
 */

/**
 * @var WPSEO_Redirect $redirect  The existing redirect.
 * @var string         $url       Redirect for URL.
 */
?>
<h1 class="wpseo-redirect-url-title"><?php esc_html_e( 'Error: a redirect for this URL already exists', 'wordpress-seo-premium' ); ?></h1>
<p>
	<?php
	// There is no target.
	if ( in_array( $redirect->get_type(), array( WPSEO_Redirect::DELETED, WPSEO_Redirect::UNAVAILABLE ), true ) ) {
		printf(
			/* Translators: %1$s: expands to the current URL. */
			esc_html__( 'You do not have to create a redirect for URL %1$s because a redirect already exists. If this is fine you can mark this issue as fixed. If not, please go to the redirects page and change the redirect.', 'wordpress-seo-premium' ),
			'<code>' . esc_url( $url ) . '</code>'
		);
	}
	else {
		printf(
			/* Translators: %1$s: expands to the current URL and %2$s expands to URL the redirects points to. */
			esc_html__( 'You do not have to create a redirect for URL %1$s because a redirect already exists. The existing redirect points to %2$s. If this is fine you can mark this issue as fixed. If not, please go to the redirects page and change the target URL.', 'wordpress-seo-premium' ),
			'<code>' . esc_url( $url ) . '</code>',
			'<code>' . esc_url( $redirect->get_target() ) . '</code>'
		);
	}
	?>
</p>
<button type="button" class="button wpseo-redirect-close"><?php esc_html_e( 'Close', 'wordpress-seo-premium' ); ?></button>

