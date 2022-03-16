<?php

namespace Yoast\WP\SEO\Config;

use WordProof\SDK\Config\DefaultAppConfig;

/**
 * Class WordProof_App_Config.
 *
 * @package Yoast\WP\SEO\Config
 */
class WordProof_App_Config extends DefaultAppConfig {

	/**
	 * Returns the partner.
	 *
	 * @return string The partner.
	 */
	public function getPartner() {
		return 'yoast';
	}
}
