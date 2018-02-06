<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}
$yform = Yoast_Form::get_instance();

if ( ! current_theme_supports( 'title-tag' ) ) {
	$yform->light_switch( 'forcerewritetitle', __( 'Force rewrite titles', 'wordpress-seo' ) );
	echo '<p class="description">';
	printf(
		/* translators: %1$s expands to Yoast SEO */
		esc_html__( '%1$s has auto-detected whether it needs to force rewrite the titles for your pages, if you think it\'s wrong and you know what you\'re doing, you can change the setting here.', 'wordpress-seo' ),
		'Yoast SEO'
	);
	echo '</p>';
}

echo '<h2>' . esc_html__( 'Website name', 'wordpress-seo' ) . '</h2>';
?>
	<p>
		<?php
		esc_html_e( 'Google shows your website\'s name in the search results, we will default to your site name but you can adapt it here. You can also provide an alternate website name you want Google to consider.', 'wordpress-seo' );
		?>
	</p>
<?php
$yform->textinput( 'website_name', __( 'Website name', 'wordpress-seo' ), array( 'placeholder' => get_bloginfo( 'name' ) ) );
$yform->textinput( 'alternate_website_name', __( 'Alternate name', 'wordpress-seo' ) );

echo '<h2>' . esc_html__( 'Title Separator', 'wordpress-seo' ) . '</h2>';

$legend      = __( 'Title separator symbol', 'wordpress-seo' );
$legend_attr = array( 'class' => 'radiogroup screen-reader-text' );
$yform->radio( 'separator', WPSEO_Option_Titles::get_instance()->get_separator_options(), $legend, $legend_attr );
echo '<p class="description">', esc_html__( 'Choose the symbol to use as your title separator. This will display, for instance, between your post title and site name.', 'wordpress-seo' ), ' ', esc_html__( 'Symbols are shown in the size they\'ll appear in the search results.', 'wordpress-seo' ), '</p>';
echo '<br>';

if ( 'posts' === get_option( 'show_on_front' ) ) {
	echo '<div id="homepage-titles-metas">';
	echo '<h2>', esc_html__( 'Homepage', 'wordpress-seo' ), '</h2>';
	$yform = Yoast_Form::get_instance();
	$yform->textinput( 'title-home-wpseo', __( 'Title', 'wordpress-seo' ), 'template homepage-template' );
	$yform->textarea( 'metadesc-home-wpseo', __( 'Meta description', 'wordpress-seo' ), array( 'class' => 'template homepage-template' ) );
	echo '</div>';
}
else {
	echo '<h2>', esc_html__( 'Homepage &amp; Front page', 'wordpress-seo' ), '</h2>';
	echo '<p>';
	printf(
		/* translators: 1: link open tag; 2: link close tag. */
		esc_html__( 'You can determine the title and description for the front page by %1$sediting the front page itself &raquo;%2$s', 'wordpress-seo' ),
		'<a href="' . esc_url( get_edit_post_link( get_option( 'page_on_front' ) ) ) . '">',
		'</a>'
	);
	echo '</p>';
	if ( get_option( 'page_for_posts' ) > 0 ) {
		echo '<p>';
		printf(
			/* translators: 1: link open tag; 2: link close tag. */
			esc_html__( 'You can determine the title and description for the blog page by %1$sediting the blog page itself &raquo;%2$s', 'wordpress-seo' ),
			'<a href="' . esc_url( get_edit_post_link( get_option( 'page_for_posts' ) ) ) . '">',
			'</a>'
		);
		echo '</p>';
	}
}
