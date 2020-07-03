<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

if ( file_exists( $ht_access_file ) ) {
	$f = fopen( $ht_access_file, 'r' );

	$contentht = '';
	if ( filesize( $ht_access_file ) > 0 ) {
		$contentht = fread( $f, filesize( $ht_access_file ) );
	}

	if ( ! is_writable( $ht_access_file ) ) {
		echo '<p><em>';
		printf(
		/* translators: %s expands to ".htaccess". */
			esc_html__( 'If your %s were writable, you could edit it from here.', 'wordpress-seo' ),
			'.htaccess'
		);
		echo '</em></p>';
		echo '<textarea class="yoast-field-group__textarea code" disabled="disabled" rows="15" name="robotsnew">', esc_textarea( $contentht ), '</textarea><br/>';
	}
	else {
		echo '<form action="', esc_url( $action_url ), '" method="post" id="htaccessform">';
		wp_nonce_field( 'wpseo-htaccess', '_wpnonce', true, true );
		echo '<div class="yoast-field-group__title">';
		echo '<label for="htaccessnew" class="yoast-inline-label">';
		printf(
		/* translators: %s expands to ".htaccess". */
			esc_html__( 'Edit the content of your %s:', 'wordpress-seo' ),
			'.htaccess'
		);
		echo '</label>';
		echo '</div>';
		echo '<textarea class="yoast-field-group__textarea code" rows="15" name="htaccessnew" id="htaccessnew">', esc_textarea( $contentht ), '</textarea><br/>';
		printf(
			'<br><p><input class="yoast-button yoast-button--primary" type="submit" name="submithtaccess" value="%s" /></p>',
			sprintf(
			/* translators: %s expands to ".htaccess". */
				esc_attr__( 'Save changes to %s', 'wordpress-seo' ),
				'.htaccess'
			)
		);
		echo '</form>';
	}
}
else {
	echo '<p>';
	printf(
	/* translators: %s expands to ".htaccess". */
		esc_html__( 'If you had a %s file and it was editable, you could edit it from here.', 'wordpress-seo' ),
		'.htaccess'
	);
	echo '</p>';
}
