<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO_Child;

use Yoast\WP\SEO\Task_List\Domain\Components\Score_Task_Analyzer;

/**
 * Tests the get_analyzer method of the Improve Content SEO Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child::get_analyzer
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_SEO_Child_Get_Analyzer_Test extends Abstract_Improve_Content_SEO_Child_Test {

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
		$this->assertSame( 'SEO analysis', $array['title'] );
		$this->assertSame( 'good', $array['result'] );
		$this->assertSame( 'Good', $array['resultLabel'] );
		$this->assertSame( 'This post\'s SEO is looking good. Your content should perform well across search engines and AI systems.', $array['resultDescription'] );
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
		$this->assertSame( 'SEO analysis', $array['title'] );
		$this->assertSame( 'ok', $array['result'] );
		$this->assertSame( 'OK', $array['resultLabel'] );
		$this->assertSame( 'This post has some SEO issues that could be improved to increase its visibility in search and AI systems.', $array['resultDescription'] );
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
		$this->assertSame( 'SEO analysis', $array['title'] );
		$this->assertSame( 'bad', $array['result'] );
		$this->assertSame( 'Needs improvement', $array['resultLabel'] );
		$this->assertSame( 'This post has one or more SEO issues that may reduce its visibility in search and AI systems.', $array['resultDescription'] );
	}
}
