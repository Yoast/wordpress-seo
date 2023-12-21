<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Short_Link_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Short_Link_Helper
 */
final class Short_Link_Helper_Test extends TestCase {

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product_helper;

	/**
	 * Represents the Short_Link_Helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->product_helper = Mockery::mock( Product_Helper::class );

		$this->instance = new Short_Link_Helper(
			$this->options_helper,
			$this->product_helper
		);
	}

	/**
	 * Tests building a shortlink.
	 *
	 * @covers ::build
	 * @covers ::get_php_version
	 * @covers ::get_software
	 * @covers ::get
	 * @covers ::show
	 *
	 * @dataProvider build_dataprovider
	 *
	 * @param bool   $is_premium         Whether the plugin is premium or not.
	 * @param string $first_activated_on The date (in days) the plugin was first activated.
	 * @param string $locale             The locale of the user.
	 * @param string $link               The link to build upon.
	 * @param array  $args_list          The list of arguments to add to the link.
	 * @param string $expected           The expected url.
	 *
	 * @return void
	 */
	public function test_build( $is_premium, $first_activated_on, $locale, $link, $args_list, $expected ) {
		$this->product_helper
			->expects( 'is_premium' )
			->once()
			->andReturn( $is_premium );

		$this->options_helper
			->expects( 'get' )
			->with( 'first_activated_on' )
			->once()
			->andReturn( $first_activated_on );

		Monkey\Functions\expect( 'get_user_locale' )
			->once()
			->andReturn( $locale );

		Monkey\Functions\expect( 'add_query_arg' )
			->with( $args_list, $link )
			->andReturn( $expected );

		$shortlink = $this->instance->build( $link );

		$this->assertStringContainsString( 'php_version', $shortlink );
		$this->assertStringContainsString( 'platform_version', $shortlink );
		$this->assertStringContainsString( 'software', $shortlink );
		if ( $is_premium ) {
			$this->assertStringContainsString( 'premium', $shortlink );
		}
		else {
			$this->assertStringContainsString( 'free', $shortlink );
		}
	}

	/**
	 * Data provider for the test_build() test.
	 *
	 * @return array
	 */
	public static function build_dataprovider() {
		return [
			'premium' => [
				'is_premium'               => true,
				'first_activated_on'       => 10,
				'locale'                   => 'it_IT',
				'link'                     => 'https://yoa.st/abcdefg',
				'args_list'                => [
					'php_version'      => '8.0',
					'platform_version' => '6.2',
					'software'         => 'wordpress',
				],
				'expected'                 => 'https://yoa.st/abcdefg?php_version=8.0&platform_version=6.2&software=premium&days_active=10&user_language=it_IT',
			],
			'not premium' => [
				'is_premium'               => false,
				'first_activated_on'       => 10,
				'locale'                   => 'it_IT',
				'link'                     => 'https://yoa.st/abcdefg',
				'args_list'                => [
					'php_version'      => '8.0',
					'platform_version' => '6.2',
					'software'         => 'wordpress',
				],
				'expected'                 => 'https://yoa.st/abcdefg?php_version=8.0&platform_version=6.2&software=free&days_active=10&user_language=it_IT',
			],
		];
	}

	/**
	 * Tests getting the query params.
	 *
	 * @covers ::get_query_params
	 * @covers ::collect_additional_shortlink_data
	 *
	 * @dataProvider get_query_params_dataprovider
	 *
	 * @param bool   $is_premium         Whether the plugin is premium or not.
	 * @param string $first_activated_on The date (in days) the plugin was first activated.
	 * @param string $locale             The locale of the user.
	 * @param string $page               The page to get the query params for.
	 * @param array  $expected           The expected query params values.
	 *
	 * @return void
	 */
	public function test_get_query_params( $is_premium, $first_activated_on, $locale, $page, $expected ) {
		$_GET['page'] = $page;

		$this->product_helper
			->expects( 'is_premium' )
			->once()
			->andReturn( $is_premium );

		$this->options_helper
			->expects( 'get' )
			->with( 'first_activated_on' )
			->once()
			->andReturn( $first_activated_on );

		Monkey\Functions\expect( 'get_user_locale' )
			->once()
			->andReturn( $locale );

		$query_params     = $this->instance->get_query_params();
		$query_param_keys = \array_keys( $query_params );

		$this->assertContains( 'php_version', $query_param_keys );
		$this->assertContains( 'platform_version', $query_param_keys );
		$this->assertContains( 'software', $query_param_keys );

		$this->assertEquals( $query_params['days_active'], $expected['days_active'] );
		$this->assertEquals( $query_params['software'], $expected['software'] );
		$this->assertEquals( $query_params['platform'], $expected['platform'] );

		if ( ! \is_null( $page ) ) {
			$this->assertContains( 'screen', $query_param_keys );
		}
	}

	/**
	 * Data provider for the test_get_query_params() test.
	 *
	 * @return array
	 */
	public static function get_query_params_dataprovider() {
		return [
			'screen' => [
				'is_premium'         => true,
				'first_activated_on' => ( \time() - \DAY_IN_SECONDS * 10 ),
				'locale'             => 'it_IT',
				'page'               => 'wpseo_dashboard',
				'expected'           => [
					'software'    => 'premium',
					'days_active' => 10,
					'platform'    => 'wordpress',
				],
			],
			'not screen' => [
				'is_premium'         => false,
				'first_activated_on' => ( \time() - \DAY_IN_SECONDS * 10 ),
				'locale'             => 'it_IT',
				'page'               => null,
				'expected'           => [
					'software'    => 'free',
					'days_active' => 10,
					'platform'    => 'wordpress',
				],
			],
		];
	}
}
