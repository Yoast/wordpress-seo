<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Conditionals\Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional for the Schema aggregator feature.
 */
class Schema_Aggregator_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Returns `true` when the Schema aggregator feature is enabled.
	 *
	 * @return bool `true` when the Schema aggregator feature is enabled.
	 */
	public function is_met(): bool {
		return $this->options->get( 'enable_schema_aggregation_endpoint' ) === true;
	}
}
