<?php

namespace Yoast\WP\SEO\Tests\Presentations;

use Mockery;
use Yoast\WP\SEO\Tests\Doubles\Presentations\Abstract_Presentation_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Abstract_Presentation_Test
 *
 * @group presentations
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Abstract_Presentation
 */
class Abstract_Presentation_Test extends TestCase {

	/**
	 * Holds the abstract presentation mock instance.
	 *
	 * @var Abstract_Presentation_Mock
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Abstract_Presentation_Mock::class )->makePartial();
	}

	/**
	 * Tests whether the`of`-method generates a model presentation.
	 *
	 * @covers ::of
	 */
	public function test_of_generates_model_presentation() {
		$data = [
			'property_1' => 'value_1',
			'property_2' => 'value_2',
		];

		$model_presentation = $this->instance->of( $data );

		$this->assertEquals( 'value_1', $model_presentation->property_1 );
		$this->assertEquals( 'value_2', $model_presentation->property_2 );
	}

	/**
	 * Tests whether the`of`-method throws an exception when called on a prototype.
	 *
	 * @expectedException \Exception
	 * @covers ::of
	 */
	public function test_of_throws_exception_on_prototype() {
		$this->instance
			->expects( 'is_prototype' )
			->andReturnFalse();

		$data = [
			'property_1' => 'value_1',
			'property_2' => 'value_2',
		];

		$this->instance->of( $data );
	}

	/**
	 * Tests whether an exception is thrown when trying to access a property
	 * with no generator method.
	 *
	 * @expectedException \Exception
	 * @covers ::__get
	 */
	public function test_get_throws_exception_when_accessing_property_with_no_generator() {
		$this->instance
			->expects( 'is_prototype' )
			->andReturnTrue();

		$this->instance->non_existing_property;
	}

	/**
	 * Tests whether an exception is thrown when trying to access a property
	 * with no generator method.
	 *
	 * @expectedException \Exception
	 * @covers ::__get
	 */
	public function test_get_throws_exception_when_accessing_property_on_prototype() {
		$this->instance->expects( 'is_prototype' )
			->andReturnFalse();

		$this->instance->non_existing_property;
	}

	/**
	 * Tests whether accessing a property calls its generator method.
	 *
	 * @covers ::__get
	 */
	public function test_get_calls_generator_method() {
		$this->instance
			->expects( 'is_prototype' )
			->andReturnFalse();

		/*
		 * The abstract presentation mock has a
		 * mock generate method for the `some_mock_data` property.
		 */
		$actual_value = $this->instance->some_mock_data;

		$this->assertEquals( 'some_mock_value', $actual_value );
	}
}
