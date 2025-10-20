<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Initializers\Silence_Load_Textdomain_Just_In_Time_Notices;

use Brain\Monkey;

/**
 * Test class for the initializer.
 *
 * @group Silence_Load_Textdomain_Just_In_Time_Notices
 *
 * @covers Yoast\WP\SEO\Initializers\Silence_Load_Textdomain_Just_In_Time_Notices::initialize
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Silence_Load_Textdomain_Just_In_Time_Notices_Initializer_Test extends Abstract_Silence_Load_Textdomain_Just_In_Time_Notices_Test {

	/**
	 * Tests initialize().
	 *
	 * @return void
	 */
	public function test_constructor() {
		Monkey\Filters\expectAdded( 'doing_it_wrong_trigger_error' )
			->with( [ $this->instance, 'silence_textdomain_notices' ], 10, 2 )
			->times( 1 );
		$this->instance->initialize();
	}
}
