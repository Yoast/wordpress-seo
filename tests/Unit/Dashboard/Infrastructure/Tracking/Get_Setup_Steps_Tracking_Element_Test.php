<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Tracking;

/**
 * Test class for the get_Setup_Steps_Tracking method.
 *
 * @group Setup_Steps_Tracking_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Tracking\Setup_Steps_Tracking_Repository::get_Setup_Steps_Tracking_element
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Setup_Steps_Tracking_Test extends Abstract_Setup_Steps_Tracking_Repository_Test {

	/**
	 * Tests if the Site Kit configuration dismissal status can be set.
	 *
	 * @dataProvider get_Setup_Steps_Tracking_provider
	 *
	 * @param string $element_name  The name of the option to get.
	 * @param string $element_value The value of the option to get.
	 *
	 * @return void
	 */
	public function test_set_Setup_Steps_Tracking_Element( string $element_name, string $element_value ): void {
		$usage_tracking = [
			'setup_widget_loaded'     => 'yes',
			'first_interaction_stage' => 'SET UP',
			'last_interaction_stage'  => 'CONNECT',
			'setup_widget_dismissed'  => 'permanently',
		];
		$this->options_helper->shouldReceive( 'get' )
			->with( 'Setup_Steps_Tracking', [] )
			->andReturn( $usage_tracking );

		$this->assertEquals( $this->instance->get_setup_steps_tracking_element( $element_name ), $element_value );
	}

	/**
	 * Data provider for the test_set_Setup_Steps_Tracking method.
	 *
	 * @return array<array<string>> The data to test.
	 */
	public static function get_setup_steps_tracking_element_provider(): array {
		return [
			[
				'element_name'  => 'setup_widget_loaded',
				'element_value' => 'yes',
			],
			[
				'element_name'  => 'first_interaction_stage',
				'element_value' => 'SET UP',
			],
			[
				'element_name'  => 'last_interaction_stage',
				'element_value' => 'CONNECT',
			],
			[
				'element_name'  => 'setup_widget_dismissed',
				'element_value' => 'permanently',
			],
		];
	}
}
