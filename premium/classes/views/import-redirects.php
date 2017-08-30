<?php
/**
 * @package WPSEO\Premium\Views
 */

?>
<div id="import-htaccess" class="wpseotab">
	<div>
	<h2><?php _e( 'Import from other redirect plugins', 'wordpress-seo-premium' ); ?></h2>
	<form action="" method="post" accept-charset="<?php esc_attr_e( get_bloginfo( 'charset' ), 'wordpress-seo-premium' ); ?>">
		<?php wp_nonce_field( 'wpseo-import', '_wpnonce', true ); ?>
		<?php
			Yoast_Form::get_instance()->radio( 'import_plugin', $plugins, __( 'Import from:', 'wordpress-seo-premium' ) );
		?>
		<br/>
		<input type="submit" class="button button-primary" name="import" value="<?php _e( 'Import redirects', 'wordpress-seo-premium' ); ?>"/>
	</form>
	</div>

	<br/>

	<div>
	<h2><?php _e( 'Import from a CSV file', 'wordpress-seo-premium' ); ?></h2>
	<form enctype="multipart/form-data" action="" method="post" accept-charset="<?php esc_attr_e( get_bloginfo( 'charset' ), 'wordpress-seo-premium' ); ?>">
		<?php wp_nonce_field( 'wpseo-import', '_wpnonce', true ); ?>
		<p><input type="file" name="redirects_csv_file" id="redirects_csv_file"/></p>
		<input type="submit" class="button button-primary" name="import_csv" value="<?php _e( 'Import CSV file', 'wordpress-seo-premium' ); ?>"/>
	</form>
	</div>

	<br/>

	<div>
	<h2><?php
		/* translators: %s: '.htaccess' file name */
		printf( __( 'Import redirects from %s', 'wordpress-seo-premium' ), '<code>.htaccess</code>' );
	?></h2>
	<p>
		<?php
		/* translators: %1$s: '.htaccess' file name, %2$s plugin name */
		printf( __( 'You can copy the contents of any %1$s file in here, and it will import the redirects into %2$s.', 'wordpress-seo-premium' ), '<code>.htaccess</code>', 'Yoast SEO Premium' );
		?>
	</p>
	<form action="" method="post" accept-charset="<?php esc_attr_e( get_bloginfo( 'charset' ), 'wordpress-seo-premium' ); ?>">
		<?php wp_nonce_field( 'wpseo-import', '_wpnonce', true ); ?>
		<label for="htaccess" class="screen-reader-text"><?php _e( 'Enter redirects to import', 'wordpress-seo-premium' ); ?></label>
		<textarea name="htaccess" id="htaccess" rows="15" class="large-text code"></textarea><br/>
		<input type="submit" class="button button-primary" name="import" value="<?php _e( 'Import .htaccess', 'wordpress-seo-premium' ); ?>"/>
	</form>
	</div>
</div>
