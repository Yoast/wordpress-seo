<?php

namespace Yoast\WP\SEO\Integrations\Alerts;

use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Conditionals\Premium_Inactive_Conditional;

/**
 * Dismissable_Alert class.
 */
class Webinar_Promo_Alert extends Abstract_Dismissable_Alert {

	/**
	 * Holds the alert identifier.
	 *
	 * @var string
	 */
	protected $alert_identifier = "webinar-promo-alert";
}
