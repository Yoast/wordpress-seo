<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Integrations\Front_End;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Crawl_Cleanup_Rss;

/**
 * Class Crawl_Cleanup_Rss_Double.
 */
class Crawl_Cleanup_Rss_Double extends Crawl_Cleanup_Rss {

	public function __construct( Options_Helper $options_helper) {
		parent::__construct( $options_helper );
	}

	public function cache_control_header( $expiration ) {
	}

	public function redirect_feed( $url, $reason ) {
	}

	}

