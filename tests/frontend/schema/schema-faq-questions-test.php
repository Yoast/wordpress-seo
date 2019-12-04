<?php

namespace Yoast\WP\Free\Tests\Frontend\Schema;

use Mockery;
use WPSEO_Schema_Context;
use Yoast\WP\Free\Tests\Doubles\Frontend\Schema\Schema_FAQ_Questions_Double;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class WPSEO_Schema_FAQ_Questions_Test.
 *
 * @group schema
 *
 * @package Yoast\Tests\Frontend\Schema
 */
class Schema_FAQ_Questions_Test extends TestCase {

	/**
	 * Test setup.
	 */
	public function setUp() {
		parent::setUp();

		$this->context = Mockery::mock( WPSEO_Schema_Context::class )->makePartial();

		$this->context->canonical = 'example.com/';

		$this->instance = new Schema_FAQ_Questions_Double( [], [], $this->context );
	}

	/**
	 * Tests the FAQ Questions schema output with a question and answer.
	 *
	 * @covers WPSEO_Schema_FAQ_Questions::generate_question_block
	 */
	public function test_schema_output() {
		$actual = $this->instance->generate_question_block(
			[
				'id'           => 'question-1',
				'jsonQuestion' => 'Is this a question?',
				'jsonAnswer'   => 'This is an answer',
			]
		);

		$expected = [
			'@type'            => 'Question',
			'@id'              => 'example.com/#question-1',
			'position'         => 0,
			'url'              => 'example.com/#question-1',
			'name'             => 'Is this a question?',
			'answerCount'      => 1,
			'acceptedAnswer'   => [
				'@type' => 'Answer',
				'text'  => 'This is an answer',
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the FAQ Questions schema output with an empty question.
	 *
	 * @covers WPSEO_Schema_FAQ_Questions::generate_question_block
	 */
	public function test_schema_output_empty_question() {
		$actual = $this->instance->generate_question_block(
			[
				'id'           => 'question-1',
				'jsonQuestion' => '',
				'jsonAnswer'   => 'This is an answer',
			]
		);

		$expected = [
			'@type'            => 'Question',
			'@id'              => 'example.com/#question-1',
			'position'         => 0,
			'url'              => 'example.com/#question-1',
			'name'             => '',
			'answerCount'      => 1,
			'acceptedAnswer'   => [
				'@type' => 'Answer',
				'text'  => 'This is an answer',
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the FAQ Questions schema output with an empty answer.
	 *
	 * @covers WPSEO_Schema_FAQ_Questions::generate_question_block
	 */
	public function test_schema_output_empty_answer() {
		$actual = $this->instance->generate_question_block(
			[
				'id'           => 'question-1',
				'jsonQuestion' => 'Is this a question?',
				'jsonAnswer'   => '',
			]
		);

		$expected = [
			'@type'            => 'Question',
			'@id'              => 'example.com/#question-1',
			'position'         => 0,
			'url'              => 'example.com/#question-1',
			'name'             => 'Is this a question?',
			'answerCount'      => 1,
			'acceptedAnswer'   => [
				'@type' => 'Answer',
				'text'  => '',
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the FAQ Questions schema output with an empty question and empty answer.
	 *
	 * @covers WPSEO_Schema_FAQ_Questions::generate_question_block
	 */
	public function test_schema_output_empty__question_and_answer() {
		$actual = $this->instance->generate_question_block(
			[
				'id'           => 'question-1',
				'jsonQuestion' => '',
				'jsonAnswer'   => '',
			]
		);

		$expected = [
			'@type'            => 'Question',
			'@id'              => 'example.com/#question-1',
			'position'         => 0,
			'url'              => 'example.com/#question-1',
			'name'             => '',
			'answerCount'      => 1,
			'acceptedAnswer'   => [
				'@type' => 'Answer',
				'text'  => '',
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the FAQ Questions schema output with allowed HTML tags in the jsonAnswer.
	 *
	 * <h1> is one of the tags that is allowed in the Question name output. Therefore, it should be stripped.
	 *
	 * @covers WPSEO_Schema_FAQ_Questions::generate_question_block
	 */
	public function test_schema_output_with_allowed_tags_in_jsonanswer() {
		$actual = $this->instance->generate_question_block(
			[
				'id'           => 'question-1',
				'jsonQuestion' => 'Is this a question?',
				'jsonAnswer'   => '<h1>This is an answer<h1>',
			]
		);

		$expected = [
			'@type'            => 'Question',
			'@id'              => 'example.com/#question-1',
			'position'         => 0,
			'url'              => 'example.com/#question-1',
			'name'             => 'Is this a question?',
			'answerCount'      => 1,
			'acceptedAnswer'   => [
				'@type' => 'Answer',
				'text'  => '<h1>This is an answer<h1>',
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the FAQ Questions schema output with disallowed HTML tags in the jsonAnswer.
	 *
	 * <div> is not allowed in the Question name output. Therefore, it should be stripped.
	 *
	 * @covers WPSEO_Schema_FAQ_Questions::generate_question_block
	 */
	public function test_schema_output_with_disallowed_tags_in_jsonanswer() {
		$actual = $this->instance->generate_question_block(
			[
				'id'           => 'question-1',
				'jsonQuestion' => 'Is this a question?',
				'jsonAnswer'   => '<div>This is an answer</div>',
			]
		);

		$expected = [
			'@type'            => 'Question',
			'@id'              => 'example.com/#question-1',
			'position'         => 0,
			'url'              => 'example.com/#question-1',
			'name'             => 'Is this a question?',
			'answerCount'      => 1,
			'acceptedAnswer'   => [
				'@type' => 'Answer',
				'text'  => 'This is an answer',
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the FAQ Questions schema output with disallowed HTML tags in the jsonAnswer.
	 *
	 * <h1> is one of the tags that is allowed in the Question name output. <div> is not allowed. Therefore, <h1> shouldn't be stripped, but <div> should.
	 *
	 * @covers WPSEO_Schema_FAQ_Questions::generate_question_block
	 */
	public function test_schema_output_with_allowed_and_disallowed_tags_in_jsonanswer() {
		$actual = $this->instance->generate_question_block(
			[
				'id'           => 'question-1',
				'jsonQuestion' => 'Is this a question?',
				'jsonAnswer'   => '<div><h1>This is an answer</h1></div>',
			]
		);

		$expected = [
			'@type'            => 'Question',
			'@id'              => 'example.com/#question-1',
			'position'         => 0,
			'url'              => 'example.com/#question-1',
			'name'             => 'Is this a question?',
			'answerCount'      => 1,
			'acceptedAnswer'   => [
				'@type' => 'Answer',
				'text'  => '<h1>This is an answer</h1>',
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the FAQ Questions schema output with HTML tags in the jsonQuestion.
	 *
	 * No tags are allowed in the Question name output. Therefore, they should be stripped.
	 *
	 * @covers WPSEO_Schema_FAQ_Questions::generate_question_block
	 */
	public function test_schema_output_with_allowed_tags_in_jsonquestion() {
		$actual = $this->instance->generate_question_block(
			[
				'id'           => 'question-1',
				'jsonQuestion' => '<h1>Is this a question?</h1>',
				'jsonAnswer'   => 'This is an answer',
			]
		);

		$expected = [
			'@type'            => 'Question',
			'@id'              => 'example.com/#question-1',
			'position'         => 0,
			'url'              => 'example.com/#question-1',
			'name'             => 'Is this a question?',
			'answerCount'      => 1,
			'acceptedAnswer'   => [
				'@type' => 'Answer',
				'text'  => 'This is an answer',
			],
		];

		$this->assertEquals( $expected, $actual );
	}
}
