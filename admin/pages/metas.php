<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

global $wpseo_admin_pages;

$options = WPSEO_Options::get_all();

$wpseo_admin_pages->admin_header( true, WPSEO_Options::get_group_name( 'wpseo_titles' ), 'wpseo_titles' );
?>

<h2 class="nav-tab-wrapper" id="wpseo-tabs">
	<a class="nav-tab" id="general-tab" href="#top#general"><?php _e( 'General', 'wordpress-seo' );?></a>
	<a class="nav-tab" id="home-tab" href="#top#home"><?php _e( 'Home', 'wordpress-seo' );?></a>
	<a class="nav-tab" id="post_types-tab" href="#top#post_types"><?php _e( 'Post Types', 'wordpress-seo' );?></a>
	<a class="nav-tab" id="taxonomies-tab" href="#top#taxonomies"><?php _e( 'Taxonomies', 'wordpress-seo' );?></a>
	<a class="nav-tab" id="archives-tab" href="#top#archives"><?php _e( 'Other', 'wordpress-seo' );?></a>
</h2>

<div class="tabwrapper">
<div id="general" class="wpseotab">
	<?php
	echo '<h2>' . __( 'Title settings', 'wordpress-seo' ) . '</h2>';
	echo $wpseo_admin_pages->checkbox( 'forcerewritetitle', __( 'Force rewrite titles', 'wordpress-seo' ) );
	echo '<p class="desc">' . __( 'WordPress SEO has auto-detected whether it needs to force rewrite the titles for your pages, if you think it\'s wrong and you know what you\'re doing, you can change the setting here.', 'wordpress-seo' ) . '</p>';

	echo $wpseo_admin_pages->radio( 'separator', array( 'sc-ndash' => '&ndash;', 'sc-mdash' => '&mdash;', 'sc-laquo' => '&laquo;', 'sc-raquo' => '&raquo;', 'sc-middot' => '&middot;', 'sc-loz' => '&loz;', 'sc-hearts' => '&hearts;', 'sc-bull' => '&bull;', '|' => '|' ), __( 'Title Separator', 'wordpress-seo' ) );
	echo '<p class="desc">' . __( 'Choose the symbol to use as your title separator.', 'wordpress-seo' ) . '</p>';

	echo '<h2>' . __( 'Sitewide <code>meta</code> settings', 'wordpress-seo' ) . '</h2>';
	echo $wpseo_admin_pages->checkbox( 'noindex-subpages-wpseo', __( 'Noindex subpages of archives', 'wordpress-seo' ) );
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
		echo $wpseo_admin_pages->textinput( 'title-home-wpseo', __( 'Title template', 'wordpress-seo' ) );
		echo $wpseo_admin_pages->textarea( 'metadesc-home-wpseo', __( 'Meta description template', 'wordpress-seo' ), '', 'metadesc' );
		if ( $options[ 'usemetakeywords' ] === true ) {
			echo $wpseo_admin_pages->textinput( 'metakey-home-wpseo', __( 'Meta keywords template', 'wordpress-seo' ) );
		}
	}
	else {
		echo '<h2>' . __( 'Homepage &amp; Front page', 'wordpress-seo' ) . '</h2>';
		echo '<p>' . sprintf( __( 'You can determine the title and description for the front page by %sediting the front page itself &raquo;%s', 'wordpress-seo' ), '<a href="' . esc_url( get_edit_post_link( get_option( 'page_on_front' ) ) ) . '">', '</a>' ) . '</p>';
		if ( is_numeric( get_option( 'page_for_posts' ) ) ) {
			echo '<p>' . sprintf( __( 'You can determine the title and description for the blog page by %sediting the blog page itself &raquo;%s', 'wordpress-seo' ), '<a href="' . esc_url( get_edit_post_link( get_option( 'page_for_posts' ) ) ) . '">', '</a>' ) . '</p>';
		}
	}
	?>
