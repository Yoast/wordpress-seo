<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals\Third_Party;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Edit_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Elementor_Edit_Conditional_Test.
 *
 * @group conditionals
 * @group third-party
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Edit_Conditional
 */
final class Elementor_Edit_Conditional_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Elementor_Edit_Conditional
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Elementor_Edit_Conditional();
	}

	/**
	 * Tests that the condition is not met when the Elementor plugin is not active.
	 *
	 * @dataProvider is_met_data_provider
	 *
	 * @covers ::is_met
	 * @covers ::is_elementor_get_action
	 * @covers ::is_yoast_save_post_action
	 *
	 * @param string $pagenow_new  The value of global pagenow.
	 * @param mixed  $get_action   The value of action in $_GET['action'].
	 * @param mixed  $post_action  The value of action in $_POST['action'].
	 * @param bool   $doing_ajax   What wp_doing_ajax should return.
	 * @param bool   $return_value The expected return value.
	 *
	 * @return void
	 */
	public function test_is_met(
		string $pagenow_new,
		$get_action,
		$post_action,
		bool $doing_ajax,
		bool $return_value
	) {
		global $pagenow;

		$pagenow = $pagenow_new;

		$_GET['action']  = $get_action;
		$_POST['action'] = $post_action;

		Monkey\Functions\when( 'wp_doing_ajax' )->justReturn( $doing_ajax );

		$this->assertSame( $return_value, $this->instance->is_met() );
	}

	/**
	 * Provides test data for test_is_met.
	 *
	 * @return array<string,array<string,string|bool|int|null>> The data for test_is_met.
	 */
	public static function is_met_data_provider(): array {
		return [
			'Action in GET'          => [
				'pagenow_new'  => 'post.php',
				'get_action'   => 'elementor',
				'post_action'  => null,
				'doing_ajax'   => false,
				'return_value' => true,
			],
			'Action in POST'         => [
				'pagenow_new'  => 'index.php',
				'get_action'   => null,
				'post_action'  => 'wpseo_elementor_save',
				'doing_ajax'   => true,
				'return_value' => true,
			],
			'Not doing AJAX'         => [
				'pagenow_new'  => 'index.php',
				'get_action'   => null,
				'post_action'  => 'wpseo_elementor_save',
				'doing_ajax'   => false,
				'return_value' => false,
			],
			'No GET action'          => [
				'pagenow_new'  => 'post.php',
				'get_action'   => null,
				'post_action'  => null,
				'doing_ajax'   => false,
				'return_value' => false,
			],
			'No POST action'         => [
				'pagenow_new'  => 'index.php',
				'get_action'   => null,
				'post_action'  => null,
				'doing_ajax'   => true,
				'return_value' => false,
			],
			'Wrong GET action'       => [
				'pagenow_new'  => 'post.php',
				'get_action'   => 'wrong',
				'post_action'  => null,
				'doing_ajax'   => false,
				'return_value' => false,
			],
			'Wrong POST action'      => [
				'pagenow_new'  => 'index.php',
				'get_action'   => null,
				'post_action'  => 'wrong',
				'doing_ajax'   => true,
				'return_value' => false,
			],
			'Wrong GET action type'  => [
				'pagenow_new'  => 'post.php',
				'get_action'   => 13,
				'post_action'  => null,
				'doing_ajax'   => false,
				'return_value' => false,
			],
			'Wrong POST action type' => [
				'pagenow_new'  => 'index.php',
				'get_action'   => null,
				'post_action'  => 13,
				'doing_ajax'   => true,
				'return_value' => false,
			],
		];
	}
}
