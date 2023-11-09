<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Introductions\Application\Ai_Generate_Titles_And_Descriptions_Introduction_Upsell;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the AI generate titles and descriptions introduction upsell.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\Ai_Generate_Titles_And_Descriptions_Introduction_Upsell
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Ai_Generate_Titles_And_Descriptions_Introduction_Upsell_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var \Yoast\WP\SEO\Introductions\Application\Ai_Generate_Titles_And_Descriptions_Introduction_Upsell
	 */
	private $instance;

	/**
	 * Holds the product helper.
	 *
	 * @var \Mockery\MockInterface|\Yoast\WP\SEO\Helpers\Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the options helper.
	 *
	 * @var \Mockery\MockInterface|\Yoast\WP\SEO\Helpers\Options_Helper
	 */
	private $options_helper;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->product_helper = Mockery::mock( Product_Helper::class );
		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Ai_Generate_Titles_And_Descriptions_Introduction_Upsell( $this->product_helper, $this->options_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' )
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests getting the ID.
	 *
	 * @covers ::get_id
	 */
	public function test_get_name() {
		$this->assertSame( 'ai-generate-titles-and-descriptions-upsell', $this->instance->get_id() );
	}

	/**
	 * Tests getting the priority.
	 *
	 * @covers ::get_priority
	 */
	public function test_get_priority() {
		$this->assertSame( 10, $this->instance->get_priority() );
	}

	/**
	 * Tests should show.
	 *
	 * @covers ::should_show
	 *
	 * @dataProvider should_show_data
	 *
	 * @param bool   $is_premium          Whether Premium is active.
	 * @param string $previous_version    The previous plugin version.
	 * @param bool   $user_can_edit_posts Whether the user can edit posts.
	 * @param array  $times               The amount of times for expectations. Instead of adding logic to the tests.
	 * @param bool   $expected            The expected result (whether the introduction should show).
	 */
	public function test_should_show(
		$is_premium,
		$previous_version,
		$user_can_edit_posts,
		$times,
		$expected
	) {
		// Don't show when Premium is active.
		$this->product_helper->expects( 'is_premium' )->once()->withNoArgs()->andReturn( $is_premium );

		// Don't show on fresh installations.
		$this->options_helper->expects( 'get' )
			->times( $times['previous_version'] )
			->with( 'previous_version', '' )
			->andReturn( $previous_version );

		// Don't show when user is not allowed to edit posts.
		Functions\expect( 'current_user_can' )
			->times( $times['user_can_edit_posts'] )
			->with( 'edit_posts' )
			->andReturn( $user_can_edit_posts );

		$this->assertSame( $expected, $this->instance->should_show() );
	}

	/**
	 * Provides data for the `test_should_show()` test.
	 *
	 * @return array
	 */
	public function should_show_data() {
		return [
			'showing'                                 => [
				'is_premium'          => false,
				'previous_version'    => '20.10',
				'user_can_edit_posts' => true,
				'times'               => [
					'previous_version'    => 1,
					'user_can_edit_posts' => 1,
				],
				'expected'            => true,
			],
			'do not show when premium is active'      => [
				'is_premium'          => true,
				'previous_version'    => '20.10',
				'user_can_edit_posts' => true,
				'times'               => [
					'previous_version'    => 0,
					'user_can_edit_posts' => 0,
				],
				'expected'            => false,
			],
			'do not show when on the first install'   => [
				'is_premium'          => false,
				'previous_version'    => '',
				'user_can_edit_posts' => true,
				'times'               => [
					'previous_version'    => 1,
					'user_can_edit_posts' => 0,
				],
				'expected'            => false,
			],
			'do not show when user cannot edit posts' => [
				'is_premium'          => false,
				'previous_version'    => '20.10',
				'user_can_edit_posts' => false,
				'times'               => [
					'previous_version'    => 1,
					'user_can_edit_posts' => 1,
				],
				'expected'            => false,
			],
		];
	}
}
