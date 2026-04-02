<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

use Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

/**
 * Tests the duplicate_for_post_type method of the Improve Default Meta Descriptions task.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::duplicate_for_post_type
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Duplicate_For_Post_Type_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests that duplicate_for_post_type returns a new instance with the given post type.
	 *
	 * @return void
	 */
	public function test_duplicate_for_post_type_returns_clone_with_new_post_type() {
		$this->instance->set_post_type( 'post' );

		$clone = $this->instance->duplicate_for_post_type( 'page' );

		$this->assertInstanceOf( Improve_Default_Meta_Descriptions::class, $clone );
		$this->assertSame( 'page', $clone->get_post_type() );
		$this->assertNotSame( $this->instance, $clone );
	}

	/**
	 * Tests that duplicate_for_post_type does not modify the original instance.
	 *
	 * @return void
	 */
	public function test_duplicate_for_post_type_does_not_modify_original() {
		$this->instance->set_post_type( 'post' );

		$this->instance->duplicate_for_post_type( 'page' );

		$this->assertSame( 'post', $this->instance->get_post_type() );
	}
}
