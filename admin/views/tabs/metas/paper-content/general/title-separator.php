<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\General
 *
 * @uses Yoast_Form $yform Form object.
 */

$title_separator_help = new WPSEO_Admin_Help_Button(
	'https://yoa.st/3yd',
	__( 'Learn more about the title separator setting', 'wordpress-seo' )
);
?>
<div class="tab-block yoast-feature">
	<fieldset class="yoast-field-group">
		<h2 class="help-button-inline"><?php echo esc_html__( 'Title Separator', 'wordpress-seo' ) . $title_separator_help; ?></h2>
		<?php
		$legend      = __( 'Title separator symbol', 'wordpress-seo' );
		$legend_attr = [ 'class' => 'radiogroup screen-reader-text' ];
		$yform->title_separator( 'separator', WPSEO_Option_Titles::get_instance()->get_separator_options_for_display(), $legend, $legend_attr );
		?>
	</fieldset>
</div>
