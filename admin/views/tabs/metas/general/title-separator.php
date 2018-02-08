<?php
/**
 * @package WPSEO\Admin\Views\General
 *
 * @var Yoast_Form $yform
 */
?>
<div class="tab-block">
	<h2><?php esc_html_e( 'Title Separator', 'wordpress-seo' ); ?></h2>
	<p class="description">
		<?php
		esc_html_e( 'Choose the symbol to use as your title separator. This will display, for instance, between your post title and site name.', 'wordpress-seo' );
		esc_html_e( 'Symbols are shown in the size they\'ll appear in the search results.', 'wordpress-seo' );
		?>
	</p>
	<?php
	$legend      = __( 'Title separator symbol', 'wordpress-seo' );
	$legend_attr = array( 'class' => 'radiogroup screen-reader-text' );
	$yform->radio( 'separator', WPSEO_Option_Titles::get_instance()->get_separator_options(), $legend, $legend_attr );
	?>
</div>
