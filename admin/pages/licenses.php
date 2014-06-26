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
			$extensions = array();

			if ( ! class_exists( 'WPSEO_Premium' ) ) {
				$extensions['seo-premium'] = (object) array(
					'url'   => 'https://yoast.com/wordpress/plugins/seo-premium/',
					'title' => __( 'WordPress SEO Premium', 'wordpress-seo' ),
					'desc'  => __( 'The premium version of WordPress SEO with more features & support.', 'wordpress-seo' ),
				);
			}
			if ( ! class_exists( 'wpseo_Video_Sitemap' ) ) {
				$extensions['video-seo'] = (object) array(
					'url'   => 'https://yoast.com/wordpress/plugins/video-seo/',
					'title' => __( 'Video SEO', 'wordpress-seo' ),
					'desc'  => __( 'Optimize your videos to show them off in search results and get more clicks!', 'wordpress-seo' ),
				);
			}
			if ( ! class_exists( 'WPSEO_News' ) ) {
				$extensions['news-seo'] = (object) array(
					'url'   => 'https://yoast.com/wordpress/plugins/news-seo/',
					'title' => __( 'News SEO', 'wordpress-seo' ),
					'desc'  => __( 'Are you in Google News? Increase your traffic from Google News by optimizing for it!', 'wordpress-seo' ),
				);
			}
			if ( ! defined( 'WPSEO_LOCAL_VERSION' ) ) {
				$extensions['local-seo'] = (object) array(
					'url'   => 'https://yoast.com/wordpress/plugins/local-seo/',
					'title' => __( 'Local SEO', 'wordpress-seo' ),
					'desc'  => __( 'Rank better locally and in Google Maps, without breaking a sweat!', 'wordpress-seo' ),
				);
			}
			if ( ! class_exists( 'wpseo_Video_Manual' ) ) {
				$extensions['video-manuals'] = (object) array(
					'url'   => 'https://yoast.com/wordpress/plugins/video-manual-wordpress-seo/',
					'title' => __( 'WordPress SEO Training Videos', 'wordpress-seo' ),
					'desc'  => __( 'Spend less time training your clients on how to use the WordPress SEO plugin!', 'wordpress-seo' ),
				);
			}
			if ( class_exists( 'Woocommerce' ) && ! class_exists( 'Yoast_WooCommerce_SEO' ) ) {
				$extensions['woocommerce-seo'] = (object) array(
					'url'   => 'https://yoast.com/wordpress/plugins/yoast-woocommerce-seo/',
					'title' => __( 'Yoast WooCommerce SEO', 'wordpress-seo' ),
					'desc'  => __( 'Seamlessly integrate WooCommerce with WordPress SEO and get extra features!', 'wordpress-seo' )
				);
			}
			if ( ! class_exists( 'Post_Connector' ) ) {
				$extensions['post-connector'] = (object) array(
					'url'   => 'https://yoast.com/wordpress/plugins/post-connector/',
					'title' => __( 'Post Connector', 'wordpress-seo' ),
					'desc'  => __( 'Easily create related posts that don\'t lag your server!', 'wordpress-seo' ),
				);
			}

			foreach ( $extensions as $id => $extension ) {
				$utm = '#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=extension-page-banners';
			?>
			<div class="extension <?php echo esc_attr( $id ); ?>">
				<a target="_blank" href="<?php echo esc_url( $extension->url . $utm ); ?>"><h3><?php echo esc_html( $extension->title ); ?></h3></a>
				<p><?php echo esc_html( $extension->desc ); ?></p>
				<p><a target="_blank" href="<?php echo esc_url( $extension->url . $utm ); ?>" class="button-primary"><?php esc_html_e( 'Get this extension', 'wordpress-seo' ); ?></a></p>
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
				do_action( 'wpseo_licenses_forms' );
			?>
		</div>
	</div>

</div>