<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;

/**
 * Tests the get_copy_set method of the Improve Default Meta Descriptions task.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_copy_set
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Get_Copy_Set_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests that get_copy_set returns a Copy_Set with the correct title and about text.
	 *
	 * @return void
	 */
	public function test_get_copy_set_returns_correct_copy_set() {
		$this->instance->set_post_type( 'post' );

		$copy_set = $this->instance->get_copy_set();

		$this->assertInstanceOf( Copy_Set::class, $copy_set );

		$array = $copy_set->to_array();

		$this->assertSame( 'Improve default meta descriptions of your recent content: Posts', $array['title'] );
		$this->assertStringContainsString(
			'Default meta descriptions don\'t always highlight what makes your page unique.',
			$array['about'],
		);
		$this->assertStringContainsString( '<strong>Yoast SEO Premium</strong>', $array['about'] );
		$this->assertStringContainsString( '<strong>AI Generate</strong>', $array['about'] );
	}

	/**
	 * Tests that get_copy_set uses the post type label in the title.
	 *
	 * @return void
	 */
	public function test_get_copy_set_uses_post_type_label_in_title() {
		$this->instance->set_post_type( 'post' );

		$copy_set = $this->instance->get_copy_set();
		$array    = $copy_set->to_array();

		$this->assertStringContainsString( 'Posts', $array['title'] );
	}
}
