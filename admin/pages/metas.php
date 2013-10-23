<?php
/**
 * @package Admin
 */

if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
	die;
}

global $wpseo_admin_pages;

$options = get_wpseo_options();

?>
<div class="wrap">
<?php
/**
 * Display the updated/error messages
 */
include_once( 'options-head.php' );
?>
<a href="http://yoast.com/">
<?php screen_icon(); ?>
</a>

<h2 id="wpseo-title"><?php echo get_admin_page_title(); ?></h2>

<div id="wpseo_content_top" class="postbox-container">
<div class="metabox-holder" style="max-width: 650px; float: left;">
<div class="meta-box-sortables">

<h2 class="nav-tab-wrapper" id="wpseo-tabs">
	<a class="nav-tab" id="general-tab" href="#top#general"><?php _e( 'General', 'wordpress-seo' );?></a>
	<a class="nav-tab" id="home-tab" href="#top#home"><?php _e( 'Home', 'wordpress-seo' );?></a>
	<a class="nav-tab" id="post_types-tab" href="#top#post_types"><?php _e( 'Post Types', 'wordpress-seo' );?></a>
	<a class="nav-tab" id="taxonomies-tab" href="#top#taxonomies"><?php _e( 'Taxonomies', 'wordpress-seo' );?></a>
	<a class="nav-tab" id="archives-tab" href="#top#archives"><?php _e( 'Other', 'wordpress-seo' );?></a>
</h2>

