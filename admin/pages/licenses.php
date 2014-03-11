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

	<style>
		.wpseotab .extension {
			box-sizing: border-box;
			width: 300px;
			height: 230px;
			margin: 10px 20px 10px 0;
			float: left;
			border: 1px solid #ccc;
			background: no-repeat left 10px;
		}
		.wpseotab .extension p {
			margin: 0;
			padding: 10px;
		}
		.wpseotab .extension h3 {
			box-sizing: border-box;
			height: 110px;
			margin: 0;
			padding: 20px 10px 0 120px;
			border-bottom: 1px solid #ccc;
		}
		.wpseotab .seo-premium {
			background-image: url(https://yoast.com/wp-content/themes/yoast-theme/images/plugin-banners/Premium_130x100.png);
		}
		.wpseotab .video-seo {
			background-image: url(https://yoast.com/wp-content/themes/yoast-theme/images/plugin-banners/Video_130x100.png);
		}
		.wpseotab .video-manuals {
			background-image: url(https://yoast.com/wp-content/themes/yoast-theme/images/plugin-banners/Manual_130x100.png);
		}
		.wpseotab .local-seo {
			background-image: url(https://yoast.com/wp-content/themes/yoast-theme/images/plugin-banners/Local_130x100.png);
		}
		.wpseotab .woocommerce-seo {
			background-image: url(https://yoast.com/wp-content/themes/yoast-theme/images/plugin-banners/Woo_130x100.png);
		}
	</style>
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