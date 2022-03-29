<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Configuration;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Configuration\Configuration_Workout_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Social_profiles_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Configuration_Workout_Action_Test
 *
 * @group actions
 * @group workout
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Configuration\Configuration_Workout_Action
 */
class Configuration_Workout_Action_Test extends TestCase {

	/**
	 * The class instance.
	 *
	 * @var Configuration_Workout_Action
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
	 * @var Mockery\MockInterface|Social_profiles_Helper
	 */
	protected $social_profiles_helper;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper         = Mockery::mock( Options_Helper::class );
		$this->social_profiles_helper = Mockery::mock( Social_profiles_Helper::class );

		$this->instance = new Configuration_Workout_Action( $this->options_helper, $this->social_profiles_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			Social_profiles_Helper::class,
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
	 */
	public function test_set_site_representation( $params, $times, $yoast_options_results, $wp_option_result, $expected ) {
		$this->options_helper
			->expects( 'set' )
			->times( $times )
			->andReturn( ...$yoast_options_results );

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
	public function site_representation_provider() {
		$success_company = [
			'params'                => [
				'company_or_person' => 'company',
				'company_name'      => 'Acme Inc.',
				'company_logo'      => 'https://acme.com/someimage.jpg',
				'company_logo_id'   => 123,
				'description'       => 'A nice tagline',
			],
			'times'                 => 4,
			'yoast_options_results' => [ true, true, true, true ],
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
				'description'               => 'A nice tagline',
			],
			'times'                 => 4,
			'yoast_options_results' => [ true, true, true, true ],
			'wp_option_result'      => true,
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$success_person_failure_tagline = [
			'params'                => [
				'company_or_person'         => 'person',
				'person_logo'               => 'https://acme.com/someimage.jpg',
				'person_logo_id'            => 123,
				'company_or_person_user_id' => 321,
				'description'               => 'A tagline that will fail for some reason',
			],
			'times'                 => 4,
			'yoast_options_results' => [ true, true, true, true ],
			'wp_option_result'      => false,
			'expected'              => (object) [
				'success'  => false,
				'status'   => 500,
				'error'    => 'Could not save some options in the database',
				'failures' => [ 'description' ],
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
			'times'                 => 4,
			'yoast_options_results' => [ true, false, false, true ],
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
			'Person params with failing description' => $success_person_failure_tagline,
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
	 * @param array  $params                The parameters.
	 * @param int    $times                 The number of times the Options_Helper::set is expected to be called.
	 * @param bool[] $yoast_options_results The array of expected results.
	 * @param object $expected              The expected result object.
	 */
	public function test_set_social_profiles( $params, $times, $yoast_options_results, $expected ) {
		$this->options_helper
			->expects( 'set' )
			->times( $times )
			->andReturn( ...$yoast_options_results );

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
	public function social_profiles_provider() {
		$success_all = [
			'params'                => [
				'facebook_site'     => 'https://facebook.com/somepage',
				'twitter_site'      => 'somenick',
				'other_social_urls' => [
					'https://instagram.com/somepage',
					'https://linked.in/somepage',
					'https://myspace.com/somepage',
					'https://pinterest.com/somepage',
					'https://youtube.com/somepage',
					'https://en.wikipedia.org/somepage',
				],
			],
			'times'                 => 3,
			'yoast_options_results' => [ true ],
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$success_some = [
			'params'                => [
				'facebook_site' => 'https://facebook.com/somepage',
				'twitter_site'  => 'somenick',
			],
			'times'                 => 2,
			'yoast_options_results' => [ true ],
			'expected'              => (object) [
				'success' => true,
				'status'  => 200,
			],
		];

		$some_failures = [
			'params'                => [
				'facebook_site'     => 'https://facebook.com/somepage',
				'twitter_site'      => 'somenick',
				'other_social_urls' => 'https://instagram.com/somepage',
			],
			'times'                 => 3,
			'yoast_options_results' => [ true, true, false ],
			'expected'              => (object) [
				'success'  => false,
				'status'   => 500,
				'error'    => 'Could not save some options in the database',
				'failures' => [ 'other_social_urls' ],
			],
		];

		return [
			'Successful call with all params'  => $success_all,
			'Successful call with some params' => $success_some,
			'Some failures'                    => $some_failures,
		];
	}

	/**
	 * Tests setting the social profiles options in the database when Twitter value is a URL.
	 *
	 * @covers ::set_social_profiles
	 */
	public function test_set_social_profiles_twitter_url() {
		$params = [
			'facebook_site'     => 'https://facebook.com/somepage',
			'twitter_site'      => 'https://twitter.com/somenick',
			'other_social_urls' => 'https://instagram.com/somepage',
		];

		$yoast_options_results = [ true, false, false ];

		$this->options_helper
			->expects( 'set' )
			->times( 3 )
			->andReturn( ...$yoast_options_results );

		$this->options_helper
			->expects( 'get' )
			->with( 'twitter_site' )
			->andReturn( 'somenick' );

		$this->assertEquals(
			(object) [
				'success'  => false,
				'status'   => 500,
				'error'    => 'Could not save some options in the database',
				'failures' => [ 'other_social_urls' ],
			],
			$this->instance->set_social_profiles( $params )
		);
	}

	/**
	 * Tests setting the social profiles options in the database when Twitter value is a URL and saving fails.
	 *
	 * @covers ::set_social_profiles
	 */
	public function test_set_social_profiles_twitter_url_failure() {
		$params = [
			'facebook_site'     => 'https://facebook.com/somepage',
			'twitter_site'      => 'https://twitter.com/somenick',
			'other_social_urls' => 'https://instagram.com/somepage',
		];

		$yoast_options_results = [ true, false, false ];

		$this->options_helper
			->expects( 'set' )
			->times( 3 )
			->andReturn( ...$yoast_options_results );

		$this->options_helper
			->expects( 'get' )
			->with( 'twitter_site' )
			->andReturn( 'someothernick' );

		$this->assertEquals(
			(object) [
				'success'  => false,
				'status'   => 500,
				'error'    => 'Could not save some options in the database',
				'failures' => [ 'twitter_site', 'other_social_urls' ],
			],
			$this->instance->set_social_profiles( $params )
		);
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
	public function enable_tracking_provider() {
		$false_to_true = [
			'params'                => [
				'tracking' => true,
			],
			'old_value'             => false,
			'times'                 => 1,
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
			'times'                 => 1,
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
			'times'                 => 1,
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
}
