<?php

class Unit_Test_Generator {

	/**
	 * Generates a new unit test for the given class.
	 *
	 * @param string $fully_qualified_class_name The fully qualified class name of the class to generate a unit test for.
	 *
	 * @throws ReflectionException
	 */
	public static function generate( $fully_qualified_class_name ) {
		$reflector = new \ReflectionClass( $fully_qualified_class_name );

		$name                  = $reflector->getShortName();
		$constructor_arguments = self::get_constructor_arguments( $reflector );

		$namespace                    = self::generate_namespace( $fully_qualified_class_name );
		$use_statements               = self::generate_use_statements( $constructor_arguments );
		$property_statements          = self::generate_property_statements( $constructor_arguments );
		$create_mock_statements       = self::generate_create_mock_statements( $constructor_arguments );
		$instance_argument_statements = self::generate_instance_argument_statements( $constructor_arguments );

		$filled_in_template = self::unit_test_template(
			$fully_qualified_class_name,
			$name,
			$namespace,
			$use_statements,
			$property_statements,
			$create_mock_statements,
			$instance_argument_statements
		);

		$unit_test_path = self::generate_file_name( $reflector->getFileName() );

		\file_put_contents( __DIR__ . '/../../tests/unit/' . $unit_test_path, $filled_in_template );
	}

	private static function generate_namespace( $fully_qualified_class_name ) {
		$matches = [];
		\preg_match( '/Yoast\\\WP\\\SEO\\\(.*)\\\.*$/', $fully_qualified_class_name, $matches );

		return $matches[1];
	}

	private static function generate_file_name( $path ) {
		$matches = [];
		\preg_match( '/\/src\/(.*)\.php$/', $path, $matches );

		return $matches[1] . '-test.php';
	}

	private static function unit_test_template(
		$fully_qualified_class_name,
		$name,
		$namespace,
		$use_statements,
		$property_statements,
		$create_mock_statements,
		$instance_argument_statements
	) {
		return <<<TPL
<?php

namespace Yoast\WP\SEO\Tests\Unit\\{$namespace};

use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use {$fully_qualified_class_name};

{$use_statements}
/**
 * {$name} test.
 */
class {$name}_Test extends TestCase {

{$property_statements}
	/**
	 * Instance under test.
	 *
	 * @var {$name}
	 */
	protected \$instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();
		{$create_mock_statements}
		\$this->instance = new {$name}(
			{$instance_argument_statements}
		);
	}
}
TPL;
	}

	/**
	 * Retrieves the arguments from the given reflected class.
	 *
	 * @param ReflectionClass $reflector The reflected class from which to retrieve the constructor arguments.
	 *
	 * @return ReflectionParameter[] The arguments in the constructor.
	 * @throws RuntimeException If the reflected class does not have a constructor.
	 */
	private static function get_constructor_arguments( ReflectionClass $reflector ) {
		$constructor = $reflector->getConstructor();

		if ( ! $constructor ) {
			throw new RuntimeException( 'The class for which to generate a unit test does not have a constructor.' );
		}

		return $constructor->getParameters();
	}

	private static function generate_use_statements( array $constructor_arguments ) {
		return self::combine(
			$constructor_arguments,
			function( $argument ) {
				return 'use ' . $argument->getClass()->getName() . ';';
			}
		);
	}

	private static function generate_property_statements( array $constructor_arguments ) {
		return self::combine(
			$constructor_arguments,
			function( $argument ) {
				return <<<TPL
	/**
	 * {$argument->getClass()->getShortName()} mock.
	 *
	 * @var Mockery\MockInterface|{$argument->getClass()->getShortName()}
	 */
	protected \${$argument->getName()};
TPL;
			}
		);
	}

	private static function generate_create_mock_statements( array $constructor_arguments ) {
		return self::combine(
			$constructor_arguments,
			function( $argument ) {
				return '$this->' . $argument->getName() . ' = Mockery::mock( ' . $argument->getClass()->getShortName() . '::class );';
			}
		);
	}

	private static function generate_instance_argument_statements( array $constructor_arguments ) {
		$statements = \array_map(
			function( $argument ) {
				return '$this->' . $argument->getName();
			},
			$constructor_arguments
		);
		return \implode( ',' . PHP_EOL, $statements );
	}

	private static function combine( $arguments, $callback ) {
		return \array_reduce(
			$arguments,
			static function( $combined, $argument ) use ( $callback ) {
				$property = $callback( $argument );

				return $combined . $property . PHP_EOL;
			}
		);
	}
}
