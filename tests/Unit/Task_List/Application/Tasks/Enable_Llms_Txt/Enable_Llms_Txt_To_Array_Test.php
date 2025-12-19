<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Enable_Llms_Txt;

/**
 * Test class for getting the id.
 *
 * @group Enable_Llms_Txt
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::get_id
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::get_duration
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::get_priority
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::get_badge
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::get_is_completed
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::get_copy_set
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::to_array
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::get_link
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry::to_array
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Enable_Llms_Txt_To_Array_Test extends Abstract_Enable_Llms_Txt_Test {

	/**
	 * Tests the task's to_array method when completed.
	 *
	 * @return void
	 */
	public function test_to_array_completed() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_llms_txt', false )
			->andReturn( true );

		$expected_result = [
			'id'           => 'enable-llms-txt',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => [
				'label' => 'Enable llms.txt',
				'type'  => 'default',
				'href'  => null,
			],
			'title'        => 'Create an llms.txt file',
			'why'          => 'Without llms.txt, AI crawlers may not know how to treat your content. Publishing it helps communicate your preferences in a clearer way to AI tools.',
			'how'          => null,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when not completed.
	 *
	 * @return void
	 */
	public function test_to_array_not_completed() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_llms_txt', false )
			->andReturn( false );

		$expected_result = [
			'id'           => 'enable-llms-txt',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => false,
			'callToAction' => [
				'label' => 'Enable llms.txt',
				'type'  => 'default',
				'href'  => null,
			],
			'title'        => 'Create an llms.txt file',
			'why'          => 'Without llms.txt, AI crawlers may not know how to treat your content. Publishing it helps communicate your preferences in a clearer way to AI tools.',
			'how'          => null,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}
}
