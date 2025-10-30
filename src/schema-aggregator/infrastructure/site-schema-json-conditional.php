<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Conditionals\Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional that checks if the Site schema feature is turned on and the site wants to output our schema.
 */
class Site_Schema_Json_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Attachment_Redirections_Enabled_Conditional constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Returns whether the 'Site schema route' setting has been enabled.
	 *
	 * @return bool `true` when the 'Site schema route' setting has been enabled.
	 */
	public function is_met() {
		return true;
	}
}
