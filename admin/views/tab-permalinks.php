<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$wpseo_admin_pages->currentoption = 'wpseo_permalinks';

echo $wpseo_admin_pages->checkbox( 'stripcategorybase', __( 'Strip the category base (usually <code>/category/</code>) from the category URL.', 'wordpress-seo' ) );
echo '<p class="desc">' . sprintf( __( 'We suggest using %1$sFV Top Level Categories%2$s, if you insist on keeping this but do know that the feature is very error prone and not <em>that</em> important for your SEO.', 'wordpress-seo' ), '<a href="https://wordpress.org/plugins/fv-top-level-cats/">', '</a>' ) . '</p>';

echo $wpseo_admin_pages->checkbox( 'trailingslash', __( 'Enforce a trailing slash on all category and tag URL\'s', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'If you choose a permalink for your posts with <code>.html</code>, or anything else but a / on the end, this will force WordPress to add a trailing slash to non-post pages nonetheless.', 'wordpress-seo' ) . '</p>';

echo $wpseo_admin_pages->checkbox( 'cleanslugs', __( 'Remove stop words from slugs.', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'This helps you to create cleaner URLs by automatically removing the stopwords from them.', 'wordpress-seo' ) . '</p>';

echo $wpseo_admin_pages->checkbox( 'redirectattachment', __( 'Redirect attachment URL\'s to parent post URL.', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'Attachments to posts are stored in the database as posts, this means they\'re accessible under their own URL\'s if you do not redirect them, enabling this will redirect them to the post they were attached to.', 'wordpress-seo' ) . '</p>';

echo $wpseo_admin_pages->checkbox( 'cleanreplytocom', __( 'Remove the <code>?replytocom</code> variables.', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'This prevents threaded replies from working when the user has JavaScript disabled, but on a large site can mean a <em>huge</em> improvement in crawl efficiency for search engines when you have a lot of comments.', 'wordpress-seo' ) . '</p>';

echo $wpseo_admin_pages->checkbox( 'cleanpermalinks', __( 'Redirect ugly URL\'s to clean permalinks. (Not recommended in many cases!)', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'People make mistakes in their links towards you sometimes, or unwanted parameters are added to the end of your URLs, this allows you to redirect them all away. Please note that while this is a feature that is actively maintained, it is known to break several plugins, and should for that reason be the first feature you disable when you encounter issues after installing this plugin.', 'wordpress-seo' ) . '</p>';

echo '<div id="cleanpermalinksdiv">';
echo $wpseo_admin_pages->checkbox( 'cleanpermalink-googlesitesearch', __( 'Prevent cleaning out Google Site Search URL\'s.', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'Google Site Search URL\'s look weird, and ugly, but if you\'re using Google Site Search, you probably do not want them cleaned out.', 'wordpress-seo' ) . '</p>';

echo $wpseo_admin_pages->checkbox( 'cleanpermalink-googlecampaign', __( 'Prevent cleaning out Google Analytics Campaign & Google AdWords Parameters.', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'If you use Google Analytics campaign parameters starting with <code>?utm_</code>, check this box. You shouldn\'t use these btw, you should instead use the hash tagged version instead.', 'wordpress-seo' ) . '</p>';

echo $wpseo_admin_pages->textinput( 'cleanpermalink-extravars', __( 'Other variables not to clean', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'You might have extra variables you want to prevent from cleaning out, add them here, comma separated.', 'wordpress-seo' ) . '</p>';
echo '</div>';
