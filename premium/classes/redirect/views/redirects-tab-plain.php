<?php
/**
 * @package WPSEO\Premium\Views
 */

/**
 * @var array 								$redirect_types
 * @var WPSEO_Redirect_Quick_Edit_Presenter $quick_edit_table
 * @var WPSEO_Redirect_Table 				$redirect_table
 */
?>
<div id="table-plain" class="tab-url redirect-table-tab">
	<form class='wpseo-new-redirect-form' method='post'>
		<div class='wpseo_redirects_new'>

			<br class='clear'/>
			<label class='textinput' for='wpseo_redirects_new_type'><?php _ex( 'Type', 'noun', 'wordpress-seo-premium' ); ?></label>
			<select name='wpseo_redirects_new_type' id='wpseo_redirects_new_type' class='select'>
				<?php
				// Loop through the redirect types.
				if ( count( $redirect_types ) > 0 ) {
					foreach ( $redirect_types as $type => $desc ) {
						echo "<option value='" . $type . "'>" . $desc . '</option>' . PHP_EOL;
					}
				}
				?>

			</select><br />
			<br />

			<p class="label desc description">
				<?php
				printf( __( 'The redirect type is the HTTP response code sent to the browser telling the browser what type of redirect is served.<br/><br/>Read <a href=\'%s\' target=\'_blank\'>this page</a> for more info.', 'wordpress-seo-premium' ), 'http://kb.yoast.com/article/121-redirect-types/#utm_source=wordpress-seo-premium-redirects&amp;utm_medium=inline-help&amp;utm_campaign=redirect-types' );
				?>
			</p>

			<label class='textinput' for='wpseo_redirects_new_old'><?php _e( 'Old URL', 'wordpress-seo-premium' ); ?></label>
			<input type='text' class='textinput' name='wpseo_redirects_new_old' id='wpseo_redirects_new_old' value='<?php echo $old_url; ?>' />
			<br class='clear'/>

			<div id="wpseo_redirect_new_url">
				<label class='textinput' for='wpseo_redirects_new_new'><?php _e( 'New URL', 'wordpress-seo-premium' ); ?></label>
				<input type='text' class='textinput' name='wpseo_redirects_new_new' id='wpseo_redirects_new_new' value='' />
			</div>
			<br class='clear'/>

			<a href='javascript:;' class='button-primary'><?php _e( 'Add Redirect', 'wordpress-seo-premium' ); ?></a>
		</div>
	</form>

	<p class='desc'>&nbsp;</p>

	<?php
		$quick_edit_table->display(
			array(
				'redirect_types' => $redirect_types,
				'origin_value' => __( 'Old URL', 'wordpress-seo-premium' ),
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
