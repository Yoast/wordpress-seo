<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Mockery;
use Yoast\WP\SEO\Exceptions\Validation\No_Regex_Match_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Regex_Validator;
use Yoast\WP\SEO\Validators\Verification_Validator;

/**
 * Tests the \Yoast\WP\SEO\Validators\Verification_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Verification_Validator
 */
class Verification_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var \Yoast\WP\SEO\Validators\Verification_Validator
	 */
	protected $instance;

	/**
	 * Holds the regex validator mock.
	 *
	 * @var Mockery\Mock|Regex_Validator
	 */
	protected $regex_validator;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->regex_validator = Mockery::mock( Regex_Validator::class );

		$this->instance = new Verification_Validator( $this->regex_validator );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf( Verification_Validator::class, $this->instance );
		$this->assertInstanceOf(
			Regex_Validator::class,
			$this->getPropertyValue( $this->instance, 'regex_validator' )
		);
	}

	/**
	 * Tests validation's happy path.
	 *
	 * @covers ::validate
	 */
	public function test_validate() {
		$this->regex_validator
			->expects( 'validate' )
			->andReturnUsing( static function ( $string ) {
				return $string;
			} );

		$actual = $this->instance->validate( 'abcd', [ 'pattern' => '`^[A-Fa-f0-9_-]+$`' ] );

		$this->assertEquals( 'abcd', $actual );
	}

	/**
	 * Tests validation can handle meta tag.
	 *
	 * @covers ::validate
	 */
	public function test_validate_meta_tag() {
		$this->regex_validator
			->expects( 'validate' )
			->twice()
			->andReturnUsing( static function ( $string, $settings ) {
				if ( $settings['pattern'] === '`content=([\'"])?([^\'"> ]+)(?:\1|[ />])`' ) {
					return 'abcd';
				}

				return $string;
			} );

		$actual = $this->instance->validate( '<meta name="p:domain_verify" content="abcd"/>', [ 'pattern' => '`^[A-Fa-f0-9_-]+$`' ] );

		$this->assertEquals( 'abcd', $actual );
	}

	/**
	 * Tests validation ignores a validation exception in the meta tag regex validator.
	 *
	 * @covers ::validate
	 */
	public function test_validate_meta_tag_throw() {
		$this->regex_validator
			->expects( 'validate' )
			->twice()
			->andReturnUsing( static function ( $string, $settings ) {
				if ( $settings['pattern'] === '`content=([\'"])?([^\'"> ]+)(?:\1|[ />])`' ) {
					throw new No_Regex_Match_Exception( $string, $settings['pattern'] );
				}

				return $string;
			} );

		$actual = $this->instance->validate( '<meta name="p:domain_verify" content="abcd"/>', [ 'pattern' => '`^[A-Fa-f0-9_-]+$`' ] );

		$this->assertEquals( '<meta name="p:domain_verify" content="abcd"/>', $actual );
	}

	/**
	 * Tests validation can throw exceptions.
	 *
	 * @covers ::validate
	 */
	public function test_validate_throw() {
		$this->regex_validator
			->expects( 'validate' )
			->twice()
			->andReturnUsing( static function ( $string, $settings ) {
				throw new No_Regex_Match_Exception( $string, $settings['pattern'] );
			} );

		$this->expectException( No_Regex_Match_Exception::class );

		$this->instance->validate( '<meta name="p:domain_verify" content="abcd"/>', [ 'pattern' => '`^[A-Fa-f0-9_-]+$`' ] );
	}
}