</div>
<div id="post_types" class="wpseotab">
	<?php
	$post_types = get_post_types( array( 'public' => true ), 'objects' );
	if ( is_array( $post_types ) && $post_types !== array() ) {
		foreach ( $post_types as $pt ) {
			$warn = false;
			if ( $options[ 'redirectattachment' ] === true && $pt->name == 'attachment' ) {
				echo '<div class="wpseo-warning">';
				$warn = true;
			}

			$name = $pt->name;
			echo '<h4 id="' . esc_attr( $name ) . '">' . esc_html( ucfirst( $pt->labels->name ) ) . '</h4>';
			if ( $warn === true ) {
				echo '<h4 class="error-message">' . __( 'Take note:', 'wordpress-seo' ) . '</h4>';

				echo '<p class="error-message">' . __( 'As you are redirecting attachment URLs to parent post URLs, these settings will currently only have an effect on <strong>unattached</strong> media items!', 'wordpress-seo' ) . '</p>';
				echo '<p class="error-message">' . sprintf( __( 'So remember: If you change the %sattachment redirection setting%s in the future, the below settings will take effect for *all* media items.', 'wordpress-seo' ), '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_permalinks' ) ) . '">', '</a>' ) . '</p>';
			}

			echo $wpseo_admin_pages->textinput( 'title-' . $name, __( 'Title template', 'wordpress-seo' ) );
			echo $wpseo_admin_pages->textarea( 'metadesc-' . $name, __( 'Meta description template', 'wordpress-seo' ), '', 'metadesc' );
			if ( $options[ 'usemetakeywords' ] === true ) {
				echo $wpseo_admin_pages->textinput( 'metakey-' . $name, __( 'Meta keywords template', 'wordpress-seo' ) );
			}
			echo $wpseo_admin_pages->checkbox( 'noindex-' . $name, '<code>noindex, follow</code>', __( 'Meta Robots', 'wordpress-seo' ) );
			echo $wpseo_admin_pages->checkbox( 'noauthorship-' . $name, __( 'Don\'t show <code>rel="author"</code>', 'wordpress-seo' ), __( 'Authorship', 'wordpress-seo' ) );
			echo $wpseo_admin_pages->checkbox( 'showdate-' . $name, __( 'Show date in snippet preview?', 'wordpress-seo' ), __( 'Date in Snippet Preview', 'wordpress-seo' ) );
			echo $wpseo_admin_pages->checkbox( 'hideeditbox-' . $name, __( 'Hide', 'wordpress-seo' ), __( 'WordPress SEO Meta Box', 'wordpress-seo' ) );

			/**
			 * Allow adding a custom checkboxes to the admin meta page - Post Types tab
			 * @api  WPSEO_Admin_Pages  $wpseo_admin_pages  The WPSEO_Admin_Pages object
			 * @api  String  $name  The post type name
			 */
			do_action( 'wpseo_admin_page_meta_post_types', $wpseo_admin_pages, $name );

			echo '<br/>';
			if ( $warn === true ) {
				echo '</div>';
			}
			unset( $warn );
		}
		unset( $pt );
	}
	unset( $post_types );


	$post_types = get_post_types( array( 'public' => true, '_builtin' => false ), 'objects' );
	if ( is_array( $post_types ) && $post_types !== array() ) {
		echo '<h2>' . __( 'Custom Post Type Archives', 'wordpress-seo' ) . '</h2>';
		echo '<p>' . __( 'Note: instead of templates these are the actual titles and meta descriptions for these custom post type archive pages.', 'wordpress-seo' ) . '</p>';

		foreach ( $post_types as $pt ) {
			if ( ! $pt->has_archive ) {
				continue;
			}

			$name = $pt->name;

			echo '<h4>' . esc_html( ucfirst( $pt->labels->name ) ) . '</h4>';
			echo $wpseo_admin_pages->textinput( 'title-ptarchive-' . $name, __( 'Title', 'wordpress-seo' ) );
			echo $wpseo_admin_pages->textarea( 'metadesc-ptarchive-' . $name, __( 'Meta description', 'wordpress-seo' ), '', 'metadesc' );
			if ( $options[ 'usemetakeywords' ] === true ) {
				echo $wpseo_admin_pages->textinput( 'metakey-ptarchive-' . $name, __( 'Meta keywords', 'wordpress-seo' ) );
			}
			if ( $options['breadcrumbs-enable'] === true ) {
				echo $wpseo_admin_pages->textinput( 'bctitle-ptarchive-' . $name, __( 'Breadcrumbs Title', 'wordpress-seo' ) );
			}
			echo $wpseo_admin_pages->checkbox( 'noindex-ptarchive-' . $name, '<code>noindex, follow</code>', __( 'Meta Robots', 'wordpress-seo' ) );
		}
		unset( $pt );
	}
	unset( $post_types );

	?>
