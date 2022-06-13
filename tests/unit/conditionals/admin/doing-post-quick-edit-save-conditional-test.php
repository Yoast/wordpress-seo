<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals\Admin;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin\Doing_Post_Quick_Edit_Save_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Doing_Post_Quick_Edit_Save_Conditional
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Admin\Doing_Post_Quick_Edit_Save_Conditional
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Base class can't be written shorter without abbreviating.
 */
class Doing_Post_Quick_Edit_Save_Conditional_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Doing_Post_Quick_Edit_Save_Conditional
	 */
	protected $instance;

	/**
	 * Set up.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Doing_Post_Quick_Edit_Save_Conditional();
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
	 * Tests calling the method where the post doesn't have an action value.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_no_action_posted() {
		Monkey\Functions\expect( 'wp_doing_ajax' )
			->andReturn( true );

		Monkey\Functions\expect( 'check_ajax_referer' )
			->with( 'inlineeditnonce', '_inline_edit', false );

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

		Monkey\Functions\expect( 'check_ajax_referer' )
			->with( 'inlineeditnonce', '_inline_edit', false );

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

		Monkey\Functions\expect( 'check_ajax_referer' )
			->with( 'inlineeditnonce', '_inline_edit', false )
			->andReturn( 1 );

		$_POST['action'] = 'inline-save';

		self::assertTrue( $this->instance->is_met() );
	}
}
