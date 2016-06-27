<?php
/**
 * @package WPSEO\Premium\Views
 */

/**
 * @var string 								$origin_from_url
 * @var WPSEO_Redirect_Quick_Edit_Presenter $quick_edit_table
 * @var WPSEO_Redirect_Table 				$redirect_table
 * @var WPSEO_Redirect_Form_Presenter       $form_presenter
 */
?>

<div id="table-plain" class="tab-url redirect-table-tab">
<?php echo '<h2>' . esc_html( 'Plain redirects', 'wordpress-seo' ) . '</h2>'; ?>
	<form class='wpseo-new-redirect-form' method='post'>
		<div class='wpseo_redirect_form'>
<?php
$form_presenter->display(
	array(
		'input_suffix' => '',
		'values'       => array(
			'origin' => $origin_from_url,
			'target' => '',
			'type'   => '',
		),
	)
);
?>

			<a href='javascript:;' class='button button-primary'><?php _e( 'Add Redirect', 'wordpress-seo-premium' ); ?></a>
		</div>
	</form>

	<p class='desc'>&nbsp;</p>

	<?php
		$quick_edit_table->display(
			array(
				'form_presenter' => $form_presenter,
				'total_columns'  => $redirect_table->count_columns(),
			)
		);
	?>

	<form id='plain' class='wpseo-redirects-table-form' method='post' action=''>
		<input type='hidden' class="wpseo_redirects_ajax_nonce" name='wpseo_redirects_ajax_nonce' value='<?php echo $nonce; ?>' />
		<?php
		// The list table.
		$redirect_table->prepare_items();
		$redirect_table->search_box( __( 'Search', 'wordpress-seo-premium' ), 'wpseo-redirect-search' );
		$redirect_table->display();
		?>
	</form>
</div>
