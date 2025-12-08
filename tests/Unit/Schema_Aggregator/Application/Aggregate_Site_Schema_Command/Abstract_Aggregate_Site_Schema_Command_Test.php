<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Aggregate_Site_Schema_Command;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Aggregate_Site_Schema_Command tests.
 */
abstract class Abstract_Aggregate_Site_Schema_Command_Test extends TestCase {

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
	}
}