</div>
<div id="taxonomies" class="wpseotab">
	<?php
	$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );
	if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
		foreach ( $taxonomies as $tax ) {
			echo '<h4>' . esc_html( ucfirst( $tax->labels->name ) ). '</h4>';
			echo $wpseo_admin_pages->textinput( 'title-tax-' . $tax->name, __( 'Title template', 'wordpress-seo' ) );
			echo $wpseo_admin_pages->textarea( 'metadesc-tax-' . $tax->name, __( 'Meta description template', 'wordpress-seo' ), '', 'metadesc' );
			if ( $options[ 'usemetakeywords' ] === true ) {
				echo $wpseo_admin_pages->textinput( 'metakey-tax-' . $tax->name, __( 'Meta keywords template', 'wordpress-seo' ) );
			}
			echo $wpseo_admin_pages->checkbox( 'noindex-tax-' . $tax->name, '<code>noindex, follow</code>', __( 'Meta Robots', 'wordpress-seo' ) );
			echo $wpseo_admin_pages->checkbox( 'hideeditbox-tax-' . $tax->name, __( 'Hide', 'wordpress-seo' ), __( 'WordPress SEO Meta Box', 'wordpress-seo' ) );
			echo '<br/>';
		}
		unset( $tax );
	}
	unset( $taxonomies );

	?>
</div>
<div id="archives" class="wpseotab">
	<?php
	echo '<h4>' . __( 'Author Archives', 'wordpress-seo' ) . '</h4>';
	echo $wpseo_admin_pages->textinput( 'title-author-wpseo', __( 'Title template', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->textarea( 'metadesc-author-wpseo', __( 'Meta description template', 'wordpress-seo' ), '', 'metadesc' );
	if ( $options[ 'usemetakeywords' ] === true ) {
		echo $wpseo_admin_pages->textinput( 'metakey-author-wpseo', __( 'Meta keywords template', 'wordpress-seo' ) );
	}
	echo $wpseo_admin_pages->checkbox( 'noindex-author-wpseo', '<code>noindex, follow</code>', __( 'Meta Robots', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->checkbox( 'disable-author', __( 'Disable the author archives', 'wordpress-seo' ), '' );
	echo '<p class="desc label">' . __( 'If you\'re running a one author blog, the author archive will always look exactly the same as your homepage. And even though you may not link to it, others might, to do you harm. Disabling them here will make sure any link to those archives will be 301 redirected to the homepage.', 'wordpress-seo' ) . '</p>';
	echo '<br/>';
	echo '<h4>' . __( 'Date Archives', 'wordpress-seo' ) . '</h4>';
	echo $wpseo_admin_pages->textinput( 'title-archive-wpseo', __( 'Title template', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->textarea( 'metadesc-archive-wpseo', __( 'Meta description template', 'wordpress-seo' ), '', 'metadesc' );
	echo '<br/>';
	echo $wpseo_admin_pages->checkbox( 'noindex-archive-wpseo', '<code>noindex, follow</code>', __( 'Meta Robots', 'wordpress-seo' ) );
	echo $wpseo_admin_pages->checkbox( 'disable-date', __( 'Disable the date-based archives', 'wordpress-seo' ), '' );
	echo '<p class="desc label">' . __( 'For the date based archives, the same applies: they probably look a lot like your homepage, and could thus be seen as duplicate content.', 'wordpress-seo' ) . '</p>';

	echo '<h2>' . __( 'Special Pages', 'wordpress-seo' ) . '</h2>';
	echo '<p>' . __( 'These pages will be noindex, followed by default, so they will never show up in search results.', 'wordpress-seo' ) . '</p>';
	echo '<h4>' . __( 'Search pages', 'wordpress-seo' ) . '</h4>';
	echo $wpseo_admin_pages->textinput( 'title-search-wpseo', __( 'Title template', 'wordpress-seo' ) );
	echo '<h4>' . __( '404 pages', 'wordpress-seo' ) . '</h4>';
	echo $wpseo_admin_pages->textinput( 'title-404-wpseo', __( 'Title template', 'wordpress-seo' ) );
	echo '<br class="clear"/>';
	?>
</div>
<div id="template_help" class="wpseotab">
	<?php

	echo '<h2>' . __( 'Variables', 'wordpress-seo' ) . '</h2>';
	echo '</div>';
	echo '</div>';
	$wpseo_admin_pages->admin_footer();