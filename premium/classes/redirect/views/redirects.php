<?php
/**
 * @package WPSEO\Premium\Views
 */

	// Admin header.
	Yoast_Form::get_instance()->admin_header( false, 'wpseo_redirects', false, 'yoast_wpseo_redirects_options' );
?>
<h2 class="nav-tab-wrapper" id="wpseo-tabs">
	<?php echo $redirect_tabs; ?>
</h2>

	<?php
	if ( ! empty( $tab_presenter ) ) :
		$tab_presenter->display();
	endif;
	?>

<br class="clear">
<?php
	// Admin footer.
	Yoast_Form::get_instance()->admin_footer( false );
