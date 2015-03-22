<?php
/**
 * @package    WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

global $wpseo_admin_pages;

$wpseo_admin_pages->admin_header( true, WPSEO_Options::get_group_name( 'wpseo_permalinks' ), 'wpseo_permalinks' );

$options = get_option( 'wpseo_permalinks' );

$content = '';

$content .= $wpseo_admin_pages->checkbox( 'stripcategorybase', __( 'Strip the category base (usually <code>/category/</code>) from the category URL.', 'wordpress-seo' ) );
$content .= '<p class="desc">' . sprintf( __( 'We suggest using %1$sFV Top Level Categories%2$s, if you insist on keeping this but do know that the feature is very error prone and not <em>that</em> important for your SEO.', 'wordpress-seo' ), '<a href="https://wordpress.org/plugins/fv-top-level-cats/">', '</a>' ) . '</p>';

$content .= $wpseo_admin_pages->checkbox( 'trailingslash', __( 'Enforce a trailing slash on all category and tag URL\'s', 'wordpress-seo' ) );
$content .= '<p class="desc">' . __( 'If you choose a permalink for your posts with <code>.html</code>, or anything else but a / on the end, this will force WordPress to add a trailing slash to non-post pages nonetheless.', 'wordpress-seo' ) . '</p>';

$content .= $wpseo_admin_pages->checkbox( 'cleanslugs', __( 'Remove stop words from slugs.', 'wordpress-seo' ) );
$content .= '<p class="desc">' . __( 'This helps you to create cleaner URLs by automatically removing the stopwords from them.', 'wordpress-seo' ) . '</p>';

$content .= $wpseo_admin_pages->checkbox( 'redirectattachment', __( 'Redirect attachment URL\'s to parent post URL.', 'wordpress-seo' ) );
$content .= '<p class="desc">' . __( 'Attachments to posts are stored in the database as posts, this means they\'re accessible under their own URL\'s if you do not redirect them, enabling this will redirect them to the post they were attached to.', 'wordpress-seo' ) . '</p>';

$content .= $wpseo_admin_pages->checkbox( 'cleanreplytocom', __( 'Remove the <code>?replytocom</code> variables.', 'wordpress-seo' ) );
$content .= '<p class="desc">' . __( 'This prevents threaded replies from working when the user has JavaScript disabled, but on a large site can mean a <em>huge</em> improvement in crawl efficiency for search engines when you have a lot of comments.', 'wordpress-seo' ) . '</p>';

$content .= $wpseo_admin_pages->checkbox( 'cleanpermalinks', __( 'Redirect ugly URL\'s to clean permalinks. (Not recommended in many cases!)', 'wordpress-seo' ) );
$content .= '<p class="desc">' . __( 'People make mistakes in their links towards you sometimes, or unwanted parameters are added to the end of your URLs, this allows you to redirect them all away. Please note that while this is a feature that is actively maintained, it is known to break several plugins, and should for that reason be the first feature you disable when you encounter issues after installing this plugin.', 'wordpress-seo' ) . '</p>';

$wpseo_admin_pages->postbox( 'permalinks', __( 'Permalink Settings', 'wordpress-seo' ), $content );

/* @internal Important: Make sure the options added to the array here are in line with the options set in the WPSEO_Option_Permalinks::$force_transport_options property */
$content  = $wpseo_admin_pages->select( 'force_transport', __( 'Force Transport', 'wordpress-seo' ), array( 'default' => __( 'Leave default', 'wordpress-seo' ), 'http' => __( 'Force http', 'wordpress-seo' ), 'https' => __( 'Force https', 'wordpress-seo' ) ) );
$content .= '<p class="desc label">' . __( 'Force the canonical to either http or https, when your blog runs under both.', 'wordpress-seo' ) . '</p>';

$wpseo_admin_pages->postbox( 'canonical', __( 'Canonical Settings', 'wordpress-seo' ), $content );


$content  = $wpseo_admin_pages->checkbox( 'cleanpermalink-googlesitesearch', __( 'Prevent cleaning out Google Site Search URL\'s.', 'wordpress-seo' ) );
$content .= '<p class="desc">' . __( 'Google Site Search URL\'s look weird, and ugly, but if you\'re using Google Site Search, you probably do not want them cleaned out.', 'wordpress-seo' ) . '</p>';

$content .= $wpseo_admin_pages->checkbox( 'cleanpermalink-googlecampaign', __( 'Prevent cleaning out Google Analytics Campaign & Google AdWords Parameters.', 'wordpress-seo' ) );
$content .= '<p class="desc">' . __( 'If you use Google Analytics campaign parameters starting with <code>?utm_</code>, check this box. You shouldn\'t use these btw, you should instead use the hash tagged version instead.', 'wordpress-seo' ) . '</p>';

$content .= $wpseo_admin_pages->textinput( 'cleanpermalink-extravars', __( 'Other variables not to clean', 'wordpress-seo' ) );
$content .= '<p class="desc">' . __( 'You might have extra variables you want to prevent from cleaning out, add them here, comma separated.', 'wordpress-seo' ) . '</p>';

$wpseo_admin_pages->postbox( 'cleanpermalinksdiv', __( 'Clean Permalink Settings', 'wordpress-seo' ), $content );


$wpseo_admin_pages->admin_footer();