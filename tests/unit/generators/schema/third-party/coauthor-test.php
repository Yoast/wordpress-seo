<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the tested class.
namespace Yoast\WP\SEO\Tests\Unit\Generators\Schema\Third_Party;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Generators\Schema\Third_Party\CoAuthor;
use Yoast\WP\SEO\Tests\Unit\Doubles\Generators\Schema\Third_Party\CoAuthor_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class CoAuthor_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Third_Party\CoAuthor
 */
class CoAuthor_Test extends TestCase {

	/**
	 * Holds the options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Holds the user helper.
	 *
	 * @var User_Helper
	 */
	private $user;

	/**
	 * Holds the coauthor schema generator under test.
	 *
	 * @var CoAuthor_Mock
	 */
	private $instance;

	/**
	 * Sets up the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options = Mockery::mock( Options_Helper::class );
		$this->user    = Mockery::mock( User_Helper::class );

		$this->instance = Mockery::mock( CoAuthor_Mock::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->instance->helpers = (object) [
			'options' => $this->options,
			'user'    => $this->user,
		];
	}

	/**
	 * Tests generating the Person data given a user ID.
	 *
	 * @param int    $user_id                The user ID.
	 * @param array  $person_data            The person data.
	 * @param bool   $disable_author         Whether the disable-author option is true.
	 * @param int    $disable_author_times   The times we'll check whether the disable-author option is true.
	 * @param string $author_posts_url       The archive url of the user.
	 * @param int    $author_posts_url_times The times we'll retrieve the archive url of the user.
	 * @param mixed  $expected_result        The expected result.
	 *
	 * @dataProvider provider_generate_from_user_id
	 * @covers ::generate_from_user_id
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_from_user_id( $user_id, $person_data, $disable_author, $disable_author_times, $author_posts_url, $author_posts_url_times, $expected_result ) {
		$this->instance->expects( 'build_person_data' )
			->times( $disable_author_times )
			->with( $user_id, true )
			->andReturn( $person_data );

		$this->options->expects( 'get' )
			->times( $disable_author_times )
			->with( 'disable-author' )
			->andReturn( $disable_author );

		$this->user->expects( 'get_the_author_posts_url' )
			->times( $author_posts_url_times )
			->with( $user_id )
			->andReturn( $author_posts_url );

		$actual_result = $this->instance->generate_from_user_id( $user_id );

		$this->assertSame( $expected_result, $actual_result );
	}

	/**
	 * Data provider for test_generate_from_user_id().
	 *
	 * @return array
	 */
	public function provider_generate_from_user_id() {
		$person_data = [
			'@id'    => 'http://basic.wordpress.test/#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21',
			'name'   => 'Ad Minnie',
		];

		$person_data_with_type          = $person_data;
		$person_data_with_type['@type'] = [ 'whatever' ];

		$person_data_with_logo         = $person_data;
		$person_data_with_logo['logo'] = [
			'@id' => 'http://basic.wordpress.test/#personlogo',
		];

		$expected_result = [
			'@id'   => 'http://basic.wordpress.test/#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21',
			'name'  => 'Ad Minnie',
			'@type' => 'Person',
		];

		$author_posts_url                    = 'http://basic.wordpress.test/archive';
		$expected_result_with_author_enabled = [
			'@id'   => 'http://basic.wordpress.test/#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21',
			'name'  => 'Ad Minnie',
			'@type' => 'Person',
			'url'   => $author_posts_url,
		];

		return [
			[ 0, 'irrelevant', 'irrelevant', 0, 'irrelevant', 0, false ],
			[ 123, $person_data, false, 1, $author_posts_url, 1, $expected_result_with_author_enabled ],
			[ 123, $person_data, true, 1, 'irrelevant', 0, $expected_result ],
			[ 123, $person_data_with_type, true, 1, 'irrelevant', 0, $expected_result ],
			[ 123, $person_data_with_logo, true, 1, 'irrelevant', 0, $expected_result ],
		];
	}
}
