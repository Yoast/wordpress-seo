<?php
/**
 * @package Admin
 * @todo Add default content (when no premium plugins are activated)
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

global $wpseo_admin_pages;
?>

<div class="wrap wpseo_table_page">

	<h2 id="wpseo-title"><?php echo esc_html( get_admin_page_title() ); ?></h2>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" id="extensions-tab" href="#top#extensions"><?php _e( 'Extensions', 'wordpress-seo' );?></a>
		<a class="nav-tab" id="licenses-tab" href="#top#licenses"><?php _e( 'Licenses', 'wordpress-seo' );?></a>
	</h2>

	<div class="tabwrapper">
		<div id="extensions" class="wpseotab">
			<div class="extension seo-premium">
				<h3>WordPress SEO Premium</h3>
				<p>The premium version of WordPress SEO with more features & support.</p>
				<p><a href="https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners" class="button-primary">Get this extension</a></p>
			</div>
			<div class="extension video-seo">
				<h3>Video SEO</h3>
				<p>Optimize your videos to show them off in search results and get more clicks!</p>
				<p><a href="https://yoast.com/wordpress/plugins/video-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners" class="button-primary">Get this extension</a></p>
			</div>
			<div class="extension local-seo">
				<h3>Local SEO</h3>
				<p>Rank better locally and in Google Maps, without breaking a sweat!</p>
				<p><a href="https://yoast.com/wordpress/plugins/local-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners" class="button-primary">Get this extension</a></p>
			</div>
			<div class="extension video-manuals">
				<h3>WordPress SEO Training Videos</h3>
				<p>Spend less time training your clients on how to use the WordPress SEO plugin!</p>
				<p><a href="https://yoast.com/wordpress/plugins/video-manual-wordpress-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners" class="button-primary">Get this extension</a></p>
			</div>
			<div class="extension woocommerce-seo">
				<h3>Yoast WooCommerce SEO</h3>
				<p>Seamlessly integrate WooCommerce with WordPress SEO and get extra features!</p>
				<p><a href="https://yoast.com/wordpress/plugins/yoast-woocommerce-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners" class="button-primary">Get this extension</a></p>
			</div>
		</div>
		<div id="licenses" class="wpseotab">

			<?php settings_errors(); ?>

			<?php do_action('wpseo_licenses_forms'); ?>
		</div>
	</div>

</div>