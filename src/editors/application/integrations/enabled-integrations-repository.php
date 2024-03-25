<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Editors\Application\Integrations;

use Yoast\WP\SEO\Editors\Domain\Integrations\Integration_Data_Provider_Interface;
use Yoast\WP\SEO\Editors\Framework\Analysis_Feature_Interface;

/**
 * The repository to get all enabled integrations.
 *
 * @makePublic
 */
class Enabled_Integrations_Repository {

	/**
	 * All plugin integrations.
	 *
	 * @var Analysis_Feature_Interface[] $plugin_integrations
	 */
	private $plugin_integrations;

	/**
	 * The constructor.
	 *
	 * @param Integration_Data_Provider_Interface ...$plugin_integrations All integrations.
	 */
	public function __construct( Integration_Data_Provider_Interface ...$plugin_integrations ) {
		$this->plugin_integrations = $plugin_integrations;
	}

	/**
	 * Returns the analysis list.
	 *
	 * @return array The parsed list.
	 */
	public function get_enabled_integrations(): array {
		$array = [];
		foreach ( $this->plugin_integrations as $feature ) {
			$array = \array_merge( $array, $feature->to_legacy_array() );
		}
		return $array;
	}
}
