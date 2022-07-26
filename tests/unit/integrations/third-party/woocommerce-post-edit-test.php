<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;

use Mockery;
use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Integrations\Third_Party\WooCommerce_Post_Edit;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit tests for the `WooCommerce_Post_Edit` integration
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\WooCommerce_Post_Edit
 */
class WooCommerce_Post_Edit_Test extends TestCase {

	/**
	 * The WooCommerce post edit integration under test.
	 *
	 * @var WooCommerce_Post_Edit
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WooCommerce_Post_Edit();
	}

	/**
	 * Checks that the integration is only loaded when WooCommerce is active
	 * and the user is in the post editor.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_conditionals() {
		$this->assertEquals(
			[ WooCommerce_Conditional::class, Post_Conditional::class ],
			WooCommerce_Post_Edit::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			Monkey\Filters\has(
				'wpseo_post_edit_values',
				[
					$this->instance,
					'remove_meta_description_date',
				]
			)
		);
	}

	/**
	 * Tests that the meta description date is removed on products.
	 *
	 * @covers ::remove_meta_description_date
	 */
	public function test_remove_meta_description_date_when_product() {
		$original_values = [
			'metaDescriptionDate' => 'June 5, 2022',
			'author_name'         => 'Yoasie',
		];

		$expected_values = [
			'metaDescriptionDate' => '',
			'author_name'         => 'Yoasie',
		];

		$post            = Mockery::mock( '\WP_Post' )->makePartial();
		$post->post_type = 'product';

		$new_values = $this->instance->remove_meta_description_date( $original_values, $post );

		$this->assertEquals( $expected_values, $new_values );
	}

	/**
	 * Tests that the meta description date is not removed for non-products.
	 *
	 * @covers ::remove_meta_description_date
	 */
	public function test_do_not_remove_meta_description_date_when_not_a_product() {
		$original_values = [
			'metaDescriptionDate' => 'June 5, 2022',
			'author_name'         => 'Yoasie',
		];

		$post            = Mockery::mock( '\WP_Post' )->makePartial();
		$post->post_type = 'post';

		$new_values = $this->instance->remove_meta_description_date( $original_values, $post );

		$this->assertEquals( $original_values, $new_values );
	}
}
