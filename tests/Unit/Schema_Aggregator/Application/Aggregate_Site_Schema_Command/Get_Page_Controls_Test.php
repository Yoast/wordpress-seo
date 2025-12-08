<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Aggregate_Site_Schema_Command;

use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Page_Controls;

/**
 * Tests the Aggregate_Site_Schema_Command get_page_controls method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command::get_page_controls
 */
final class Get_Page_Controls_Test extends Abstract_Aggregate_Site_Schema_Command_Test {

	/**
	 * Tests get_page_controls returns Page_Controls instance.
	 *
	 * @return void
	 */
	public function test_get_page_controls_returns_page_controls() {
		$command = new Aggregate_Site_Schema_Command( 2, 100, 'page' );

		$result = $command->get_page_controls();

		$this->assertInstanceOf( Page_Controls::class, $result );
	}
}
