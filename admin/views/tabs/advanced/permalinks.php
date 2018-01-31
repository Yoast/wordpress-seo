<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform                = Yoast_Form::get_instance();
$yform->currentoption = 'wpseo_permalinks';

echo '<h2>', esc_html__( 'Change URLs', 'wordpress-seo' ), '</h2>';

$remove_buttons = array( __( 'Keep', 'wordpress-seo' ), __( 'Remove', 'wordpress-seo' ) );
$yform->light_switch(
	'stripcategorybase',
	/* translators: %s expands to <code>/category/</code> */
	sprintf( __( 'Strip the category base (usually %s) from the category URL.', 'wordpress-seo' ), '<code>/category/</code>' ),
	$remove_buttons,
	false
);

$redirect_buttons = array( __( 'No redirect', 'wordpress-seo' ), __( 'Redirect', 'wordpress-seo' ) );
$yform->light_switch( 'redirectattachment', __( 'Redirect attachment URLs to parent post URL.', 'wordpress-seo' ), $redirect_buttons );
echo '<p>' . esc_html__( 'Attachments to posts are stored in the database as posts, this means they\'re accessible under their own URLs if you do not redirect them, enabling this will redirect them to the post they were attached to.', 'wordpress-seo' ) . '</p>';

echo '<h2>', esc_html__( 'Clean up permalinks', 'wordpress-seo' ), '</h2>';
$yform->light_switch( 'cleanslugs', __( 'Stop words in slugs.', 'wordpress-seo' ), $remove_buttons, false );
echo '<p>' . esc_html__( 'This helps you to create cleaner URLs by automatically removing the stopwords from them.', 'wordpress-seo' ) . '</p>';

/* translators: %s expands to <code>?replytocom</code> */
$yform->light_switch( 'cleanreplytocom', sprintf( __( 'Remove the %s variables.', 'wordpress-seo' ), '<code>?replytocom</code>' ), $remove_buttons, false );
echo '<p>';
printf(
	/* translators: 1: emphasis open tag; 2: emphasis close tag. */
	esc_html__( 'This prevents threaded replies from working when the user has JavaScript disabled, but on a large site can mean a %1$shuge%2$s improvement in crawl efficiency for search engines when you have a lot of comments.', 'wordpress-seo' ),
	'<em>',
	'</em>'
);
echo '</p>';

$options = WPSEO_Options::get_all();
if ( substr( get_option( 'permalink_structure' ), -1 ) !== '/' && $options['trailingslash'] ) {
	$yform->light_switch( 'trailingslash', __( 'Enforce a trailing slash on all category and tag URLs', 'wordpress-seo' ) );
	echo '<p><strong>' . esc_html__( 'Note: this feature has been deprecated, as the SEO value is close to 0 these days. If you disable it you will not be able to put it back on.', 'wordpress-seo' ) . '</strong></p>';
	echo '<p>';
	printf(
		/* translators: %1$s expands to <code>.html</code>, %2$s expands to <code>/</code> */
		esc_html__( 'If you choose a permalink for your posts with %1$s, or anything else but a %2$s at the end, this will force WordPress to add a trailing slash to non-post pages nonetheless.', 'wordpress-seo' ),
		'<code>.html</code>',
		'<code>/</code>'
	);
	echo '</p>';
}
