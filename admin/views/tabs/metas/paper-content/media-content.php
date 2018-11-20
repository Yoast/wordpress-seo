<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Media
 *
 * @var Yoast_Form $yform
 */

$wpseo_post_type              = get_post_type_object( 'attachment' );
$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();
$view_utils                   = new Yoast_View_Utils();
?>
<p><strong><?php esc_html_e( 'We recommend you set this to Yes.', 'wordpress-seo' ); ?></strong></p>
<?php

$yform->toggle_switch(
	'disable-attachment',
	array(
		'on'  => __( 'Yes', 'wordpress-seo' ),
		'off' => __( 'No', 'wordpress-seo' ),
	),
	__( 'Redirect attachment URLs to the attachment itself?', 'wordpress-seo' )
);

?>
<div id="media_settings">
	<br/>
	<br/>

	<?php
	$noindex_option_name = 'noindex-' . $wpseo_post_type->name;

	if ( WPSEO_Options::get( 'is-media-purge-relevant' ) && WPSEO_Options::get( $noindex_option_name ) === false ) {
		$description =
			esc_html__( 'By enabling this option, attachment URLs become visible to both your visitors and Google. To add value to your website, they should contain useful information, or they might have a negative impact on your ranking.', 'wordpress-seo' ) . ' ' .
			sprintf(
				/* translators: %1$s expands to the link to the article, %2$s closes the link to the article */
				esc_html__( 'Please carefully consider the implications and %1$sread this post%2$s if you want more information about the impact of showing media in search results.', 'wordpress-seo' ),
				'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/2r8' ) ) . '" rel="noopener noreferrer" target="_blank">',
				'</a>'
			);

		echo '<div style="clear:both; background-color: #ffeb3b; color: #000000; padding: 16px; max-width: 450px; margin-bottom: 32px;">' . $description . '</div>';
	}

	require dirname( __FILE__ ) . '/post_type/post-type.php';
	?>
</div>
