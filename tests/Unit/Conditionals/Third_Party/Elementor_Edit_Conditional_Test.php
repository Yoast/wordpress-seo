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
	 * @dataProvider is_met_dataprovider
	 *
	 * @covers ::is_met
	 * @covers ::get_post_action
	 * @covers ::get_requested_document_id
	 *
	 * @param string    $pagenow_new  The value of global pagenow.
	 * @param mixed     $get_action   The value of action in $_GET['action'].
	 * @param mixed     $post_action  The value of action in $_POST['action'].
	 * @param mixed     $post_actions The value of actions in $_POST['actions'].
	 * @param bool|null $doing_ajax   What wp_doing_ajax should return, if false it should not be called.
	 * @param bool      $return_value The expected return value.
	 *
	 * @return void
	 */
	public function test_is_met( $pagenow_new, $get_action, $post_action, $post_actions, $doing_ajax, $return_value ) {
		global $pagenow;

		$pagenow = $pagenow_new;

		$_GET['action']   = $get_action;
		$_POST['action']  = $post_action;
		$_POST['actions'] = $post_actions;

		if ( $doing_ajax !== null ) {
			Monkey\Functions\expect( 'wp_doing_ajax' )
				->andReturn( $doing_ajax );
		}

		self::assertEquals( $return_value, $this->instance->is_met() );
	}

	/**
	 * Data provider for test_is_met.
	 *
	 * @return array<string,array<string,string|bool|int|null>> The data for test_is_met.
	 */
	public static function is_met_dataprovider(): array {
		return [
			'Action in GET'                   => [
				'pagenow_new'   => 'post.php',
				'get_action'    => 'elementor',
				'post_action'   => null,
				'post_actions'  => null,
				'wp_doing_ajax' => null,
				'return_value'  => true,
			],
			'Action in POST'                  => [
				'pagenow_new'   => 'post.php',
				'get_action'    => null,
				'post_action'   => 'wpseo_elementor_save',
				'post_actions'  => null,
				'wp_doing_ajax' => true,
				'return_value'  => true,
			],
			'Not doing AJAX'                  => [
				'pagenow_new'   => 'post.php',
				'get_action'    => null,
				'post_action'   => 'wpseo_elementor_save',
				'post_actions'  => null,
				'wp_doing_ajax' => false,
				'return_value'  => false,
			],
			'Wrong GET action'                => [
				'pagenow_new'   => 'post.php',
				'get_action'    => 'wrong',
				'post_action'   => null,
				'post_actions'  => null,
				'wp_doing_ajax' => false,
				'return_value'  => false,
			],
			'Wrong POST action'               => [
				'pagenow_new'   => 'post.php',
				'get_action'    => null,
				'post_action'   => 'wrong',
				'post_actions'  => null,
				'wp_doing_ajax' => true,
				'return_value'  => false,
			],
			'Wrong GET action type'           => [
				'pagenow_new'   => 'post.php',
				'get_action'    => 13,
				'post_action'   => null,
				'post_actions'  => null,
				'wp_doing_ajax' => false,
				'return_value'  => false,
			],
			'Wrong POST action type'          => [
				'pagenow_new'   => 'post.php',
				'get_action'    => null,
				'post_action'   => 13,
				'post_actions'  => null,
				'wp_doing_ajax' => true,
				'return_value'  => false,
			],
			'Elementor AJAX'                  => [
				'pagenow_new'   => 'index.php',
				'get_action'    => null,
				'post_action'   => 'elementor_ajax',
				'post_actions'  => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [
								'id' => 1,
							],
						],
					]
				),
				'wp_doing_ajax' => true,
				'return_value'  => true,
			],
			'Elementor AJAX: without actions' => [
				'pagenow_new'   => 'index.php',
				'get_action'    => null,
				'post_action'   => 'elementor_ajax',
				'post_actions'  => null,
				'wp_doing_ajax' => true,
				'return_value'  => false,
			],
			'Elementor AJAX: invalid actions' => [
				'pagenow_new'   => 'index.php',
				'get_action'    => null,
				'post_action'   => 'elementor_ajax',
				'post_actions'  => 'no-json-array',
				'wp_doing_ajax' => true,
				'return_value'  => false,
			],
			'Elementor AJAX: no action'       => [
				'pagenow_new'   => 'index.php',
				'get_action'    => null,
				'post_action'   => 'elementor_ajax',
				'post_actions'  => \json_encode( [] ),
				'wp_doing_ajax' => true,
				'return_value'  => false,
			],
			'Elementor AJAX: wrong action'    => [
				'pagenow_new'   => 'index.php',
				'get_action'    => null,
				'post_action'   => 'elementor_ajax',
				'post_actions'  => \json_encode(
					[
						'document-1' => [
							'action' => 'wrong',
						],
					]
				),
				'wp_doing_ajax' => true,
				'return_value'  => false,
			],
			'Elementor AJAX: without data'    => [
				'pagenow_new'   => 'index.php',
				'get_action'    => null,
				'post_action'   => 'elementor_ajax',
				'post_actions'  => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
						],
					]
				),
				'wp_doing_ajax' => true,
				'return_value'  => false,
			],
			'Elementor AJAX: without ID'      => [
				'pagenow_new'   => 'index.php',
				'get_action'    => null,
				'post_action'   => 'elementor_ajax',
				'post_actions'  => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [],
						],
					]
				),
				'wp_doing_ajax' => true,
				'return_value'  => false,
			],
			'Elementor AJAX: non-numeric ID'  => [
				'pagenow_new'   => 'index.php',
				'get_action'    => null,
				'post_action'   => 'elementor_ajax',
				'post_actions'  => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [
								'id' => 'non-numeric',
							],
						],
					]
				),
				'wp_doing_ajax' => true,
				'return_value'  => false,
			],
		];
	}
}