<div class="tabwrapper>">
<div id="general" class="wpseotab">
	<?php
	echo '<form action="' . admin_url( 'options.php' ) . '" method="post" id="wpseo-conf" accept-charset="' . get_bloginfo( 'charset' ) . '">';
	settings_fields( 'yoast_wpseo_titles_options' );
	$wpseo_admin_pages->currentoption = 'wpseo_titles';

	echo '<h2>' . __( 'Title settings', 'wordpress-seo' ) . '</h2>';
	echo $wpseo_admin_pages->checkbox( 'forcerewritetitle', __( 'Force rewrite titles', 'wordpress-seo' ) );
	echo '<p class="desc">' . __( 'WordPress SEO has auto-detected whether it needs to force rewrite the titles for your pages, if you think it\'s wrong and you know what you\'re doing, you can change the setting here.', 'wordpress-seo' ) . '</p>';

	echo '<h2>' . __( 'Sitewide <code>meta</code> settings', 'wordpress-seo' ) . '</h2>';
	echo $wpseo_admin_pages->checkbox( 'noindex-subpages', __( 'Noindex subpages of archives', 'wordpress-seo' ) );
	echo '<p class="desc">' . __( 'If you want to prevent /page/2/ and further of any archive to show up in the search results, enable this.', 'wordpress-seo' ) . '</p>';

	echo $wpseo_admin_pages->checkbox( 'usemetakeywords', __( 'Use <code>meta</code> keywords tag?', 'wordpress-seo' ) );
	echo '<p class="desc">' . __( 'I don\'t know why you\'d want to use meta keywords, but if you want to, check this box.', 'wordpress-seo' ) . '</p>';

	echo $wpseo_admin_pages->checkbox( 'noodp', __( 'Add <code>noodp</code> meta robots tag sitewide', 'wordpress-seo' ) );
	echo '<p class="desc">' . __( 'Prevents search engines from using the DMOZ description for pages from this site in the search results.', 'wordpress-seo' ) . '</p>';

	echo $wpseo_admin_pages->checkbox( 'noydir', __( 'Add <code>noydir</code> meta robots tag sitewide', 'wordpress-seo' ) );
	echo '<p class="desc">' . __( 'Prevents search engines from using the Yahoo! directory description for pages from this site in the search results.', 'wordpress-seo' ) . '</p>';

	echo '<h2>' . __( 'Clean up the <code>&lt;head&gt;</code>', 'wordpress-seo' ) . '</h2>';
	echo $wpseo_admin_pages->checkbox( 'hide-rsdlink', __( 'Hide RSD Links', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->checkbox( 'hide-wlwmanifest', __( 'Hide WLW Manifest Links', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->checkbox( 'hide-shortlink', __( 'Hide Shortlink for posts', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->checkbox( 'hide-feedlinks', __( 'Hide RSS Links', 'wordpress-seo' ) );
	?>
</div>
<div id="home" class="wpseotab">
	<?php
	if ( 'page' != get_option( 'show_on_front' ) ) {
		echo '<h2>' . __( 'Homepage', 'wordpress-seo' ) . '</h2>';
		echo $wpseo_admin_pages->textinput( 'title-home', __( 'Title template', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->textarea( 'metadesc-home', __( 'Meta description template', 'wordpress-seo' ), '', 'metadesc' );
		if ( isset( $options[ 'usemetakeywords' ] ) && $options[ 'usemetakeywords' ] )
			echo $wpseo_admin_pages->textinput( 'metakey-home', __( 'Meta keywords template', 'wordpress-seo' ) );
	} else {
		echo '<h2>' . __( 'Homepage &amp; Front page', 'wordpress-seo' ) . '</h2>';
		echo '<p>' . sprintf( __( 'You can determine the title and description for the front page by %sediting the front page itself &raquo;%s', 'wordpress-seo' ), '<a href="' . get_edit_post_link( get_option( 'page_on_front' ) ) . '">', '</a>' ) . '</p>';
		if ( is_numeric( get_option( 'page_for_posts' ) ) )
			echo '<p>' . sprintf( __( 'You can determine the title and description for the blog page by %sediting the blog page itself &raquo;%s', 'wordpress-seo' ), '<a href="' . get_edit_post_link( get_option( 'page_for_posts' ) ) . '">', '</a>' ) . '</p>';
	}

	// TODO: Please remove...Depreciated: moved over to the social tab
	// echo '<h2>' . __( 'Author metadata', 'wordpress-seo' ) . '</h2>';
	// echo '<label class="select" for="">' . __( 'Author highlighting', 'wordpress-seo' ) . ':</label>';
	// wp_dropdown_users( array( 'show_option_none' => __( "Don't show", 'wordpress-seo' ), 'name' => 'wpseo_titles[plus-author]', 'class' => 'select', 'selected' => isset( $options[ 'plus-author' ] ) ? $options[ 'plus-author' ] : '' ) );
	// echo '<p class="desc label">' . __( 'Choose the user that should be used for the <code>rel="author"</code> on the blog homepage. Make sure the user has filled out his/her Google+ profile link on their profile page.', 'wordpress-seo' ) . '</p>';
	// echo $wpseo_admin_pages->textinput( 'plus-publisher-old', __( 'Google Publisher Page', 'wordpress-seo' ) );
	// echo '<p class="desc label">' . __( 'If you have a Google+ page for your business, add that URL here and link it on your Google+ page\'s about page.', 'wordpress-seo' ) . '</p>';
	?>
</div>
<div id="post_types" class="wpseotab">
	<?php
	foreach ( get_post_types( array( 'public' => true ), 'objects' ) as $posttype ) {
		if ( isset( $options[ 'redirectattachment' ] ) && $options[ 'redirectattachment' ] && $posttype == 'attachment' )
			continue;
		$name = $posttype->name;
		echo '<h4 id="' . esc_attr( $name ) . '">' . esc_html( ucfirst( $posttype->labels->name ) ) . '</h4>';
		echo $wpseo_admin_pages->textinput( 'title-' . $name, __( 'Title template', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->textarea( 'metadesc-' . $name, __( 'Meta description template', 'wordpress-seo' ), '', 'metadesc' );
		if ( isset( $options[ 'usemetakeywords' ] ) && $options[ 'usemetakeywords' ] )
			echo $wpseo_admin_pages->textinput( 'metakey-' . $name, __( 'Meta keywords template', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->checkbox( 'noindex-' . $name, '<code>noindex, follow</code>', __( 'Meta Robots', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->checkbox( 'noauthorship-' . $name, __( 'Don\'t show <code>rel="author"</code>', 'wordpress-seo' ), __( 'Authorship', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->checkbox( 'showdate-' . $name, __( 'Show date in snippet preview?', 'wordpress-seo' ), __( 'Date in Snippet Preview', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->checkbox( 'hideeditbox-' . $name, __( 'Hide', 'wordpress-seo' ), __( 'WordPress SEO Meta Box', 'wordpress-seo' ) );
		echo '<br/>';
	}

	$post_types = get_post_types( array( 'public' => true, '_builtin' => false ), 'objects' );

	if ( count( $post_types ) > 0 ) {
		echo '<h2>' . __( 'Custom Post Type Archives', 'wordpress-seo' ) . '</h2>';
		echo '<p>' . __( 'Note: instead of templates these are the actual titles and meta descriptions for these custom post type archive pages.', 'wordpress-seo' ) . '</p>';

		foreach ( $post_types as $pt ) {
			if ( !$pt->has_archive )
				continue;

			$name = $pt->name;

			echo '<h4>' . esc_html( ucfirst( $pt->labels->name ) ) . '</h4>';
			echo $wpseo_admin_pages->textinput( 'title-ptarchive-' . $name, __( 'Title', 'wordpress-seo' ) );
			echo $wpseo_admin_pages->textarea( 'metadesc-ptarchive-' . $name, __( 'Meta description', 'wordpress-seo' ), '', 'metadesc' );
			if ( isset( $options[ 'breadcrumbs-enable' ] ) && $options[ 'breadcrumbs-enable' ] )
				echo $wpseo_admin_pages->textinput( 'bctitle-ptarchive-' . $name, __( 'Breadcrumbs Title', 'wordpress-seo' ) );
			echo $wpseo_admin_pages->checkbox( 'noindex-ptarchive-' . $name, '<code>noindex, follow</code>', __( 'Meta Robots', 'wordpress-seo' ) );
		}
		unset( $pt, $post_type );
	}

	?>
</div>
<div id="taxonomies" class="wpseotab">
	<?php
	foreach ( get_taxonomies( array( 'public' => true ), 'objects' ) as $tax ) {
		echo '<h4>' . esc_html( ucfirst( $tax->labels->name ) ). '</h4>';
		echo $wpseo_admin_pages->textinput( 'title-' . $tax->name, __( 'Title template', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->textarea( 'metadesc-' . $tax->name, __( 'Meta description template', 'wordpress-seo' ), '', 'metadesc' );
		if ( isset( $options[ 'usemetakeywords' ] ) && $options[ 'usemetakeywords' ] )
			echo $wpseo_admin_pages->textinput( 'metakey-' . $tax->name, __( 'Meta keywords template', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->checkbox( 'noindex-' . $tax->name, '<code>noindex, follow</code>', __( 'Meta Robots', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->checkbox( 'tax-hideeditbox-' . $tax->name, __( 'Hide', 'wordpress-seo' ), __( 'WordPress SEO Meta Box', 'wordpress-seo' ) );
		echo '<br/>';
	}

	?>
</div>
<div id="archives" class="wpseotab">
	<?php
	echo '<h4>' . __( 'Author Archives', 'wordpress-seo' ) . '</h4>';
	echo $wpseo_admin_pages->textinput( 'title-author', __( 'Title template', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->textarea( 'metadesc-author', __( 'Meta description template', 'wordpress-seo' ), '', 'metadesc' );
	if ( isset( $options[ 'usemetakeywords' ] ) && $options[ 'usemetakeywords' ] )
		echo $wpseo_admin_pages->textinput( 'metakey-author', __( 'Meta keywords template', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->checkbox( 'noindex-author', '<code>noindex, follow</code>', __( 'Meta Robots', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->checkbox( 'disable-author', __( 'Disable the author archives', 'wordpress-seo' ), '' );
	echo '<p class="desc label">' . __( 'If you\'re running a one author blog, the author archive will always look exactly the same as your homepage. And even though you may not link to it, others might, to do you harm. Disabling them here will make sure any link to those archives will be 301 redirected to the homepage.', 'wordpress-seo' ) . '</p>';
	echo '<br/>';
	echo '<h4>' . __( 'Date Archives', 'wordpress-seo' ) . '</h4>';
	echo $wpseo_admin_pages->textinput( 'title-archive', __( 'Title template', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->textarea( 'metadesc-archive', __( 'Meta description template', 'wordpress-seo' ), '', 'metadesc' );
	echo '<br/>';
	echo $wpseo_admin_pages->checkbox( 'noindex-archive', '<code>noindex, follow</code>', __( 'Meta Robots', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->checkbox( 'disable-date', __( 'Disable the date-based archives', 'wordpress-seo' ), '' );
	echo '<p class="desc label">' . __( 'For the date based archives, the same applies: they probably look a lot like your homepage, and could thus be seen as duplicate content.', 'wordpress-seo' ) . '</p>';

	echo '<h2>' . __( 'Special Pages', 'wordpress-seo' ) . '</h2>';
	echo '<p>' . __( 'These pages will be noindex, followed by default, so they will never show up in search results.', 'wordpress-seo' ) . '</p>';
	echo '<h4>' . __( 'Search pages', 'wordpress-seo' ) . '</h4>';
	echo $wpseo_admin_pages->textinput( 'title-search', __( 'Title template', 'wordpress-seo' ) );
	echo '<h4>' . __( '404 pages', 'wordpress-seo' ) . '</h4>';
	echo $wpseo_admin_pages->textinput( 'title-404', __( 'Title template', 'wordpress-seo' ) );
	echo '<br class="clear"/>';
	?>
</div>
<div id="template_help" class="wpseotab">
	<?php

	echo '<h2>' . __( 'Variables', 'wordpress-seo' ) . '</h2>';
	echo '</div>';
	$wpseo_admin_pages->admin_footer();
	echo '</div>';
