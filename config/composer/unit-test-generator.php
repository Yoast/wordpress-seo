<?php

/**
 * Class for generating a unit test scaffold, based on the dependency injection
 * and other conventions of Yoast.
 */
class Unit_Test_Generator {

	/**
	 * Generates a new unit test scaffold for the given class.
	 *
	 * @param string $fully_qualified_class_name The fully qualified class name of the class to generate a unit test for.
	 *
	 * @throws ReflectionException If the class for which to generate a unit test does not exist.
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

	/**
	 * Generates the namespace of the test class.
	 *
	 * @param string $fully_qualified_class_name The fully qualified class name of the class under test.
	 *
	 * @return string The namespace of the test class.
	 */
	private static function generate_namespace( $fully_qualified_class_name ) {
		$matches = [];
		\preg_match( '/Yoast\\\WP\\\SEO\\\(.*)\\\.*$/', $fully_qualified_class_name, $matches );

		return $matches[1];
	}

	/**
	 * Generates the file name of the test class.
	 *
	 * @param string $path The path of the class under test.
	 *
	 * @return string The file name of the test class.
	 */
	private static function generate_file_name( $path ) {
		$matches = [];
		\preg_match( '/\/src\/(.*)\.php$/', $path, $matches );

		return $matches[1] . '-test.php';
	}

	/**
	 * Generates a unit test scaffold based on the given parameters.
	 *
	 * @param string $fully_qualified_class_name   The fully qualified class name of the class that is tested.
	 * @param string $name                         The name of the class that is tested.
	 * @param string $namespace                    The namespace of the test class.
	 * @param string $use_statements               The use statements, one for each mocked constructor argument.
	 * @param string $property_statements          The property statements, one for each mocked constructor argument.
	 * @param string $create_mock_statements       The creation statements, one for each mocked constructor argument.
	 * @param string $instance_argument_statements The arguments given to the instance constructor,
	 *                                             one for each mocked constructor argument.
	 *
	 * @return string The generated unit test scaffold.
	 */
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

	/**
	 * Generates `use` statements for each of the given constructor arguments.
	 *
	 * @param array $constructor_arguments The constructor arguments.
	 *
	 * @return string The generated use statements.
	 */
	private static function generate_use_statements( array $constructor_arguments ) {
		$statements = \array_map(
			static function( $argument ) {
				return 'use ' . $argument->getClass()->getName() . ';';
			},
			$constructor_arguments
		);

		return \implode( PHP_EOL, $statements );
	}

	/**
	 * Generates property statements for the given array of arguments.
	 *
	 * @param array $constructor_arguments The array of constructor arguments.
	 *
	 * @return string The generated property statements.
	 */
	private static function generate_property_statements( array $constructor_arguments ) {
		$statements = \array_map(
			static function( $argument ) {
				return self::generate_mocked_property_statement( $argument->getClass(), $argument->getName() );
			},
			$constructor_arguments
		);

		return \implode( PHP_EOL . PHP_EOL, $statements );
	}

	/**
	 * Generates a property statement of the given name, with as its type the given class and `Mockery\MockInterface`.
	 *
	 * @param ReflectionClass $class         The class for which to generate a property.
	 * @param string          $property_name The name of the property.
	 *
	 * @return string The generated property statement.
	 */
	private static function generate_mocked_property_statement( ReflectionClass $class, $property_name ) {
		return <<<TPL
	/**
	 * {$class->getShortName()} mock.
	 *
	 * @var Mockery\MockInterface|{$class->getShortName()}
	 */
	protected \${$property_name};
TPL;
	}

	/**
	 * Generates the construction of the mocked class that should be given
	 * to the instance under test.
	 *
	 * @param array $constructor_arguments The array of constructor arguments.
	 *
	 * @return string The generated created mock statements.
	 */
	private static function generate_create_mock_statements( array $constructor_arguments ) {
		$statements = \array_map(
			static function( $argument ) {
				return '$this->' . $argument->getName() . ' = Mockery::mock( ' . $argument->getClass()->getShortName() . '::class );';
			},
			$constructor_arguments
		);

		return \implode( PHP_EOL, $statements );
	}

	/**
	 * Generates the arguments for constructing the instance under test.
	 *
	 * @param array $constructor_arguments The array of constructor arguments.
	 *
	 * @return string The generated arguments to give the instance.
	 */
	private static function generate_instance_argument_statements( array $constructor_arguments ) {
		$statements = \array_map(
			static function( $argument ) {
				return '$this->' . $argument->getName();
			},
			$constructor_arguments
		);

		return \implode( ',' . PHP_EOL, $statements );
	}
}
