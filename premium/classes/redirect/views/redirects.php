<?php
/**
 * @package WPSEO\Premium\Views
 */

	// Admin header.
	Yoast_Form::get_instance()->admin_header( false, 'wpseo_redirects', false, 'yoast_wpseo_redirects_options' );
?>
<h2 class="nav-tab-wrapper" id="wpseo-tabs">
	<?php
	foreach ( $redirect_tabs['tabs'] as $tab_url => $tab_value ) :
		$active = '';
		if ( $redirect_tabs['current_tab'] === $tab_url ) {
			$active = ' nav-tab-active';
		}
		echo '<a class="nav-tab' . esc_attr( $active ) . '" id="tab-url-tab" href="' . esc_url( $redirect_tabs['page_url'] . $tab_url ) . '">' . esc_html( $tab_value ) . '</a>';
	endforeach;
	?>
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
