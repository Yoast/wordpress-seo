<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\General
 *
 * @var Yoast_Form $yform
 */

$title_separator_help = new WPSEO_Admin_Help_Panel(
	'search-appearance-title-separator',
	__( 'Learn more about the title separator setting', 'wordpress-seo' ),
	__( 'Choose the symbol to use as your title separator. This will display, for instance, between your post title and site name. Symbols are shown in the size they\'ll appear in the search results.', 'wordpress-seo' ),
	'has-wrapper'
);
?>
<div class="tab-block">
	<h2 class="help-button-inline"><?php echo esc_html__( 'Title Separator', 'wordpress-seo' ) . $title_separator_help->get_button_html(); ?></h2>
	<?php
	echo $title_separator_help->get_panel_html();
	$legend      = __( 'Title separator symbol', 'wordpress-seo' );
	$legend_attr = array( 'class' => 'radiogroup screen-reader-text' );
	$yform->radio( 'separator', WPSEO_Option_Titles::get_instance()->get_separator_options_for_display(), $legend, $legend_attr );
	?>
</div>
