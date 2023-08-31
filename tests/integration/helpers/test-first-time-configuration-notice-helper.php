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
	 * Tests whether the configuration has been finished.
	 *
	 * @covers ::first_time_configuration_not_finished
	 * @covers ::user_can_do_first_time_configuration
	 * @return void
	 */
	public function test_first_time_configuration_not_finished() {
		$this->indexing_helper
			->expects( 'is_initial_indexing' )
			->withNoArgs()
			->andReturnTrue();
		$this->indexing_helper
			->expects( 'is_finished_indexables_indexing' )
			->withNoArgs()
			->andReturnTrue();

		$user = self::factory()->user->create_and_get( [ 'role' => 'administrator' ] );
		wp_set_current_user( $user->ID );
		$result = $this->instance->first_time_configuration_not_finished();
		$this->assertFalse( $result, 'Checking on administrator' );

		$this->options_helper->set( 'configuration_finished_steps', [ 1, 2, 3, 4 ] );
		$result = $this->instance->first_time_configuration_not_finished();
		$this->assertFalse( $result, 'Checking on finished steps' );

		$this->options_helper->set( 'first_time_install', false );
		$result = $this->instance->first_time_configuration_not_finished();
		$this->assertFalse( $result, 'Checking on finished steps' );
	}
}
