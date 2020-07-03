<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

echo '<div class="yoast-field-group">';

if ( ! file_exists( $robots_file ) ) {
	if ( is_writable( get_home_path() ) ) {
		echo '<form action="', esc_url( $action_url ), '" method="post" id="robotstxtcreateform">';
		wp_nonce_field( 'wpseo_create_robots', '_wpnonce', true, true );
		echo '<p>';
		printf(
		/* translators: %s expands to robots.txt. */
			esc_html__( 'You don\'t have a %s file, create one here:', 'wordpress-seo' ),
			'robots.txt'
		);
		echo '</p>';

		printf(
			'<p clas="submit"><input type="submit" class="yoast-button yoast-button--primary" name="create_robots" value="%s"></p>',
			sprintf(
			/* translators: %s expands to robots.txt. */
				esc_attr__( 'Create %s file', 'wordpress-seo' ),
				'robots.txt'
			)
		);
		echo '</form>';
	}
	else {
		echo '<p>';
		printf(
		/* translators: %s expands to robots.txt. */
			esc_html__( 'If you had a %s file and it was editable, you could edit it from here.', 'wordpress-seo' ),
			'robots.txt'
		);
		echo '</p>';
	}
}
else {
	$f = fopen( $robots_file, 'r' );

	$content = '';
	if ( filesize( $robots_file ) > 0 ) {
		$content = fread( $f, filesize( $robots_file ) );
	}

	if ( ! is_writable( $robots_file ) ) {
		echo '<p><em>';
		printf(
		/* translators: %s expands to robots.txt. */
			esc_html__( 'If your %s were writable, you could edit it from here.', 'wordpress-seo' ),
			'robots.txt'
		);
		echo '</em></p>';
		echo '<textarea class="yoast-field-group__textarea code" disabled="disabled" rows="15" name="robotsnew">', esc_textarea( $content ), '</textarea><br/>';
	}
	else {
		echo '<form action="', esc_url( $action_url ), '" method="post" id="robotstxtform">';
		wp_nonce_field( 'wpseo-robotstxt', '_wpnonce', true, true );
		echo '<div class="yoast-field-group__title">';
		echo '<label for="robotsnew" class="yoast-inline-label">';
		printf(
		/* translators: %s expands to robots.txt. */
			esc_html__( 'Edit the content of your %s:', 'wordpress-seo' ),
			'robots.txt'
		);
		echo '</label>';
		echo '</div>';
		echo '<textarea class="yoast-field-group__textarea code" rows="15" name="robotsnew" id="robotsnew">', esc_textarea( $content ), '</textarea><br/>';
		printf(
			'<br><p><input class="yoast-button yoast-button--primary" type="submit" name="submitrobots" value="%s" /></p>',
			sprintf(
			/* translators: %s expands to robots.txt. */
				esc_attr__( 'Save changes to %s', 'wordpress-seo' ),
				'robots.txt'
			)
		);
		echo '</form>';
	}
}

echo '</div>'; // yoast-field-group.
