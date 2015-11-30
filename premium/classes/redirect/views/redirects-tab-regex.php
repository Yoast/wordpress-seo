<?php
/**
 * @package WPSEO\Premium\Views
 */

?>

<div id="table-regex" class="tab-url redirect-table-tab">
	<p>
		<?php
		/* translators: %1$s contains a line break tag. %2$s links to our knowledge base, %3$s closes the link. */
		printf( __( 'Regex Redirects are extremely powerful redirects. You should only use them if you know what you are doing.%1$sIf you don\'t know what Regular Expressions (regex) are, please refer to %2$sour knowledge base%3$s.', 'wordpress-seo-premium' ), '<br />', '<a href="http://kb.yoast.com/article/142-what-are-regex-redirects" target="_blank">', '</a>' )
		?>
	</p>

	<form class='wpseo-new-redirect-form' method='post'>
		<div class='wpseo_redirects_new'>

			<label class='textinput' for='wpseo_redirects_new_old'><?php _e( 'Regular Expression', 'wordpress-seo-premium' ); ?></label>
			<input type='text' class='textinput' name='wpseo_redirects_new_old' id='wpseo_redirects_new_old' value='<?php echo $old_url; ?>' />
			<br class='clear'/>

			<label class='textinput' for='wpseo_redirects_new_new'><?php _e( 'URL', 'wordpress-seo-premium' ); ?></label>
			<input type='text' class='textinput' name='wpseo_redirects_new_new' id='wpseo_redirects_new_new' value='' />
			<br class='clear'/>

			<label class='textinput' for='wpseo_redirects_new_type'><?php echo _x( 'Type', 'noun', 'wordpress-seo-premium' ); ?></label>
			<select name='wpseo_redirects_new_type' id='wpseo_redirects_new_type' class='select'>
				<?php
				// Loop through the redirect types.
				if ( count( $redirect_types ) > 0 ) {
					foreach ( $redirect_types as $key => $desc ) {
						echo "<option value='" . $key . "'>" . $desc . '</option>' . PHP_EOL;
					}
				}
				?>
			</select>
			<br />
			<br />

			<p class="label desc description">
				<?php
				printf( __( 'The redirect type is the HTTP response code sent to the browser telling the browser what type of redirect is served.<br/><br/>Read <a href=\'%s\' target=\'_blank\'>this page</a> for more info.', 'wordpress-seo-premium' ), 'http://kb.yoast.com/article/121-redirect-types/#utm_source=wordpress-seo-premium-redirects&amp;utm_medium=inline-help&amp;utm_campaign=redirect-types' );
				?>
			</p>
			<br class='clear'/>

			<a href='javascript:;' class='button-primary'><?php _e( 'Add Redirect', 'wordpress-seo-premium' ); ?></a>
		</div>
	</form>

	<p class='desc'>&nbsp;</p>

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
