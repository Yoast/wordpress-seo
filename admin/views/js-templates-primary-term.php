<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}
?>

<script type="text/html" id="tmpl-primary-term-input">
	<input type="hidden" class="yoast-wpseo-primary-term"
	       id="yoast-wpseo-primary-{{data.taxonomy.name}}"
	       name="<?php echo WPSEO_Meta::$form_prefix; ?>primary_{{data.taxonomy.name}}_term"
	       value="{{data.taxonomy.primary}}">

	<?php wp_nonce_field( 'save-primary-term', WPSEO_Meta::$form_prefix . 'primary_{{data.taxonomy.name}}_nonce' ); ?>
</script>

<script type="text/html" id="tmpl-primary-term-ui">
	<?php
		printf(
			'<button type="button" class="wpseo-make-primary-term" aria-label="%1$s">%2$s</button>',
			sprintf(
				/* translators: accessibility text. %1$s expands to the term title, %2$s to the taxonomy title. */
				__( 'Make %1$s primary %2$s', 'wordpress-seo' ),
				'{{data.term}}',
				'{{data.taxonomy.title}}'
			),
			__( 'Make primary', 'wordpress-seo' )
		);
		?>

	<span class="wpseo-is-primary-term" aria-hidden="true"><?php _e( 'Primary', 'wordpress-seo' ); ?></span>
</script>

<script type="text/html" id="tmpl-primary-term-screen-reader">
	<span class="screen-reader-text wpseo-primary-category-label"><?php
		printf(
			/* translators: %s is the taxonomy title. This will be shown to screenreaders */
			'(' . __( 'Primary %s', 'wordpress-seo' ) . ')',
			'{{data.taxonomy.title}}'
		);
		?></span>
</script>
