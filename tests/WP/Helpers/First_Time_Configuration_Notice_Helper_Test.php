<?php

namespace Yoast\WP\SEO\Tests\WP\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\First_Time_Configuration_Notice_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for the First_Time_Configuration_Notice_Helper class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Helpers\First_Time_Configuration_Notice_Helper
 */
final class First_Time_Configuration_Notice_Helper_Test extends TestCase {

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
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();
		$this->options_helper         = new Options_Helper();
		$this->indexing_helper        = Mockery::mock( Indexing_Helper::class );
		$this->show_alternate_message = false;

		$this->instance = new First_Time_Configuration_Notice_Helper( $this->options_helper, $this->indexing_helper );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			Indexing_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexing_helper' )
		);
		$this->assertIsBool(
			$this->getPropertyValue( $this->instance, 'show_alternate_message' )
		);
	}

	/**
	 * Tests whether the display notice should be displayed.
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
		$this->assertFalse( $result, 'Checking with dismiss_configuration_workout_notice option set to true' );
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
				'title'                           => 'First-time SEO configuration',
			],
			'Check user has permission and first time configuration not finished' => [
				'user'                            => 'administrator',
				'steps_complete'                  => [ 1, 2, 3 ],
				'first_time_install'              => false,
				'is_initial_indexing'             => true,
				'is_finished_indexables_indexing' => false,
				'expected'                        => false,
				'title'                           => 'First-time SEO configuration',
			],
			'Check user has permission and first time configuration not finished and is first time install' => [
				'user'                            => 'administrator',
				'steps_complete'                  => [],
				'first_time_install'              => true,
				'is_initial_indexing'             => true,
				'is_finished_indexables_indexing' => false,
				'expected'                        => true,
				'title'                           => 'First-time SEO configuration',
			],
			'Check user has permission and first time configuration not finished and not first time install and is initial indexing' => [
				'user'                            => 'administrator',
				'steps_complete'                  => [],
				'first_time_install'              => false,
				'is_initial_indexing'             => false,
				'is_finished_indexables_indexing' => false,
				'expected'                        => false,
				'title'                           => 'First-time SEO configuration',
			],
			'Check user has permission and first time configuration not finished and not first time install and is not initial indexing and finished indexables indexing' => [
				'user'                            => 'administrator',
				'steps_complete'                  => [],
				'first_time_install'              => false,
				'is_initial_indexing'             => true,
				'is_finished_indexables_indexing' => true,
				'expected'                        => false,
				'title'                           => 'First-time SEO configuration',
			],
			'Check are_site_representation_name_and_logo_set' => [
				'user'                            => 'administrator',
				'steps_complete'                  => [],
				'first_time_install'              => false,
				'is_initial_indexing'             => true,
				'is_finished_indexables_indexing' => false,
				'expected'                        => true,
				'title'                           => 'SEO configuration',
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
	 * @covers ::get_first_time_configuration_title
	 *
	 * @dataProvider data_provider_first_time_configuration_not_finished
	 *
	 * @param string $user_role                       The user role.
	 * @param array  $steps_complete                  The array of first time configuration steps.
	 * @param bool   $first_time_install              Whether this is a first installation.
	 * @param bool   $is_initial_indexing             Whether the indexing is initial.
	 * @param bool   $is_finished_indexables_indexing Whether indexing has been finished.
	 * @param bool   $expected                        The expected result.
	 * @param string $title                           First time configuration title.
	 *
	 * @return void
	 */
	public function test_first_time_configuration_not_finished( $user_role, $steps_complete, $first_time_install, $is_initial_indexing, $is_finished_indexables_indexing, $expected, $title ) {

		$this->indexing_helper
			->expects( 'is_finished_indexables_indexing' )
			->withNoArgs()
			->andReturn( $is_finished_indexables_indexing );

		$this->indexing_helper
			->expects( 'is_initial_indexing' )
			->withNoArgs()
			->andReturn( $is_initial_indexing );

		$user = self::factory()->user->create_and_get( [ 'role' => $user_role ] );
		\wp_set_current_user( $user->ID );

		$this->options_helper->set( 'first_time_install', $first_time_install );

		$this->options_helper->set( 'configuration_finished_steps', $steps_complete );

		$result = $this->instance->first_time_configuration_not_finished();
		$this->assertSame( $expected, $result, 'Check if first time configuration was not completed.' );

		$first_time_configuration_title = $this->instance->get_first_time_configuration_title();
		$this->assertEquals( $title, $first_time_configuration_title, 'First time configuration title check.' );
	}

	/**
	 * Tests should_show_alternate_message.
	 *
	 * @covers ::should_show_alternate_message
	 *
	 * @return void
	 */
	public function test_should_show_alternate_message() {
		$result = $this->instance->should_show_alternate_message();
		$this->assertFalse( $result );
	}
}
