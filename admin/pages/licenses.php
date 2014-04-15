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
			<?php
				if ( ! class_exists( 'WPSEO_Premium' ) ) {
			?>
			<div class="extension seo-premium">
				<a target="_blank" href="https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners"><h3>WordPress SEO Premium</h3></a>
				<p>The premium version of WordPress SEO with more features & support.</p>
				<p><a target="_blank" href="https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners" class="button-primary">Get this extension</a></p>
			</div>
			<?php
				}
				if ( ! class_exists( 'wpseo_Video_Sitemap' ) ) {
			?>
			<div class="extension video-seo">
				<a target="_blank" href="https://yoast.com/wordpress/plugins/video-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners"><h3>Video SEO</h3></a>
				<p>Optimize your videos to show them off in search results and get more clicks!</p>
				<p><a target="_blank" href="https://yoast.com/wordpress/plugins/video-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners" class="button-primary">Get this extension</a></p>
			</div>
			<?php
				}
				if ( ! defined( 'WPSEO_LOCAL_VERSION' ) ) {
			?>
			<div class="extension local-seo">
				<a target="_blank" href="https://yoast.com/wordpress/plugins/local-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners"><h3>Local SEO</h3></a>
				<p>Rank better locally and in Google Maps, without breaking a sweat!</p>
				<p><a target="_blank" href="https://yoast.com/wordpress/plugins/local-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners" class="button-primary">Get this extension</a></p>
			</div>
			<?php
				}
				if ( ! class_exists( 'wpseo_Video_Manual' ) ) {
			?>
			<div class="extension video-manuals">
				<a target="_blank" href="https://yoast.com/wordpress/plugins/video-manual-wordpress-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners"><h3>WordPress SEO Training Videos</h3></a>
				<p>Spend less time training your clients on how to use the WordPress SEO plugin!</p>
				<p><a target="_blank" href="https://yoast.com/wordpress/plugins/video-manual-wordpress-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners" class="button-primary">Get this extension</a></p>
			</div>
			<?php
				}
				if ( class_exists( 'Woocommerce' ) && ! class_exists( 'Yoast_WooCommerce_SEO' ) ) {
			?>
			<div class="extension woocommerce-seo">
				<a target="_blank" href="https://yoast.com/wordpress/plugins/yoast-woocommerce-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners"><h3>Yoast WooCommerce SEO</h3></a>
				<p>Seamlessly integrate WooCommerce with WordPress SEO and get extra features!</p>
				<p><a target="_blank" href="https://yoast.com/wordpress/plugins/yoast-woocommerce-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners" class="button-primary">Get this extension</a></p>
			</div>
			<?php
				}
			?>
		</div>
		<div id="licenses" class="wpseotab">
			<?php

				/**
				 * Display license page
				 */
				settings_errors();
                do_action('wpseo_licenses_forms');

			?>
		</div>
	</div>

</div>