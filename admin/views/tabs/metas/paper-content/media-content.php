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

$media_attachment_help = new WPSEO_Admin_Help_Button(
	'https://yoa.st/3yl',
	__( 'Learn more about the Media and attachment URLs setting', 'wordpress-seo' )
);

?>
<div class="yoast-feature">
	<h2 class="help-button-inline"><?php echo esc_html__( 'Media & attachment URLs', 'wordpress-seo' ) . $media_attachment_help; ?></h2>

	<p><strong><?php esc_html_e( 'We recommend you set this to Yes.', 'wordpress-seo' ); ?></strong></p>
	<?php

	$yoast_free_disable_attachments_texts = [
		__( 'Yes', 'wordpress-seo' ),
		__( 'No', 'wordpress-seo' ),
	];
	$yform->light_switch(
		'disable-attachment',
		__( 'Redirect attachment URLs to the attachment itself?', 'wordpress-seo' ),
		$yoast_free_disable_attachments_texts,
		false,
		true
	);

	?>

	<div id="media_settings">
		<?php
		$noindex_option_name = 'noindex-' . $wpseo_post_type->name;

		if ( WPSEO_Options::get( 'is-media-purge-relevant' ) && WPSEO_Options::get( $noindex_option_name ) === false ) {
			$description  = esc_html__(
				'By enabling this option, attachment URLs become visible to both your visitors and Google. To add value to your website, they should contain useful information, or they might have a negative impact on your ranking.',
				'wordpress-seo'
			);
			$description .= ' ';
			$description .= sprintf(
				/* translators: %1$s expands to the link to the article, %2$s closes the link to the article */
				esc_html__( 'Please carefully consider the implications and %1$sread this post%2$s if you want more information about the impact of showing media in search results.', 'wordpress-seo' ),
				'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/2r8' ) ) . '" rel="noopener noreferrer" target="_blank">',
				'</a>'
			);

			echo '<div class="yoast-notice">' . $description . '</div>';
		}

		require __DIR__ . '/post_type/post-type.php';
		?>
	</div>
</div>
