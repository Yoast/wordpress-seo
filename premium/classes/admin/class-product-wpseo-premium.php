<?php

class Yoast_Product_WPSEO_Premium extends Yoast_Product {

	public function __construct() {
		parent::__construct(
				WPSEO_Premium::EDD_STORE_URL,
				WPSEO_Premium::EDD_PLUGIN_NAME,
				plugin_basename( WPSEO_FILE ),
				WPSEO_Premium::PLUGIN_VERSION_NAME,
				'https://yoast.com/wordpress/plugins/wordpress-seo-premium/',
				'admin.php?page=wpseo_licenses',
				'wordpress-seo',
				WPSEO_Premium::PLUGIN_AUTHOR
		);
	}

}