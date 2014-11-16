<?php

class WPSEO_i18n extends yoast_i18n {

	/**
	 * Initialize with some variables.
	 */
	public function init() {
		$this->textdomain              = 'wordpress-seo';
		$this->project_slug            = 'wordpress-seo';
		$this->plugin_name             = 'WordPress SEO by Yoast';
		$this->hook                    = 'wpseo_admin_footer';
		$this->translate_project_url   = 'http://translate.yoast.com/';
		$this->translate_project_name  = 'Yoast Translate';
		$this->translate_project_logo  = 'https://cdn.yoast.com/wp-content/uploads/i18n-images/Yoast_Translate.svg';
	}

}
