<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Social_Profiles_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Social_Profiles_Helper_Test
 *
 * @coversDefaultClass Yoast\WP\SEO\Integrations\Admin\Social_Profiles_Helper
 */
class Social_Profiles_Helper_Test extends TestCase {

	/**
	 * The Social_Profiles_Helper instance to be tested.
	 *
	 * @var Social_Profiles_Helper
	 */
	protected $instance;

	/**
	 * The option helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Set up the test fixtures.
	 */
	public function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Social_Profiles_Helper( $this->options_helper );
	}

	/**
	 * Checks storing the values for the person's social profiles.
	 *
	 * @covers ::set_person_social_profiles
	 * @covers ::get_non_valid_url
	 * @covers ::get_non_valid_twitter
	 *
	 * @dataProvider set_person_social_profiles
	 *
	 * @param array $social_profiles             The array of the person's social profiles to be set.
	 * @param int   $validate_social_url_results The results from validating social urls.
	 * @param int   $validate_social_url_times   The times we're gonna validate social urls.
	 * @param int   $validate_twitter_id_results The results from validating twitter ids.
	 * @param int   $validate_twitter_id_times   The times we're gonna validate twitter ids.
	 * @param int   $update_user_meta_times      The times we're gonna set the the social profiles.
	 * @param array $expected                    The expected field names which failed to be saved in the db.
	 */
	public function test_set_person_social_profiles( $social_profiles, $validate_social_url_results, $validate_social_url_times, $validate_twitter_id_results, $validate_twitter_id_times, $update_user_meta_times, $expected ) {
		$person_id = 123;
		$fields    = [
			'facebook',
			'instagram',
			'linkedin',
			'myspace',
			'pinterest',
			'soundcloud',
			'tumblr',
			'twitter',
			'youtube',
			'wikipedia',
		];

		$this->options_helper
			->expects( 'validate_social_url' )
			->times( $validate_social_url_times )
			->andReturn( ...$validate_social_url_results );

		$this->options_helper
			->expects( 'validate_twitter_id' )
			->times( $validate_twitter_id_times )
			->andReturn( ...$validate_twitter_id_results );

		foreach ( $fields as $field ) {
			Monkey\Functions\expect( 'update_user_meta' )
				->with( $person_id, $field, $social_profiles[ $field ] )
				->times( $update_user_meta_times );
		}

		$actual = $this->instance->set_person_social_profiles( $person_id, $social_profiles );
		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Dataprovider for test_set_person_social_profiles function.
	 *
	 * @return array Data for test_set_person_social_profiles function.
	 */
	public function set_person_social_profiles() {
		$success_all = [
			'social_profiles'             => [
				'facebook'   => 'https://facebook.com/janedoe',
				'instagram'  => 'https://instagram.com/janedoe',
				'linkedin'   => 'https://linkedin.com/janedoe',
				'myspace'    => 'https://myspace.com/janedoe',
				'pinterest'  => 'https://pinterest.com/janedoe',
				'soundcloud' => 'https://soundcloud.com/janedoe',
				'tumblr'     => 'https://tumblr.com/janedoe',
				'twitter'    => 'https://twitter.com/janedoe',
				'youtube'    => 'https://youtube.com/janedoe',
				'wikipedia'  => 'https://wikipedia.com/janedoe',
			],
			'validate_social_url_results' => [ true ],
			'validate_social_url_times'   => 9,
			'validate_twitter_id_results' => [ true ],
			'validate_twitter_id_times'   => 1,
			'update_user_meta_times'      => 1,
			'expected'                    => [],
		];

		$failure_some = [
			'social_profiles'             => [
				'facebook'   => 'https://facebook.com/janedoe',
				'instagram'  => 'https://instagram.com/janedoe',
				'linkedin'   => 'https://linkedin.com/janedoe',
				'myspace'    => 'https://myspace.com/janedoe',
				'pinterest'  => 'https://pinterest.com/janedoe',
				'soundcloud' => 'https://soundcloud.com/janedoe',
				'tumblr'     => 'https://tumblr.com/janedoe',
				'twitter'    => '@janedoe',
				'youtube'    => 'https://youtube.com/janedoe',
				'wikipedia'  => 'https://wikipedia.com/janedoe',
			],
			'validate_social_url_results' => [ true, true, true, true, true, true, true, true, true ],
			'validate_social_url_times'   => 9,
			'validate_twitter_id_results' => [ false ],
			'validate_twitter_id_times'   => 1,
			'update_user_meta_times'      => 0,
			'expected'                    => [ 'twitter' ],
		];

		$failure_twitter = [
			'social_profiles'             => [
				'facebook'   => 'https://facebook.com/janedoe',
				'instagram'  => 'test',
				'linkedin'   => 'https://linkedin.com/janedoe',
				'myspace'    => 'https://myspace.com/janedoe',
				'pinterest'  => 'https://pinterest.com/janedoe',
				'soundcloud' => 'https://soundcloud.com/janedoe',
				'tumblr'     => 'https://tumblr.com/janedoe',
				'twitter'    => 'https://twitter.com/janedoe',
				'youtube'    => 'https://youtube.com/janedoe',
				'wikipedia'  => 'https://wikipedia.com/janedoe',
			],
			'validate_social_url_results' => [ true, false, true, true, true, true, true, true, true ],
			'validate_social_url_times'   => 9,
			'validate_twitter_id_results' => [ true ],
			'validate_twitter_id_times'   => 1,
			'update_user_meta_times'      => 0,
			'expected'                    => [ 'instagram' ],
		];

		$failure_all = [
			'social_profiles'             => [
				'facebook'   => 'test',
				'instagram'  => 'test',
				'linkedin'   => 'test',
				'myspace'    => 'test',
				'pinterest'  => 'test',
				'soundcloud' => 'test',
				'tumblr'     => 'test',
				'twitter'    => 'test',
				'youtube'    => 'test',
				'wikipedia'  => 'test',
			],
			'validate_social_url_results' => [ false, false, false, false, false, false, false, false, false ],
			'validate_social_url_times'   => 9,
			'validate_twitter_id_results' => [ false ],
			'validate_twitter_id_times'   => 1,
			'update_user_meta_times'      => 0,
			'expected'                    => [ 'facebook', 'instagram', 'linkedin', 'myspace', 'pinterest', 'soundcloud', 'tumblr', 'twitter', 'youtube', 'wikipedia' ],
		];

		return [
			'Successful set with all valid values'      => $success_all,
			'Failed set with some non-valid values'     => $failure_some,
			'Failed set with a twitter non-valid value' => $failure_twitter,
			'Failed set with all non-valid value'       => $failure_all,
		];
	}

	/**
	 * Checks storing the values for the organization's social profiles.
	 *
	 * @covers ::set_organization_social_profiles
	 * @covers ::get_non_valid_url
	 * @covers ::get_non_valid_url_array
	 * @covers ::get_non_valid_twitter
	 *
	 * @dataProvider set_organization_social_profiles
	 *
	 * @param array $social_profiles             The array of the person's social profiles to be set.
	 * @param int   $validate_social_url_results The results from validating social urls.
	 * @param int   $validate_social_url_times   The times we're gonna validate social urls.
	 * @param int   $validate_twitter_id_results The results from validating twitter ids.
	 * @param int   $validate_twitter_id_times   The times we're gonna validate twitter ids.
	 * @param int   $set_option_times            The times we're gonna set the social profiles.
	 * @param array $expected                    The expected field names which failed to be saved in the db.
	 */
	public function test_set_organization_social_profiles( $social_profiles, $validate_social_url_results, $validate_social_url_times, $validate_twitter_id_results, $validate_twitter_id_times, $set_option_times, $expected ) {
		$person_id = 123;
		$fields    = [
			'facebook_site',
			'twitter_site',
			'other_social_urls',
		];

		$this->options_helper
			->expects( 'validate_social_url' )
			->times( $validate_social_url_times )
			->andReturn( ...$validate_social_url_results );

		$this->options_helper
			->expects( 'validate_twitter_id' )
			->times( $validate_twitter_id_times )
			->andReturn( ...$validate_twitter_id_results );

		foreach ( $fields as $field ) {
			$this->options_helper
				->expects( 'set' )
				->with( $field, $social_profiles[ $field ] )
				->times( $set_option_times )
				->andReturn( true );
		}

		$this->options_helper
			->expects( 'get' )
			->never();

		$actual = $this->instance->set_organization_social_profiles( $social_profiles );
		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Dataprovider for test_set_organization_social_profiles function.
	 *
	 * @return array Data for test_set_organization_social_profiles function.
	 */
	public function set_organization_social_profiles() {
		$success_all = [
			'social_profiles'             => [
				'facebook_site'          => 'https://facebook.com/janedoe',
				'twitter_site'           => 'https://twitter.com/janedoe',
				'other_social_urls'      => [
					'https://youtube.com/janedoe',
				],
			],
			'validate_social_url_results' => [ true ],
			'validate_social_url_times'   => 2,
			'validate_twitter_id_results' => [ true ],
			'validate_twitter_id_times'   => 1,
			'set_option_times'            => 1,
			'expected'                    => [],
		];

		$failure_fb = [
			'social_profiles'             => [
				'facebook_site'          => 'not valid',
				'twitter_site'           => 'https://twitter.com/janedoe',
				'other_social_urls'      => [
					'https://youtube.com/janedoe',
				],
			],
			'validate_social_url_results' => [ false, true ],
			'validate_social_url_times'   => 2,
			'validate_twitter_id_results' => [ true ],
			'validate_twitter_id_times'   => 1,
			'set_option_times'            => 0,
			'expected'                    => [ 'facebook_site' ],
		];

		$failure_twitter = [
			'social_profiles'             => [
				'facebook_site'          => 'https://facebook.com/janedoe',
				'twitter_site'           => 'not valid',
				'other_social_urls'      => [
					'https://youtube.com/janedoe',
					'https://instagram.com/janedoe',
				],
			],
			'validate_social_url_results' => [ true, true ],
			'validate_social_url_times'   => 3,
			'validate_twitter_id_results' => [ false ],
			'validate_twitter_id_times'   => 1,
			'set_option_times'            => 0,
			'expected'                    => [ 'twitter_site' ],
		];

		$failure_other_social = [
			'social_profiles'             => [
				'facebook_site'          => 'https://facebook.com/janedoe',
				'twitter_site'           => 'https://twitter.com/janedoe',
				'other_social_urls'      => [
					'not valid',
					'https://instagram.com/janedoe',
					'not valid again',
				],
			],
			'validate_social_url_results' => [ true, false, true, false ],
			'validate_social_url_times'   => 4,
			'validate_twitter_id_results' => [ true ],
			'validate_twitter_id_times'   => 1,
			'set_option_times'            => 0,
			'expected'                    => [ 'other_social_urls-0', 'other_social_urls-2' ],
		];

		return [
			'Successful set with all valid values'        => $success_all,
			'Failed set with not valid Facebook'          => $failure_fb,
			'Failed set with not valid Twitter'           => $failure_twitter,
			'Failed set with not valid other social urls' => $failure_other_social,
		];
	}
}
