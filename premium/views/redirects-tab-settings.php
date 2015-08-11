<?php
/**
 * @package WPSEO\Premium\Views
 */

?>
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
