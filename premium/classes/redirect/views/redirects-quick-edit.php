<?php
/**
 * @package WPSEO\Premium\Views
 */

?>
<form method="get">
	<table style="display: none">
		<tbody id="inlineedit">
			<tr id="inline-edit" class="inline-edit-row" style="display: none">
				<td colspan="<?php echo $total_columns; ?>" class="colspanchange">

					<fieldset>
						<legend class="inline-edit-legend"><?php _e( 'Edit redirect', 'wordpress-seo-premium' ); ?></legend>
						<div class="inline-edit-col">
							<div class='wpseo_redirects_update'>

								<br class='clear'/>
								<label class='textinput' for='wpseo_redirects_update_type'><?php _ex( 'Type', 'noun', 'wordpress-seo-premium' ); ?></label>
								<select name='wpseo_redirects_update_type' id='wpseo_redirects_update_type' class='select'>
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

								<label class='textinput' for='wpseo_redirects_update_origin'><?php echo $origin_value; ?></label>
								<input type='text' class='textinput' name='wpseo_redirects_update_origin' id='wpseo_redirects_update_origin' value='' />
								<br class='clear'/>

								<div class="wpseo_redirect_update_url" id="wpseo_redirect_update_url">
									<label class='textinput' for='wpseo_redirects_update_new'><?php _e( 'New URL', 'wordpress-seo-premium' ); ?></label>
									<input type='text' class='textinput' name='wpseo_redirects_update_new' id='wpseo_redirects_update_new' value='' />
								</div>
							</div>
						</div>
					</fieldset>

					<p class="inline-edit-save submit">
						<button type="button" class="cancel button-secondary alignleft">Cancel</button>
						<button type="button" class="save button-primary alignright"><?php _e( 'Update Redirect', 'wordpress-seo-premium' ); ?></button>
						<span class="spinner"></span>
						<span class="error" style="display:none;"></span>
						<input type="hidden" id="_inline_edit" name="_inline_edit" value="43f569d2d8" />
						<input type="hidden" name="taxonomy" value="category" />
						<input type="hidden" name="post_type" value="post" />
						<br class="clear" />
					</p>
				</td>
			</tr>
		</tbody>
	</table>
</form>