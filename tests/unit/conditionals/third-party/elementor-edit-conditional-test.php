<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Edit_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Brain\Monkey;

/**
 * Class Elementor_Edit_Conditional_Test.
 *
 * @group conditionals
 * @group third-party
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Edit_Conditional
 */
class Elementor_Edit_Conditional_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Elementor_Edit_Conditional
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Elementor_Edit_Conditional();
	}

	/**
	 * Tests that the condition is not met when the Elementor plugin is not active.
	 *
	 * @param string    $pagenow_new  The value of global pagenow.
	 * @param mixed     $get_action   The value of action in $_GET['action'].
	 * @param mixed     $post_action  The value of action in $_POST['action'].
	 * @param bool|null $doing_ajax   What wp_doing_ajax should return, if false it should not be called.
	 * @param bool      $return_value The expected return value.
	 *
	 * @dataProvider is_met_dataprovider
	 *
	 * @covers ::is_met
	 */
	public function test_is_met( $pagenow_new, $get_action, $post_action, $doing_ajax, $return_value ) {
		global $pagenow;

		$pagenow = $pagenow_new;

		$_GET['action']  = $get_action;
		$_POST['action'] = $post_action;

		if ( $doing_ajax !== null ) {
			Monkey\Functions\expect( 'wp_doing_ajax' )
				->andReturn( $doing_ajax );
		}

		self::assertEquals( $return_value, $this->instance->is_met() );
	}

	/**
	 * Data provider for test_is_met.
	 *
	 * @return array[] The data for test_is_met.
	 */
	public function is_met_dataprovider() {
		$action_in_get          = [
			'pagenow_new'   => 'post.php',
			'get_action'    => 'elementor',
			'post_action'   => null,
			'wp_doing_ajax' => null,
			'return_value'  => true,
		];
		$action_in_post         = [
			'pagenow_new'   => 'post.php',
			'get_action'    => null,
			'post_action'   => 'wpseo_elementor_save',
			'wp_doing_ajax' => true,
			'return_value'  => true,
		];
		$not_doing_ajax         = [
			'pagenow_new'   => 'post.php',
			'get_action'    => null,
			'post_action'   => 'wpseo_elementor_save',
			'wp_doing_ajax' => false,
			'return_value'  => false,
		];
		$wrong_get_action       = [
			'pagenow_new'   => 'post.php',
			'get_action'    => 'wrong',
			'post_action'   => null,
			'wp_doing_ajax' => null,
			'return_value'  => false,
		];
		$wrong_post_action      = [
			'pagenow_new'   => 'post.php',
			'get_action'    => null,
			'post_action'   => 'wrong',
			'wp_doing_ajax' => true,
			'return_value'  => false,
		];
		$wrong_get_action_type  = [
			'pagenow_new'   => 'post.php',
			'get_action'    => 13,
			'post_action'   => null,
			'wp_doing_ajax' => null,
			'return_value'  => false,
		];
		$wrong_post_action_type = [
			'pagenow_new'   => 'post.php',
			'get_action'    => null,
			'post_action'   => 13,
			'wp_doing_ajax' => null,
			'return_value'  => false,
		];
		return [
			'Action in GET'          => $action_in_get,
			'Action in POST'         => $action_in_post,
			'Not doing AJAX'         => $not_doing_ajax,
			'Wrong GET action'       => $wrong_get_action,
			'Wrong POST action'      => $wrong_post_action,
			'Wrong GET action type'  => $wrong_get_action_type,
			'Wrong POST action type' => $wrong_post_action_type,
		];
	}
}
