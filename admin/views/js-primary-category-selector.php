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
