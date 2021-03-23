<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin\Post_Quick_Edit_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Get_Request_Conditional_Test
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Admin\Post_Quick_Edit_Conditional
 */
class Post_Quick_Edit_Conditional_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Post_Quick_Edit_Conditional
	 */
	protected $instance;

	/**
	 * Set up.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Post_Quick_Edit_Conditional();
	}

	/**
	 * Tests calling the method where the request isn't ajax.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_not_doing_ajax() {
		Monkey\Functions\expect( 'wp_doing_ajax' )
			->andReturn( false );

		self::assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests calling the method where the nonce is wrong.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_wrong_nonce() {
		Monkey\Functions\expect( 'wp_doing_ajax' )
			->andReturn( true );

		Monkey\Functions\expect( 'wp_verify_nonce' )
			->with( 'inlineeditnonce', '_inline_edit' )
			->andReturn( false );

		self::assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests calling the method where the post doesn't have an action value.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_no_action_posted() {
		Monkey\Functions\expect( 'wp_doing_ajax' )
			->andReturn( true );

		Monkey\Functions\expect( 'wp_verify_nonce' )
			->with( 'inlineeditnonce', '_inline_edit' )
			->andReturn( true );

		self::assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests calling the method where the post doesn't have an action value.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_wrong_action_posted() {
		Monkey\Functions\expect( 'wp_doing_ajax' )
			->andReturn( true );

		Monkey\Functions\expect( 'wp_verify_nonce' )
			->with( 'inlineeditnonce', '_inline_edit' )
			->andReturn( true );

		$_POST['action'] = 'wrong-action';

		self::assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests calling the method where the post doesn't have an action value.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		Monkey\Functions\expect( 'wp_doing_ajax' )
			->andReturn( true );

		Monkey\Functions\expect( 'wp_verify_nonce' )
			->with( 'inlineeditnonce', '_inline_edit' )
			->andReturn( true );

		$_POST['action'] = 'inline-save';

		self::assertTrue( $this->instance->is_met() );
	}
}
