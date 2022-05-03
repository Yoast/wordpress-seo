<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Media
 *
 * @uses Yoast_Form $yform Form object.
 */

$wpseo_post_type              = get_post_type_object( 'attachment' );
$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();
$view_utils                   = new Yoast_View_Utils();
?>
<p><strong><?php esc_html_e( 'We recommend you set this to Yes.', 'wordpress-seo' ); ?></strong></p>
<?php

$yoast_free_disable_attachments_texts = [
	'on'  => __( 'Yes', 'wordpress-seo' ),
	'off' => __( 'No', 'wordpress-seo' ),
];
$yform->toggle_switch(
	'disable-attachment',
	$yoast_free_disable_attachments_texts,
	__( 'Redirect attachment URLs to the attachment itself?', 'wordpress-seo' )
);

?>
<div id="media_settings">
	<br/>
	<br/>

	<?php
	require __DIR__ . '/post_type/post-type.php';
	?>
</div>
