<?php
/**
 * @package WPSEO\Premium\Views
 */

	// Admin header.
	Yoast_Form::get_instance()->admin_header( false, 'wpseo_redirects', false, 'yoast_wpseo_redirects_options' );
?>
<h2 class="nav-tab-wrapper" id="wpseo-tabs">
	<a class="nav-tab" id="tab-url-tab" href="#top#tab-url"><?php _e( 'Redirects', 'wordpress-seo-premium' ); ?></a>
	<a class="nav-tab" id="tab-regex-tab" href="#top#tab-regex"><?php _e( 'Regex Redirects', 'wordpress-seo-premium' ); ?></a>
	<a class="nav-tab" id="settings-tab" href="#top#settings"><?php _e( 'Settings', 'wordpress-seo-premium' ); ?></a>
</h2>

<div class="tabwrapper>">
	<div id="tab-url" class="wpseotab redirect-table-tab">
		<form class='wpseo-new-redirect-form' method='post'>
			<div class='wpseo_redirects_new'>
				<label class='textinput' for='wpseo_redirects_new_old'><?php _e( 'Old URL', 'wordpress-seo-premium' ); ?></label>
				<input type='text' class='textinput' name='wpseo_redirects_new_old' id='wpseo_redirects_new_old' value='<?php echo $old_url; ?>' />
				<br class='clear'/>

				<label class='textinput' for='wpseo_redirects_new_new'><?php _e( 'New URL', 'wordpress-seo-premium' ); ?></label>
				<input type='text' class='textinput' name='wpseo_redirects_new_new' id='wpseo_redirects_new_new' value='' />
				<br class='clear'/>

				<label class='textinput' for='wpseo_redirects_new_type'><?php echo _x( 'Type', 'noun', 'wordpress-seo-premium' ); ?></label>
				<select name='wpseo_redirects_new_type' id='wpseo_redirects_new_type' class='select'>
				<?php
				// Loop through the redirect types.
				if ( count( $redirect_types ) > 0 ) {
					foreach ( $redirect_types as $type => $desc ) {
						echo "<option value='" . $type . "'>" . $desc . '</option>' . PHP_EOL;
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

		<form id='url' class='wpseo-redirects-table-form' method='post' action=''>
			<input type='hidden' class='wpseo_redirects_ajax_nonce' value='<?php echo $nonce; ?>' />
			<?php
				// The list table.
				$list_table = new WPSEO_Redirect_Table( 'URL' );
				$list_table->prepare_items();
				$list_table->search_box( __( 'Search', 'wordpress-seo-premium' ), 'wpseo-redirect-search' );
				$list_table->display();
			?>
		</form>
	</div>

	<div id="tab-regex" class="wpseotab redirect-table-tab">
		<p>
			<?php
				/* translators: %1$s contains a line break tag. %2$s links to our knowledge base, %3$s closes the link. */
				printf( __( 'Regex Redirects are extremely powerful redirects. You should only use them if you know what you are doing.%1$sIf you don\'t know what Regular Expressions (regex) are, please refer to %2$sour knowledge base%3$s.', 'wordpress-seo-premium' ), '<br />', '<a href="http://kb.yoast.com/article/142-what-are-regex-redirects" target="_blank">', '</a>' )
			?>
		</p>

		<form class='wpseo-new-redirect-form' method='post'>
			<div class='wpseo_redirects_new'>

				<label class='textinput' for='wpseo_redirects_new_old'><?php _e( 'Regular Expression', 'wordpress-seo-premium' ); ?></label>
				<input type='text' class='textinput' name='wpseo_redirects_new_old' id='wpseo_redirects_new_old' value='<?php echo $old_url; ?> ' />
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

		<form id='regex' class='wpseo-redirects-table-form' method='post' action=''>
			<input type='hidden' class='wpseo_redirects_ajax_nonce' value='<?php echo $nonce; ?>' />
			<?php
				// The list table.
				$list_table = new WPSEO_Redirect_Table( 'REGEX' );
				$list_table->prepare_items();
				$list_table->search_box( __( 'Search', 'wordpress-seo-premium' ), 'wpseo-redirect-search' );
				$list_table->display();
			?>
		</form>
	</div>

	<div id="settings" class="wpseotab">
		<?php
		if ( ! empty( $pre_settings ) ) {
			echo $pre_settings;
		}
		?>

		<form action="<?php echo admin_url( 'options.php' ); ?>" method="post">
			<?php
			settings_fields( 'yoast_wpseo_redirect_options' );

			Yoast_Form::get_instance()->set_option( 'wpseo_redirect' );

			Yoast_Form::get_instance()->checkbox( 'disable_php_redirect', __( 'Disable PHP redirects', 'wordpress-seo-premium' ) );

			if ( WPSEO_Utils::is_apache() ) {
				/* translators: 1: '.htaccess' file name */
				echo '<p class="desc">' . sprintf( __( 'Write redirects to the %1$s file. Make sure the %1$s file is writable.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' ) . '</p>';

				echo Yoast_Form::get_instance()->checkbox( 'separate_file', __( 'Generate a separate redirect file', 'wordpress-seo-premium' ) );

				/* translators: %s: '.htaccess' file name */
				echo '<p class="desc">' . sprintf( __( 'By default we write the redirects to your %s file, check this if you want the redirects written to a separate file. Only check this option if you know what you are doing!', 'wordpress-seo-premium' ), '<code>.htaccess</code>' ) . '</p>';
			}
			else {
				/* translators: %s: 'Yoast SEO Premium' */
				echo '<p class="desc">' . sprintf( __( '%s will generate redirect files that can be included in your website configuration. You can disable PHP redirect if this is done correctly. Only check this option if you know what you are doing!', 'wordpress-seo-premium' ), 'Yoast SEO Premium' ) . '</p>';
			}

			?>
			<p class="submit">
				<input type="submit" name="submit" id="submit" class="button button-primary" value="<?php _e( 'Save Changes', 'wordpress-seo-premium' ); ?>" />
			</p>
		</form>
	</div>
</div>
<br class="clear">
<?php
	// Admin footer.
	Yoast_Form::get_instance()->admin_footer( false );
