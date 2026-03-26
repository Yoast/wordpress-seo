<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Yoast_Plugins_Tab\Application\Yoast_Plugins_List_Handler;

use Brain\Monkey;

/**
 * Tests the Yoast_Plugins_List_Handler get_status_text method.
 *
 * @group yoast-plugins-tab
 *
 * @covers Yoast\WP\SEO\Yoast_Plugins_Tab\Application\Yoast_Plugins_List_Handler::get_status_text
 */
final class Get_Status_Text_Test extends Abstract_Yoast_Plugins_List_Handler_Test {

	/**
	 * Tests that the Yoast label is returned for the yoast type.
	 *
	 * @return void
	 */
	public function test_get_status_text_for_yoast_type() {
		Monkey\Functions\expect( '_nx' )
			->once()
			->with( 'Yoast', 'Yoast', 3, 'plugin status', 'wordpress-seo' )
			->andReturn( 'Yoast' );

		$result = $this->instance->get_status_text( '', 3, 'yoast' );

		$this->assertSame( 'Yoast', $result );
	}

	/**
	 * Tests that the original text is returned for non-yoast types.
	 *
	 * @return void
	 */
	public function test_get_status_text_for_other_type() {
		$result = $this->instance->get_status_text( 'Active', 5, 'active' );

		$this->assertSame( 'Active', $result );
	}
}
