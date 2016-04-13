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

echo '<h3>', __( 'Change URLs', 'wordpress-seo' ), '</h3>';

$remove_buttons = array( __( 'Keep', 'wordpress-seo' ), __( 'Remove', 'wordpress-seo' ) );
/* translators: %s expands to <code>/category/</code> */
$yform->light_switch(
	'stripcategorybase',
	sprintf( __( 'Strip the category base (usually %s) from the category URL.', 'wordpress-seo' ), '<code>/category/</code>' ),
	$remove_buttons,
	false
);

$redirect_buttons = array( __( 'No redirect', 'wordpress-seo' ), __( 'Redirect', 'wordpress-seo' ) );
$yform->light_switch( 'redirectattachment', __( 'Redirect attachment URL\'s to parent post URL.', 'wordpress-seo' ), $redirect_buttons );
echo '<p>' . __( 'Attachments to posts are stored in the database as posts, this means they\'re accessible under their own URL\'s if you do not redirect them, enabling this will redirect them to the post they were attached to.', 'wordpress-seo' ) . '</p>';

echo '<h3>', __( 'Clean up permalinks', 'wordpress-seo' ), '</h3>';
$yform->light_switch( 'cleanslugs', __( 'Remove stop words from slugs.', 'wordpress-seo' ), $remove_buttons, false );
echo '<p>' . __( 'This helps you to create cleaner URLs by automatically removing the stopwords from them.', 'wordpress-seo' ) . '</p>';

/* translators: %s expands to <code>?replytocom</code> */
$yform->light_switch( 'cleanreplytocom', sprintf( __( 'Remove the %s variables.', 'wordpress-seo' ), '<code>?replytocom</code>' ), $remove_buttons, false );
echo '<p>' . __( 'This prevents threaded replies from working when the user has JavaScript disabled, but on a large site can mean a <em>huge</em> improvement in crawl efficiency for search engines when you have a lot of comments.', 'wordpress-seo' ) . '</p>';

$options = WPSEO_Options::get_all();
if ( substr( get_option( 'permalink_structure' ), -1 ) !== '/' && $options['trailingslash'] ) {
	$yform->light_switch( 'trailingslash', __( 'Enforce a trailing slash on all category and tag URL\'s', 'wordpress-seo' ) );
	echo '<p><strong>' . __( 'Note: this feature has been deprecated, as the SEO value is close to 0 these days. If you disable it you will not be able to put it back on.', 'wordpress-seo' ) . '</strong></p>';
	/* translators: %1$s expands to <code>.html</code>, %2$s expands to <code>/</code> */
	echo '<p>' . sprintf( __( 'If you choose a permalink for your posts with %1$s, or anything else but a %2$s at the end, this will force WordPress to add a trailing slash to non-post pages nonetheless.', 'wordpress-seo' ), '<code>.html</code>', '<code>/</code>' ) . '</p>';
}

$yform->light_switch( 'cleanpermalinks', __( 'Redirect ugly URL\'s to clean permalinks. (Not recommended in many cases!)', 'wordpress-seo' ), $redirect_buttons );
echo '<p>' . __( 'People make mistakes in their links towards you sometimes, or unwanted parameters are added to the end of your URLs, this allows you to redirect them all away. Please note that while this is a feature that is actively maintained, it is known to break several plugins, and should for that reason be the first feature you disable when you encounter issues after installing this plugin.', 'wordpress-seo' ) . '</p>';

echo '<div id="cleanpermalinksdiv">';
$yform->light_switch( 'cleanpermalink-googlesitesearch', __( 'Prevent cleaning out Google Site Search URL\'s.', 'wordpress-seo' ) );
echo '<p>' . __( 'Google Site Search URL\'s look weird, and ugly, but if you\'re using Google Site Search, you probably do not want them cleaned out.', 'wordpress-seo' ) . '</p>';

$yform->light_switch( 'cleanpermalink-googlecampaign', __( 'Prevent cleaning out Google Analytics Campaign & Google AdWords Parameters.', 'wordpress-seo' ) );
/* translators: %s expands to <code>?utm_</code> */
echo '<p>' . sprintf( __( 'If you use Google Analytics campaign parameters starting with %s, check this box. However, you\'re advised not to use these. Instead, use the version with a hash.', 'wordpress-seo' ), '<code>?utm_</code>' ) . '</p>';

$yform->textinput( 'cleanpermalink-extravars', __( 'Other variables not to clean', 'wordpress-seo' ) );
echo '<p>' . __( 'You might have extra variables you want to prevent from cleaning out, add them here, comma separated.', 'wordpress-seo' ) . '</p>';
echo '</div>';
