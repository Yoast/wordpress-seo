<?php

if ( class_exists( 'Yoast_Product' ) && ! class_exists( 'WPSEO_Product_Premium', false ) ) {

	class WPSEO_Product_Premium extends Yoast_Product {

		public function __construct() {
			parent::__construct(
				WPSEO_Premium::EDD_STORE_URL,
				WPSEO_Premium::EDD_PLUGIN_NAME,
				plugin_basename( WPSEO_FILE ),
				WPSEO_Premium::PLUGIN_VERSION_NAME,
				'https://yoast.com/wordpress/plugins/seo-premium/',
				'admin.php?page=wpseo_licenses#top#licenses',
				'wordpress-seo',
				WPSEO_Premium::PLUGIN_AUTHOR
			);
		}

	}

}