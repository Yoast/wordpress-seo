<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin\Estimated_Reading_Time_Conditional;
use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Estimated_Reading_Time_Conditional.
 *
 * @group conditionals
 * @group estimated-reading-time
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Admin\Estimated_Reading_Time_Conditional
 */
final class Estimated_Reading_Time_Conditional_Test extends TestCase {

	/**
	 * Holds the Post_Conditional instance.
	 *
	 * @var Post_Conditional|Mockery\MockInterface
	 */
	protected $post_conditional;

	/**
	 * The estimated reading time conditional.
	 *
	 * @var Estimated_Reading_Time_Conditional
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->post_conditional = Mockery::mock( Post_Conditional::class );

		$this->instance = new Estimated_Reading_Time_Conditional(
			$this->post_conditional
		);
	}

	/**
	 * Tests that the conditional is met when we are saving for Elementor.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_ajax_elementor_save() {
		// We are in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( true );

		$_POST['action'] = 'wpseo_elementor_save';

		$this->assertEquals( true, $this->instance->is_met() );
	}

	/**
	 * Tests is_met when the action is null.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_ajax_elementor_save_action_null() {
		// We are in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( true );

		$_POST['action'] = null;

		$this->post_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( false );

		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests is_met when the action is not a string.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_ajax_elementor_save_action_not_a_string() {
		// We are in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( true );

		$_POST['action'] = 9;

		$this->post_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( false );

		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when we are not on a post, and also not in an Elementor save.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_not_post_not_elementor_save() {
		// We are in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( true );

		$_POST['action'] = 'some_other_value';

		// We are not on a post according to the post conditional.
		$this->post_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( false );

		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when we are not on a post, and also not in an Elementor save.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_post_is_attachment() {
		// We are not in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );

		// We are on a post according to the post conditional.
		$this->post_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		$_GET['post'] = '1';

		// Returns the attachment post type.
		Monkey\Functions\expect( 'get_post_type' )
			->with( 1 )
			->andReturn( 'attachment' );

		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests is_met when post is null.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_post_is_null() {
		// We are not in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );

		// We are on a post according to the post conditional.
		$this->post_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		$_GET['post'] = null;

		$this->assertEquals( true, $this->instance->is_met() );
	}

	/**
	 * Tests is_met when post is not a string.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_post_is_not_string() {
		// We are not in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );

		// We are on a post according to the post conditional.
		$this->post_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		$_GET['post'] = 5;

		$this->assertEquals( true, $this->instance->is_met() );
	}

	/**
	 * Tests is_met when post can not be converted to an integer.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_post_can_not_be_converted_to_int() {
		// We are not in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );

		// We are on a post according to the post conditional.
		$this->post_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		$_GET['post'] = 'this_is_not_an_int';

		$this->assertEquals( true, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when we are not on a post, and also not in an Elementor save.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_post() {
		// We are not in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );

		// We are on a post according to the post conditional.
		$this->post_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		$_GET['post'] = '1';

		// Returns post type.
		Monkey\Functions\expect( 'get_post_type' )
			->with( 1 )
			->andReturn( 'post' );

		$this->assertEquals( true, $this->instance->is_met() );
	}
}
