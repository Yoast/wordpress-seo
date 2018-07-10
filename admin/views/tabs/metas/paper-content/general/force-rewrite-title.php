<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\General
 *
 * @var Yoast_Form $yform
 */

if ( ! current_theme_supports( 'title-tag' ) ) {
	?>
	<div class="tab-block">
		<?php
		$yform->light_switch( 'forcerewritetitle', __( 'Force rewrite titles', 'wordpress-seo' ) );
		echo '<p class="description">';
		printf(
			/* translators: %1$s expands to Yoast SEO */
			esc_html__( '%1$s has auto-detected whether it needs to force rewrite the titles for your pages, if you think it\'s wrong and you know what you\'re doing, you can change the setting here.', 'wordpress-seo' ),
			'Yoast SEO'
		);
		echo '</p>';
		?>
	</div>
	<?php
}
