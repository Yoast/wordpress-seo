<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Health_Check;

use Yoast\WP\SEO\Llms_Txt\User_Interface\Health_Check\File_Reports;

/**
 * Set_Test_Identifier test.
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Health_Check\File_Reports::__construct
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Health_Check\File_Reports::set_test_identifier
 */
final class Set_Test_Identifier_Test extends Abstract_File_Reports_Test {

	/**
	 * Test that the Reports_Trait methods are available.
	 *
	 * @return void
	 */
	public function test_uses_reports_trait() {
		$this->instance = new File_Reports( $this->report_builder_factory );

		$this->instance->set_test_identifier( 'test_identifier' );

		$this->assertTrue( true );
	}
}
