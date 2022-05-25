<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\First_Time_Configuration_Notice_Integration;
use Yoast\WP\SEO\Presenters\Admin\Notice_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- First time configuration simply has a lot of words.
/**
 * First_Time_Configuration_Notice_Integration_Test
 *
 * @coversDefaultClass Yoast\WP\SEO\Integrations\Admin\First_Time_Configuration_Notice_Integration
 */
class First_Time_Configuration_Notice_Integration_Test extends TestCase {

	/**
	 * The First_Time_Configuration_Notice_Integration instance to be tested.
	 *
	 * @var First_Time_Configuration_Notice_Integration
	 */
	protected $instance;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The Indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * The WPSEO_Admin_Asset_Manager class.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $admin_asset_manager;

	/**
	 * Set up the tests.
	 */
	public function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->indexing_helper     = Mockery::mock( Indexing_Helper::class );
		$this->admin_asset_manager = Mockery::mock( WPSEO_Admin_Asset_Manager::class );

		$this->instance = new First_Time_Configuration_Notice_Integration(
			$this->options_helper,
			$this->indexing_helper,
			$this->admin_asset_manager
		);
	}

	/**
	 * Checks if the integration has the Admin_Conditional.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_returns_admin_conditional() {
		$actual   = $this->instance->get_conditionals();
		$expected = [ Admin_Conditional::class ];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Checks if the register_hooks function hooks into WordPress correctly.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_calls_wp_apply_filters() {
		Monkey\Functions\expect( 'add_action' )
			->once()
			->with( 'admin_notices', [ $this->instance, 'first_time_configuration_notice' ] );

		Monkey\Functions\expect( 'add_action' )
			->once()
			->with( 'wp_ajax_dismiss_first_time_configuration_notice', [ $this->instance, 'dismiss_first_time_configuration_notice' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Checks dismissing the First-time configuration notice.
	 *
	 * @covers ::dismiss_first_time_configuration_notice
	 */
	public function test_dismiss_first_time_configuration_notice() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'dismiss_configuration_workout_notice', true );

		$this->instance->dismiss_first_time_configuration_notice();
	}

	/**
	 * Checks displaying the FTC notice.
	 *
	 * @covers ::should_display_first_time_configuration_notice
	 * @dataProvider first_time_configuration_notice_provider
	 */
	public function test_first_time_configuration_notice() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'dismiss_configuration_workout_notice', false )
			->andReturn( $dismissed );

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( $can_manage_options );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'configuration_finished_steps', [] )
			->andReturn( $finished_steps );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'first_time_install', false )
			->andReturn( $first_time_install );

		$this->indexing_helper
			->expects( 'is_initial_indexing' )
			->once()
			->with()
			->andReturn( $is_initial_indexing );

		$this->indexing_helper
			->expects( 'is_finished_indexables_indexing' )
			->once()
			->with()
			->andReturn( $is_finished_indexables_indexing );

		// Mocks are_site_representation_name_and_logo_set(). 
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'company_or_person', '' )
			->andReturn( $company_or_person );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'company_name' )
			->andReturn( $company_name );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'company_logo', '' )
			->andReturn( $company_logo );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'company_or_person_user_id' )
			->andReturn( $company_or_person_user_id );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'person_logo', '' )
			->andReturn( $person_logo );

		$GLOBALS['pagenow'] = 'index.php';

		$this->admin_asset_manager
			->expects( 'enqueue_style' )
			->once()
			->with( 'monorepo' );

		$this->instance->dismiss_first_time_configuration_notice();

		unset( $GLOBALS['pagenow'] );
	}
}
