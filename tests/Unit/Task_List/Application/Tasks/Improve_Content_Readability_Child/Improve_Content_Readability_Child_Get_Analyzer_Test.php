<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_Readability_Child;

use Yoast\WP\SEO\Task_List\Domain\Components\Score_Task_Analyzer;

/**
 * Tests the get_analyzer method of the Improve Content Readability Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_Readability_Child::get_analyzer
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_Readability_Child_Get_Analyzer_Test extends Abstract_Improve_Content_Readability_Child_Test {

	/**
	 * Tests the get_analyzer method returns a Score_Task_Analyzer.
	 *
	 * @return void
	 */
	public function test_get_analyzer_returns_score_task_analyzer() {
		$analyzer = $this->instance->get_analyzer();

		$this->assertInstanceOf( Score_Task_Analyzer::class, $analyzer );
	}

	/**
	 * Tests the get_analyzer method returns correct data for a good score.
	 *
	 * @return void
	 */
	public function test_get_analyzer_with_good_score() {
		$instance = $this->create_instance_with_score( 'good' );
		$array    = $instance->get_analyzer()->to_array();

		$this->assertSame( 'score', $array['type'] );
		$this->assertSame( 'Readability', $array['label'] );
		$this->assertSame( 'good', $array['score'] );
		$this->assertSame( 'Good', $array['scoreLabel'] );
		$this->assertSame( 'This post\'s readability is looking good. Your content should be easy for readers to understand.', $array['details'] );
	}

	/**
	 * Tests the get_analyzer method returns correct data for an ok score.
	 *
	 * @return void
	 */
	public function test_get_analyzer_with_ok_score() {
		$instance = $this->create_instance_with_score( 'ok' );
		$array    = $instance->get_analyzer()->to_array();

		$this->assertSame( 'score', $array['type'] );
		$this->assertSame( 'Readability', $array['label'] );
		$this->assertSame( 'ok', $array['score'] );
		$this->assertSame( 'OK', $array['scoreLabel'] );
		$this->assertSame( 'This post has some readability issues that could be improved to make it easier to read.', $array['details'] );
	}

	/**
	 * Tests the get_analyzer method returns correct data for a bad score.
	 *
	 * @return void
	 */
	public function test_get_analyzer_with_bad_score() {
		$instance = $this->create_instance_with_score( 'bad' );
		$array    = $instance->get_analyzer()->to_array();

		$this->assertSame( 'score', $array['type'] );
		$this->assertSame( 'Readability', $array['label'] );
		$this->assertSame( 'bad', $array['score'] );
		$this->assertSame( 'Needs improvement', $array['scoreLabel'] );
		$this->assertSame( 'This post has one or more readability issues that may make it harder for readers to understand.', $array['details'] );
	}
}
