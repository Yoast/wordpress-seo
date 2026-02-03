<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Create_New_Content;

use Brain\Monkey;

/**
 * Test class for getting the id.
 *
 * @group Create_New_Content
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content::get_id
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content::get_duration
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content::get_priority
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content::get_badge
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content::get_is_completed
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content::get_copy_set
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content::get_link
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content::to_array
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry::to_array
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Create_New_Content_To_Array_Test extends Abstract_Create_New_Content_Test {

	/**
	 * Tests the task's to_array method when completed.
	 *
	 * @return void
	 */
	public function test_to_array_completed() {
		$this->post_type_helper
			->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'post' ] );

		$get_posts_args = [
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'numberposts'    => 1,
			'date_query'     => [
				[
					'after' => '30 days ago',
				],
			],
		];
		Monkey\Functions\expect( 'get_posts' )
			->once()
			->with( $get_posts_args )
			->andReturn( [ 'post1' ] );

		Monkey\Functions\expect( 'self_admin_url' )
			->once()
			->with( 'post-new.php' )
			->andReturn( 'https://example.com/wp-admin/post-new.php' );

		$expected_result = [
			'id'           => 'create-new-content',
			'duration'     => 90,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => [
				'label' => 'Create new post',
				'type'  => 'add',
				'href'  => 'https://example.com/wp-admin/post-new.php',
			],
			'title'        => 'Create new content',
			'why'          => 'Long gaps without new content slow down your traffic growth. Publishing regularly gives search engines and visitors a reason to return.',
			'how'          => 'Plan a topic, write your post, and use the SEO and Readability Analyses to refine it before publishing.',
		];

		$this->instance->set_enhanced_call_to_action( $this->instance->get_call_to_action() );
		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when completed because posts are not a public post type.
	 *
	 * @return void
	 */
	public function test_to_array_completed_post_not_public() {
		$this->post_type_helper
			->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'page' ] );

		Monkey\Functions\expect( 'get_posts' )
			->never();

		Monkey\Functions\expect( 'self_admin_url' )
			->once()
			->with( 'post-new.php' )
			->andReturn( 'https://example.com/wp-admin/post-new.php' );

		$expected_result = [
			'id'           => 'create-new-content',
			'duration'     => 90,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => [
				'label' => 'Create new post',
				'type'  => 'add',
				'href'  => 'https://example.com/wp-admin/post-new.php',
			],
			'title'        => 'Create new content',
			'why'          => 'Long gaps without new content slow down your traffic growth. Publishing regularly gives search engines and visitors a reason to return.',
			'how'          => 'Plan a topic, write your post, and use the SEO and Readability Analyses to refine it before publishing.',
		];

		$this->instance->set_enhanced_call_to_action( $this->instance->get_call_to_action() );
		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when completed.
	 *
	 * @return void
	 */
	public function test_to_array_not_completed() {
		$this->post_type_helper
			->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'post' ] );

		$get_posts_args = [
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'numberposts'    => 1,
			'date_query'     => [
				[
					'after' => '30 days ago',
				],
			],
		];
		Monkey\Functions\expect( 'get_posts' )
			->once()
			->with( $get_posts_args )
			->andReturn( [] );

		Monkey\Functions\expect( 'self_admin_url' )
			->once()
			->with( 'post-new.php' )
			->andReturn( 'https://example.com/wp-admin/post-new.php' );

		$expected_result = [
			'id'           => 'create-new-content',
			'duration'     => 90,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => false,
			'callToAction' => [
				'label' => 'Create new post',
				'type'  => 'add',
				'href'  => 'https://example.com/wp-admin/post-new.php',
			],
			'title'        => 'Create new content',
			'why'          => 'Long gaps without new content slow down your traffic growth. Publishing regularly gives search engines and visitors a reason to return.',
			'how'          => 'Plan a topic, write your post, and use the SEO and Readability Analyses to refine it before publishing.',
		];

		$this->instance->set_enhanced_call_to_action( $this->instance->get_call_to_action() );
		$this->assertSame( $expected_result, $this->instance->to_array() );
	}
}
