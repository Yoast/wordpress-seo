<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Content_Type_Visibility
 */

use Yoast\WP\SEO\Helpers\First_Time_Configuration_Notice_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class First_Time_Configuration_Notice_Helper_Test.
 * Integration Test Class for the First_Time_Configuration_Notice_Helper class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Helpers\First_Time_Configuration_Notice_Helper
 */
class First_Time_Configuration_Notice_Helper_Test extends WPSEO_UnitTestCase {

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	private $indexing_helper;

	/**
	 * Whether we show the alternate message.
	 *
	 * @var bool
	 */
	private $show_alternate_message;

	/**
	 * The instance.
	 *
	 * @var First_Time_Configuration_Notice_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->options_helper         = new Options_Helper();
		$this->indexing_helper        = Mockery::mock( Indexing_Helper::class );
		$this->show_alternate_message = false;

		$this->instance = new First_Time_Configuration_Notice_Helper( $this->options_helper, $this->indexing_helper, $this->show_alternate_message );
	}

	/**
	 * Tests the display notice.
	 *
	 * @covers ::should_display_first_time_configuration_notice
	 * @covers ::on_wpseo_admin_page_or_dashboard
	 * @return void
	 */
	public function test_should_display_first_time_configuration_notice() {
		$result = $this->instance->should_display_first_time_configuration_notice();
		$this->assertFalse( $result, 'Checking the default variable' );

		global $pagenow;
		$pagenow = 'edit.php';
		$result  = $this->instance->should_display_first_time_configuration_notice();
		$this->assertFalse( $result, 'Checking on edit.php' );

		$this->options_helper->set( 'dismiss_configuration_workout_notice', true );
		$result = $this->instance->should_display_first_time_configuration_notice();
		$this->assertFalse( $result, 'Checking with dismiss_configuration_workout_notice option set to false' );
	}

	/**
	 * Data provider for test_first_time_configuration_not_finished
	 *
	 * @return array
	 */
	public static function data_provider_first_time_configuration_not_finished() {
		return [
			'Check user has no permission' => [
				'user'                            => 'author',
				'steps_complete'                  => [],
				'first_time_install'              => false,
				'is_initial_indexing'             => true,
				'is_finished_indexables_indexing' => false,
				'expected'                        => false,
			],
			'Check user has permission and first time configuration not finished' => [
				'user'                            => 'administrator',
				'steps_complete'                  => [ 1, 2, 3 ],
				'first_time_install'              => false,
				'is_initial_indexing'             => true,
				'is_finished_indexables_indexing' => false,
				'expected'                        => false,
			],
			'Check user has permission and first time configuration not finished and is first time install' => [
				'user'                            => 'administrator',
				'steps_complete'                  => [],
				'first_time_install'              => true,
				'is_initial_indexing'             => true,
				'is_finished_indexables_indexing' => false,
				'expected'                        => true,
			],
			'Check user has permission and first time configuration not finished and not first time install and is initial indexing' => [
				'user'                            => 'administrator',
				'steps_complete'                  => [],
				'first_time_install'              => false,
				'is_initial_indexing'             => false,
				'is_finished_indexables_indexing' => false,
				'expected'                        => false,
			],
			'Check user has permission and first time configuration not finished and not first time install and is not initial indexing and finished indexables indexing' => [
				'user'                            => 'administrator',
				'steps_complete'                  => [],
				'first_time_install'              => false,
				'is_initial_indexing'             => true,
				'is_finished_indexables_indexing' => true,
				'expected'                        => false,
			],
			'Check are_site_representation_name_and_logo_set' => [
				'user'                            => 'administrator',
				'steps_complete'                  => [],
				'first_time_install'              => false,
				'is_initial_indexing'             => true,
				'is_finished_indexables_indexing' => false,
				'expected'                        => true,
			],
		];
	}

	/**
	 * Tests whether the configuration has been finished.
	 *
	 * @covers ::first_time_configuration_not_finished
	 * @covers ::user_can_do_first_time_configuration
	 * @covers ::are_site_representation_name_and_logo_set
	 * @covers ::is_first_time_configuration_finished
	 *
	 * @dataProvider data_provider_first_time_configuration_not_finished
	 *
	 * @param string $user The user capabilities.
	 * @param array  $steps_complete The array of steps.
	 * @param bool   $first_time_install Whether it is first installation.
	 * @param bool   $is_initial_indexing Whether is initial indexing.
	 * @param bool   $is_finished_indexables_indexing Whether finidhed indexing.
	 * @param bool   $expected The expected result.
	 *
	 * @return void
	 */
	public function test_first_time_configuration_not_finished( $user, $steps_complete, $first_time_install, $is_initial_indexing, $is_finished_indexables_indexing, $expected ) {

		$this->indexing_helper
			->expects( 'is_finished_indexables_indexing' )
			->withNoArgs()
			->andReturn( $is_finished_indexables_indexing );

		$this->indexing_helper
			->expects( 'is_initial_indexing' )
			->withNoArgs()
			->andReturn( $is_initial_indexing );

		$user = self::factory()->user->create_and_get( [ 'role' => $user ] );
		wp_set_current_user( $user->ID );

		$this->options_helper->set( 'first_time_install', $first_time_install );
		$this->options_helper->set( 'company_or_person', '' );
		$this->options_helper->set( 'configuration_finished_steps', $steps_complete );

		$result = $this->instance->first_time_configuration_not_finished();
		$this->assertSame( $expected, $result );
	}
}
