<?php
/**
 * @package WPSEO\Premium\Views
 */

if ( ! empty( $redirect_file ) ) {
	switch ( $redirect_file ) {
		case 'apache_include_file' :
			?>
			<div class="notice notice-warning inline">
				<p>
					<?php _e( "As you're on Apache, you should add the following include to the website httpd config file:", 'wordpress-seo-premium' ); ?>
					<br><code>Include <?php echo $file_path; ?></code>
				</p>
			</div>
			<?php
			break;
		case 'cannot_write_htaccess' :
			?>
			<div class='notice notice-error inline'>
				<p>
					<?php
					/* translators: %s: '.htaccess' file name. */
					printf( __( "We're unable to save the redirects to your %s file. Please make the file writable.", 'wordpress-seo-premium' ),
						'<code>.htaccess</code>'
					);
					?>
				</p>
			</div>

			<?php
			break;
		case 'nginx_include_file' :
			?>
			<div class="notice notice-warning inline">
				<p>
					<?php _e( "As you're on Nginx, you should add the following include to the Nginx config file:", 'wordpress-seo-premium' ); ?>
					<br><code>include <?php echo $file_path; ?></code>
				</p>
			</div>
			<?php
			break;
		case 'cannot_write_file' :
			?>
			<div class='notice notice-error inline'>
				<p>
					<?php
					/* translators: %s expands to the folder location where the redirects fill will be saved. */
					printf( __( "We're unable to save the redirect file to %s", 'wordpress-seo-premium' ),
						$file_path
					);
					?>
				</p>
			</div>
			<?php
			break;
	}
}
	?>

<div id="table-settings" class="tab-url redirect-table-tab">
<?php echo '<h2>' . esc_html( 'Redirects settings', 'wordpress-seo-premium' ) . '</h2>'; ?>
	<form action="<?php echo admin_url( 'options.php' ); ?>" method="post">
		<?php
		settings_fields( 'yoast_wpseo_redirect_options' );

		$yform = Yoast_Form::get_instance();

		$yform->set_option( 'wpseo_redirect' );

		$yform->toggle_switch( 'disable_php_redirect', array(
			'off' => '<code>PHP</code>',
			'on'  => ( WPSEO_Utils::is_apache() ) ? '<code>.htaccess</code>' : __( 'Web server', 'wordpress-seo-premium' ),
		), __( 'Redirect method', 'wordpress-seo-premium' ) );

		if ( WPSEO_Utils::is_apache() ) {
			/* translators: 1: '.htaccess' file name */
			echo '<p>' . sprintf( __( 'Write redirects to the %1$s file. Make sure the %1$s file is writable.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' ) . '</p>';

			$yform->light_switch( 'separate_file', __( 'Generate a separate redirect file', 'wordpress-seo-premium' ) );

			/* translators: %s: '.htaccess' file name */
			echo '<p>' . sprintf( __( 'By default we write the redirects to your %s file, check this if you want the redirects written to a separate file. Only check this option if you know what you are doing!', 'wordpress-seo-premium' ), '<code>.htaccess</code>' ) . '</p>';
		}
		else {
			/* translators: %s: 'Yoast SEO Premium' */
			echo '<p>' . sprintf( __( '%s can generate redirect files that can be included in your website web server configuration. If you choose this option the PHP redirects will be disabled. Only check this option if you know what you are doing!', 'wordpress-seo-premium' ), 'Yoast SEO Premium' ) . '</p>';
		}
		?>
		<p class="submit">
			<input type="submit" name="submit" id="submit" class="button button-primary" value="<?php _e( 'Save Changes', 'wordpress-seo-premium' ); ?>" />
		</p>
	</form>
</div>
