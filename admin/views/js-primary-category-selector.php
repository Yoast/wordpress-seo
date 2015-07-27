<?php
/**
 * @package WPSEO\Admin
 */

?>

<script type="text/html" id="tmpl-primary-term-input">
	<input type="hidden" class="yoast-wpseo-primary-term"
	       id="yoast-wpseo-primary-{{data.taxonomy.name}}"
	       name="<?php echo WPSEO_Meta::$form_prefix; ?>primary_{{data.taxonomy.name}}_term"
	       value="{{data.taxonomy.primary}}">

	<?php wp_nonce_field( 'save-primary-term', WPSEO_Meta::$form_prefix . 'primary_{{data.taxonomy.name}}_nonce' ); ?>
</script>

<script type="text/html" id="tmpl-primary-term-ui">
	<a href="#" class="wpseo-make-primary-term"><?php
		/* Text between %1$s and %2$s is only shown to screen readers. %3$s expands to the term title, %4$s expands to the taxonomy name */
		printf(
			__( 'Make %1$s %3$s the %2$s primary %1$s %4$s %2$s', 'wordpress-seo' ),
			'<span class="screen-reader-text">',
			'</span>',
			'{{data.term}}',
			'{{data.taxonomy.title}}'
		);
	?></a>

	<span class="wpseo-is-primary-term"><?php
		printf(
			/* Text between %1$s and %2$s is only shown to screen readers. %3$s expands to the term title, %4$s expands to the taxonomy name */
			__( '%1$s%3$s is the %2$sPrimary%1$s%4$s%2$s', 'wordpress-seo' ),
			'<span class="screen-reader-text">',
			'</span>',
			'{{data.term}}',
			'{{data.taxonomy.title}}'
		);
	?></span>
</script>
