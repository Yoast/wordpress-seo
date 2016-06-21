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

<div id="table-regex" class="tab-url redirect-table-tab">
<?php echo '<h2>' . esc_html( 'Regular Expressions redirects', 'wordpress-seo' ) . '</h2>'; ?>
	<p>
		<?php
		/* translators: %1$s contains a line break tag. %2$s links to our knowledge base, %3$s closes the link. */
		printf( __( 'Regex Redirects are extremely powerful redirects. You should only use them if you know what you are doing.%1$sIf you don\'t know what Regular Expressions (regex) are, please refer to %2$sour knowledge base%3$s.', 'wordpress-seo-premium' ), '<br />', '<a href="http://kb.yoast.com/article/142-what-are-regex-redirects" target="_blank">', '</a>' )
		?>
	</p>

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

	<form id='regex' class='wpseo-redirects-table-form' method='post'>
		<input type='hidden' class="wpseo_redirects_ajax_nonce" name='wpseo_redirects_ajax_nonce' value='<?php echo $nonce; ?>' />
		<?php
		// The list table.
		$redirect_table->prepare_items();
		$redirect_table->search_box( __( 'Search', 'wordpress-seo-premium' ), 'wpseo-redirect-search' );
		$redirect_table->display();
		?>
	</form>
</div>
