<?php
/**
 * @package WPSEO\Admin\Views\General
 *
 * @var Yoast_Form $yform
 */
?>
<div class="tab-block">
	<h2><?php esc_html_e( 'Website name', 'wordpress-seo' ); ?></h2>
	<p class="description">
		<?php
		esc_html_e( 'Google shows your website\'s name in the search results, we will default to your site name but you can adapt it here. You can also provide an alternate website name you want Google to consider.', 'wordpress-seo' );
		?>
	</p>
	<?php
	$yform->textinput( 'website_name', __( 'Website name', 'wordpress-seo' ), array( 'placeholder' => get_bloginfo( 'name' ) ) );
	$yform->textinput( 'alternate_website_name', __( 'Alternate name', 'wordpress-seo' ) );
	?>
</div>
