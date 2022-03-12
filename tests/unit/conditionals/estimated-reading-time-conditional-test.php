<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin\Estimated_Reading_Time_Conditional;
use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;
use Yoast\WP\SEO\Helpers\Input_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Base class can't be written shorter without abbreviating.

/**
 * Class Estimated_Reading_Time_Conditional.
 *
 * @group conditionals
 * @group estimated-reading-time
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Admin\Estimated_Reading_Time_Conditional
 */
class Estimated_Reading_Time_Conditional_Test extends TestCase {

	/**
	 * The estimated reading time conditional.
	 *
	 * @var Estimated_Reading_Time_Conditional
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 */
	public function set_up() {
		parent::set_up();

		$this->post_conditional = Mockery::mock( Post_Conditional::class );
		$this->input_helper     = Mockery::mock( Input_Helper::class );

		$this->instance = new Estimated_Reading_Time_Conditional(
			$this->post_conditional,
			$this->input_helper
		);
	}

	/**
	 * Tests that the conditional is met when we are saving for Elementor.
	 *
	 * @covers ::is_met
	 *
	 * @requires PHP < 8.1
	 */
	public function test_ajax_elementor_save() {
		// We are in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( true );

		// We are saving in Elementor with Ajax.
		$this->input_helper
			->expects( 'filter' )
			->with( \INPUT_POST, 'action', \FILTER_SANITIZE_STRING )
			->andReturn( 'wpseo_elementor_save' );

		$this->assertEquals( true, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when we are not on a post, and also not in an Elementor save.
	 *
	 * @covers ::is_met
	 *
	 * @requires PHP < 8.1
	 */
	public function test_not_post_not_elementor_save() {
		// We are in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( true );

		// The Ajax action is not for saving Elementor.
		$this->input_helper
			->expects( 'filter' )
			->with( \INPUT_POST, 'action', \FILTER_SANITIZE_STRING )
			->andReturn( 'some_other_value' );

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
	 */
	public function test_post_is_attachment() {
		// We are not in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );

		// We are on a post according to the post conditional.
		$this->post_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		// Returns the post id.
		$this->input_helper
			->expects( 'filter' )
			->with( \INPUT_GET, 'post', \FILTER_SANITIZE_NUMBER_INT )
			->andReturn( '1' );

		// Returns the attachment post type.
		Monkey\Functions\expect( 'get_post_type' )
			->with( 1 )
			->andReturn( 'attachment' );

		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when we are not on a post, and also not in an Elementor save.
	 *
	 * @covers ::is_met
	 */
	public function test_post() {
		// We are not in an Ajax request.
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );

		// We are on a post according to the post conditional.
		$this->post_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		// Returns the post id.
		$this->input_helper
			->expects( 'filter' )
			->with( \INPUT_GET, 'post', \FILTER_SANITIZE_NUMBER_INT )
			->andReturn( '1' );

		// Returns post type.
		Monkey\Functions\expect( 'get_post_type' )
			->with( 1 )
			->andReturn( 'post' );

		$this->assertEquals( true, $this->instance->is_met() );
	}
}
// phpcs:enable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
