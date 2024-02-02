<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Configuration;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Configuration\First_Time_Configuration_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Social_Profiles_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class First_Time_Configuration_Action_Test
 *
 * @group actions
 * @group configuration
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Configuration\First_Time_Configuration_Action
 */
final class First_Time_Configuration_Action_Test extends TestCase {

	/**
	 * The class instance.
	 *
	 * @var First_Time_Configuration_Action
	 */
	protected $instance;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The social profiles helper.
	 *
	 * @var Mockery\MockInterface|Social_Profiles_Helper
	 */
	protected $social_profiles_helper;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper         = Mockery::mock( Options_Helper::class );
		$this->social_profiles_helper = Mockery::mock( Social_Profiles_Helper::class );

		$this->instance = new First_Time_Configuration_Action( $this->options_helper, $this->social_profiles_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			Social_Profiles_Helper::class,
			$this->getPropertyValue( $this->instance, 'social_profiles_helper' )
		);
	}

	/**
	 * Tests setting the site representation options in the database.
	 *
	 * @covers ::set_site_representation
	 *
	 * @dataProvider site_representation_provider
	 *
	 * @param array  $params                The parameters.
	 * @param int    $times                 The number of times the Options_Helper::set is expected to be called.
	 * @param bool[] $yoast_options_results The array of expected results.
	 * @param bool   $wp_option_result      The result of the update_option call.
	 * @param object $expected              The expected result object.
	 *
	 * @return void
	 */
	public function test_set_site_representation( $params, $times, $yoast_options_results, $wp_option_result, $expected ) {
		$this->options_helper
			->expects( 'set' )
			->times( $times )
			->andReturn( ...$yoast_options_results );

			$this->options_helper
				->expects( 'get' )
				->times( \count( $this->instance::SITE_REPRESENTATION_FIELDS ) );

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'manage_options' )
			->andReturnTrue();

		Monkey\Functions\expect( 'update_option' )
			->with( 'blogdescription' )
			->andReturn( $wp_option_result );

		$this->assertEquals(
			$expected,
			$this->instance->set_site_representation( $params )
		);
	}

	/**
	 * Dataprovider for test_set_site_representation function.
	 *
	 * @return array Data for test_set_site_representation function.
	 */
	public static function site_representation_provider() {
		$success_company = [
			'params'                => [
				'company_or_person' => 'company',
				'company_name'      => 'Acme Inc.',
				'company_logo'      => 'https://acme.com/someimage.jpg',
				'company_logo_id'   => 123,
			],
			'times'                 => 6,
			'yoast_options_results' => [ true, true, true, true, true, true ],
			'wp_option_result'      => true,
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$success_person = [
			'params'                => [
				'company_or_person'         => 'person',
				'person_logo'               => 'https://acme.com/someimage.jpg',
				'person_logo_id'            => 123,
				'company_or_person_user_id' => 321,
			],
			'times'                 => 6,
			'yoast_options_results' => [ true, true, true, true, true, true ],
			'wp_option_result'      => true,
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$some_failures_company = [
			'params'                => [
				'company_or_person' => 'company',
				'company_name'      => 'Acme Inc.',
				'company_logo'      => 'https://acme.com/someimage.jpg',
				'company_logo_id'   => 123,
				'description'       => 'A nice tagline',
			],
			'times'                 => 7,
			'yoast_options_results' => [ true, false, false, true, true, true ],
			'wp_option_result'      => true,
			'expected'              => (object) [
				'success'  => false,
				'status'   => 500,
				'error'    => 'Could not save some options in the database',
				'failures' => [ 'company_name', 'company_logo' ],
			],
		];

		return [
			'Successful call with company params'    => $success_company,
			'Successful call with person params'     => $success_person,
			'Company params with some failures'      => $some_failures_company,
		];
	}

	/**
	 * Tests setting the social profiles options in the database.
	 *
	 * @covers ::set_social_profiles
	 *
	 * @dataProvider social_profiles_provider
	 *
	 * @param array  $set_profiles_results The expected results for set_organization_social_profiles().
	 * @param array  $get_profiles_results The expected results for get_organization_social_profile_fields().
	 * @param object $expected             The expected result object.
	 *
	 * @return void
	 */
	public function test_set_social_profiles( $set_profiles_results, $get_profiles_results, $expected ) {
		$params = [
			'param1',
			'param2',
		];

		$this->social_profiles_helper
			->expects( 'set_organization_social_profiles' )
			->with( $params )
			->once()
			->andReturn( $set_profiles_results );

		$this->social_profiles_helper
			->expects( 'get_organization_social_profile_fields' )
			->once()
			->andReturn( $get_profiles_results );

		$this->options_helper
			->expects( 'get' )
			->times( \count( $get_profiles_results ) );

		$this->assertEquals(
			$expected,
			$this->instance->set_social_profiles( $params )
		);
	}

	/**
	 * Dataprovider for test_set_social_profiles function.
	 *
	 * @return array Data for test_set_social_profiles function.
	 */
	public static function social_profiles_provider() {
		$success_all = [
			'set_profiles_results' => [],
			'get_profiles_results' => [
				'facebook_site'     => 'get_non_valid_url',
				'twitter_site'      => 'get_non_valid_twitter',
				'other_social_urls' => 'get_non_valid_url_array',
			],
			'expected'             => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$success_some = [
			'set_profiles_results' => [ 'param1' ],
			'get_profiles_results' => [
				'facebook_site'     => 'get_non_valid_url',
				'twitter_site'      => 'get_non_valid_twitter',
				'other_social_urls' => 'get_non_valid_url_array',
			],
			'expected'             => (object) [
				'success'  => false,
				'status'   => 200,
				'error'    => 'Could not save some options in the database',
				'failures' => [ 'param1' ],
			],
		];

		$success_none = [
			'yoast_options_results' => [ 'param1', 'param2' ],
			'get_profiles_results'  => [
				'facebook_site'     => 'get_non_valid_url',
				'twitter_site'      => 'get_non_valid_twitter',
				'other_social_urls' => 'get_non_valid_url_array',
			],
			'expected'              => (object) [
				'success'  => false,
				'status'   => 200,
				'error'    => 'Could not save some options in the database',
				'failures' => [ 'param1', 'param2' ],
			],
		];

		return [
			'Successful call with all params' => $success_all,
			'Failed call with some params'    => $success_some,
			'Failed call with all params'     => $success_none,
		];
	}

	/**
	 * Tests setting the 'enable tracking' options in the database.
	 *
	 * @covers ::set_enable_tracking
	 *
	 * @dataProvider enable_tracking_provider
	 *
	 * @param array  $params        The parameters.
	 * @param bool   $old_value     The existing value for the option.
	 * @param int    $times         The number of times the Options_Helper::set is expected to be called.
	 * @param bool   $option_result The success state of the option setting operation.
	 * @param object $expected      The expected result object.
	 *
	 * @return void
	 */
	public function test_set_enable_tracking( $params, $old_value, $times, $option_result, $expected ) {
		$this->options_helper
			->expects( 'get' )
			->andReturn( $old_value );

		$this->options_helper
			->expects( 'set' )
			->times( $times )
			->andReturn( $option_result );

		$this->assertEquals(
			$expected,
			$this->instance->set_enable_tracking( $params )
		);
	}

	/**
	 * Dataprovider for test_set_enable_tracking function.
	 *
	 * @return array Data for test_set_enable_tracking function.
	 */
	public static function enable_tracking_provider() {
		$false_to_true = [
			'params'                => [
				'tracking' => true,
			],
			'old_value'             => false,
			'times'                 => 2,
			'option_result'         => true,
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$true_to_false = [
			'params'                => [
				'tracking' => true,
			],
			'old_value'             => false,
			'times'                 => 2,
			'option_result'         => true,
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$false_on_false = [
			'params'                => [
				'tracking' => false,
			],
			'old_value'             => false,
			'times'                 => 0,
			'option_result'         => true,
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$true_on_true = [
			'params'                => [
				'tracking' => true,
			],
			'old_value'             => true,
			'times'                 => 0,
			'option_result'         => true,
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$failure = [
			'params'                => [
				'tracking' => true,
			],
			'old_value'             => false,
			'times'                 => 2,
			'option_result'         => false,
			'expected'              => (object) [
				'success' => false,
				'status'  => 500,
				'error'   => 'Could not save the option in the database',
			],
		];

		return [
			'False to true'  => $false_to_true,
			'True to false'  => $true_to_false,
			'False on false' => $false_on_false,
			'True on true'   => $true_on_true,
			'Failure'        => $failure,
		];
	}

	/**
	 * Tests the check_capability method.
	 *
	 * @covers ::check_capability
	 * @covers ::can_edit_profile
	 *
	 * @dataProvider check_capability_provider
	 *
	 * @param int    $user_id  The id of the user.
	 * @param bool   $can_edit The result of the current_user_can call.
	 * @param object $expected The expected result object.
	 *
	 * @return void
	 */
	public function test_check_capability( $user_id, $can_edit, $expected ) {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_user', $user_id )
			->andReturn( $can_edit );

		$this->assertEquals(
			$expected,
			$this->instance->check_capability( $user_id )
		);
	}

	/**
	 * Dataprovider for test_check_capability function.
	 *
	 * @return array Data for test_check_capability function.
	 */
	public static function check_capability_provider() {
		$success = [
			'user_id'  => 123,
			'can_edit' => true,
			'expected' => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$failed = [
			'user_id'  => 123,
			'can_edit' => false,
			'expected' => (object) [
				'success' => false,
				'status'  => 403,
			],
		];

		return [
			'Capabilites are right'  => $success,
			'Capabilities are wrong' => $failed,
		];
	}

	/**
	 * Tests saving the configuration state in the database.
	 *
	 * @covers ::save_configuration_state
	 *
	 * @dataProvider configuration_provider
	 *
	 * @param array  $params                The parameters.
	 * @param int    $times                 The number of times the Options_Helper::set is expected to be called.
	 * @param bool[] $yoast_options_results The array of expected results.
	 * @param object $expected              The expected result object.
	 *
	 * @return void
	 */
	public function test_save_configuration_state( $params, $times, $yoast_options_results, $expected ) {
		$this->options_helper
			->expects( 'set' )
			->times( $times )
			->andReturn( ...$yoast_options_results );

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_others_posts' )
			->andReturnTrue();

		$this->assertEquals(
			$expected,
			$this->instance->save_configuration_state( $params )
		);
	}

	/**
	 * Dataprovider for save_configuration_state function.
	 *
	 * @return array Data for save_configuration_state function.
	 */
	public static function configuration_provider() {
		$success_save = [
			'params'                => [
				'finishedSteps'     => [ 'step1 ' ],
			],
			'times'                 => 1,
			'yoast_options_results' => [ true ],
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$failed_save_without_params = [
			'params'                => [
				'anotherParam'     => [],
			],
			'times'                 => 0,
			'yoast_options_results' => [ true ],
			'expected'              => (object) [
				'success' => false,
				'status'  => 400,
				'error'   => 'Bad request',
			],
		];

		$failed_save_option = [
			'params'                => [
				'finishedSteps'     => [ 'step1' ],
			],
			'times'                 => 1,
			'yoast_options_results' => [ false ],
			'expected'              => (object) [
				'success' => false,
				'status'  => 500,
				'error'   => 'Could not save the option in the database',
			],
		];

		$finish_configuration = [
			'params'                => [
				'finishedSteps'     => [ 'step1', 'step2', 'step3' ],
			],
			'times'                 => 2,
			'yoast_options_results' => [ true ],
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		return [
			'Successful saved configuration state'          => $success_save,
			'Failed saved configuration state with parameters not set' => $failed_save_without_params,
			'Failed saved configuration state option in db' => $failed_save_option,
			'Checked finished configuration'                => $finish_configuration,
		];
	}

	/**
	 * Tests saving the configuration state in the database.
	 *
	 * @covers ::get_configuration_state
	 *
	 * @return void
	 */
	public function test_get_configuration_state() {

		$expected_options_helper_return = [
			'finishedSteps'     => [ 'step1', 'step2' ],
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'configuration_finished_steps' )
			->once()
			->andReturn( $expected_options_helper_return );

		$this->assertEquals(
			(object) [
				'success' => true,
				'status'  => 200,
				'data'    => [
					'finishedSteps'     => [ 'step1', 'step2' ],
				],
			],
			$this->instance->get_configuration_state()
		);
	}

	/**
	 * Tests failure path for saving the configuration state in the database.
	 *
	 * @covers ::get_configuration_state
	 *
	 * @return void
	 */
	public function test_get_configuration_state_failure() {
		$this->options_helper
			->expects( 'get' )
			->with( 'configuration_finished_steps' )
			->once()
			->andReturn( null );

		$this->assertEquals(
			(object) [
				'success' => false,
				'status'  => 500,
				'error'   => 'Could not get data from the database',
			],
			$this->instance->get_configuration_state()
		);
	}
}
