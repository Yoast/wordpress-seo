<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\PaperContent
 *
 * @uses Yoast_Form                               $yform                        Form object.
 * @uses WP_Taxonomy                              $wpseo_post_type
 * @uses Yoast_View_Utils                         $view_utils
 * @uses WPSEO_Admin_Recommended_Replace_Vars     $recommended_replace_vars
 * @uses WPSEO_Admin_Editor_Specific_Replace_Vars $editor_specific_replace_vars
 */

$show_post_type_help = $view_utils->search_results_setting_help( $wpseo_post_type );
$noindex_option_name = 'noindex-' . $wpseo_post_type->name;


$yform->index_switch(
	$noindex_option_name,
	$wpseo_post_type->labels->name,
	$show_post_type_help->get_button_html() . $show_post_type_help->get_panel_html()
);

$yform->show_hide_switch(
	'showdate-' . $wpseo_post_type->name,
	__( 'Date in Google Preview', 'wordpress-seo' )
);

$yform->show_hide_switch(
	'display-metabox-pt-' . $wpseo_post_type->name,
	/* translators: %s expands to an indexable object's name, like a post type or taxonomy */
	sprintf( esc_html__( 'Show SEO settings for %1$s', 'wordpress-seo' ), '<strong>' . $wpseo_post_type->labels->name . '</strong>' )
);

$editor = new WPSEO_Replacevar_Editor(
	$yform,
	[
		'title'                 => 'title-' . $wpseo_post_type->name,
		'description'           => 'metadesc-' . $wpseo_post_type->name,
		'page_type_recommended' => $recommended_replace_vars->determine_for_post_type( $wpseo_post_type->name ),
		'page_type_specific'    => $editor_specific_replace_vars->determine_for_post_type( $wpseo_post_type->name ),
		'paper_style'           => false,
	]
);
$editor->render();

// Schema settings.
echo '<div class="yoast-schema-settings-container yoast-schema-settings-container__has-help">';
printf(
	'<strong>%1$s</strong><a class="yoast_help yoast-help-button dashicons" target="_blank" href="%2$s"><span class="yoast-help-icon"></span><span class="screen-reader-text">%3$s</span><span class="screen-reader-text">%4$s</span></a><p>%5$s</p>',
	esc_html__( 'Schema settings', 'wordpress-seo' ),
	esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/404' ) ),
	esc_html__( 'Learn more about the schema settings', 'wordpress-seo' ),
	esc_html__( '(Opens in a new browser tab)', 'wordpress-seo' ),
	sprintf(
		/* translators: %1$s expands to an indexable object's name, e.g. Posts or Pages. */
		esc_html__( 'Choose how your %1$s should be described by default in your site\'s schema.org markup. You can change these settings for individual %1$s.', 'wordpress-seo' ),
		$wpseo_post_type->labels->name
	)
);

$yform->select( 'schema-page-type-' . $wpseo_post_type->name, __( 'Default page type', 'wordpress-seo' ), [
	'web-page' => esc_html__( 'Web Page', 'wordpress-seo' ),
	'item-page' => esc_html__( 'Item Page', 'wordpress-seo' ),
	'about-page' => esc_html__( 'About Page', 'wordpress-seo' ),
	'faq-page' => esc_html__( 'FAQ Page', 'wordpress-seo' ),
	'qa-page' => esc_html__( 'QA Page', 'wordpress-seo' ),
	'profile-page' => esc_html__( 'Profile Page', 'wordpress-seo' ),
	'contact-page' => esc_html__( 'Contact Page', 'wordpress-seo' ),
	'medical-web-page' => esc_html__( 'Medical Web Page', 'wordpress-seo' ),
	'collection-page' => esc_html__( 'Collection Page', 'wordpress-seo' ),
	'checkout-page' => esc_html__( 'Checkout Page', 'wordpress-seo' ),
	'real-estate-listing' => esc_html__( 'Real Estate Listing', 'wordpress-seo' ),
	'search-results-page' => esc_html__( 'Search Results Page', 'wordpress-seo' ),
	'none' => '- ' . esc_html__( 'None', 'wordpress-seo' ) . ' -',
] );

if ( $wpseo_post_type->name !== 'page' ) {
	$yform->select( 'schema-article-type-' . $wpseo_post_type->name, esc_html__( 'Default article type', 'wordpress-seo' ), [
		'article'                    => esc_html__( 'Article', 'wordpress-seo' ),
		'social-media-posting'       => esc_html__( 'Social Media Posting', 'wordpress-seo' ),
		'news-article'               => esc_html__( 'News Article', 'wordpress-seo' ),
		'advertiser-content-article' => esc_html__( 'Advertiser Content Article', 'wordpress-seo' ),
		'satirical-article'          => esc_html__( 'Satirical Article', 'wordpress-seo' ),
		'scholarly-article'          => esc_html__( 'Scholarly Article', 'wordpress-seo' ),
		'tech-article'               => esc_html__( 'Tech Article', 'wordpress-seo' ),
		'report'                     => esc_html__( 'Report', 'wordpress-seo' ),
		'none'                       => '- ' . esc_html__( 'None', 'wordpress-seo' ) . ' -',
	] );
}
echo '</div>';
