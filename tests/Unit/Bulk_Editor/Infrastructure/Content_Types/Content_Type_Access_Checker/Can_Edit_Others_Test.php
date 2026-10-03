<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Content_Types\Content_Type_Access_Checker;

use Brain\Monkey\Functions;

/**
 * Tests can_edit_others.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types\Content_Type_Access_Checker::can_edit_others
 */
final class Can_Edit_Others_Test extends Abstract_Test {

	/**
	 * Tests that can_edit_others checks the post type's own edit_others_posts capability.
	 *
	 * @return void
	 */
	public function test_can_edit_others() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'book' )
			->andReturn(
				(object) [
					'map_meta_cap' => true,
					'cap'          => (object) [ 'edit_others_posts' => 'edit_others_books' ],
				],
			);

		Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_others_books' )
			->andReturnTrue();

		$this->assertTrue( $this->instance->can_edit_others( 'book' ) );
	}

	/**
	 * Tests that can_edit_others returns false when the user lacks the capability.
	 *
	 * @return void
	 */
	public function test_can_edit_others_without_capability() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'page' )
			->andReturn(
				(object) [
					'map_meta_cap' => true,
					'cap'          => (object) [ 'edit_others_posts' => 'edit_others_pages' ],
				],
			);

		Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_others_pages' )
			->andReturnFalse();

		$this->assertFalse( $this->instance->can_edit_others( 'page' ) );
	}

	/**
	 * Tests that the plural edit_others_posts capability is used when meta-cap mapping
	 * is disabled, instead of the singular meta capability, which would require a post ID.
	 *
	 * Mirrors post types like the bbPress/BuddyBoss forum, topic and reply types, where
	 * e.g. only moderators and keymasters hold the edit_others_* capability.
	 *
	 * @return void
	 */
	public function test_can_edit_others_uses_plural_capability_when_mapping_disabled() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'forum' )
			->andReturn(
				(object) [
					'map_meta_cap' => false,
					'cap'          => (object) [
						'edit_post'         => 'edit_forum',
						'edit_others_posts' => 'edit_others_forums',
					],
				],
			);

		Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_others_forums' )
			->andReturnTrue();

		$this->assertTrue( $this->instance->can_edit_others( 'forum' ) );
	}

	/**
	 * Tests that can_edit_others returns false when mapping is disabled and the user only
	 * holds their own editing capability, e.g. a bbPress participant editing their own topics.
	 *
	 * @return void
	 */
	public function test_can_edit_others_without_edit_others_capability_when_mapping_disabled() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'topic' )
			->andReturn(
				(object) [
					'map_meta_cap' => false,
					'cap'          => (object) [
						'edit_posts'        => 'edit_topics',
						'edit_others_posts' => 'edit_others_topics',
					],
				],
			);

		Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_others_topics' )
			->andReturnFalse();

		$this->assertFalse( $this->instance->can_edit_others( 'topic' ) );
	}

	/**
	 * Tests that can_edit_others returns false for an unknown post type.
	 *
	 * @return void
	 */
	public function test_can_edit_others_unknown_post_type() {
		Functions\expect( 'get_post_type_object' )
			->once()
			->with( 'nonexistent' )
			->andReturnNull();

		Functions\expect( 'current_user_can' )->never();

		$this->assertFalse( $this->instance->can_edit_others( 'nonexistent' ) );
	}
}
