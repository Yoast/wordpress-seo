<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;

/**
 * Conditional that is only met when the SiteKit plugin is active.
 */
class Site_Kit_Conditional implements Conditional {

	/**
	 * Site Kit configuration
	 *
	 * @var Site_Kit $site_kit
	 */
	protected $site_kit;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit $site_kit The Site Kit configuration object.
	 */
	public function __construct( Site_Kit $site_kit ) {
		$this->site_kit = $site_kit;
	}

	/**
	 * Checks whether the SiteKit plugin is active.
	 *
	 * @return bool Whether the SiteKit plugin is active.
	 */
	public function is_met() {
		return $this->site_kit->is_enabled();
	}
}
