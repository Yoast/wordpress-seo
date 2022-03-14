<?php

namespace Yoast\WP\SEO\Composer;

use ReflectionClass;
use ReflectionException;
use RuntimeException;

/**
 * Class for generating a unit test scaffold, based on the dependency injection
 * and other conventions of Yoast.
 */
class Unit_Test_Generator {

	/**
	 * Path to the unit test folder.
	 *
	 * @private
	 */
	const UNIT_TESTS_FOLDER = 'tests/unit';

	/**
	 * Path to the unit test folder in Premium.
	 *
	 * @private
	 */
	const UNIT_TESTS_FOLDER_PREMIUM = 'tests/unit/premium';

	/**
	 * Generates a new unit test scaffold for the given class.
	 *
	 * @param string $fully_qualified_class_name The fully qualified class name of the class to generate a unit test for.
	 *
	 * @return string The path to the generated unit test.
	 *
	 * @throws ReflectionException If the class for which to generate a unit test does not exist.
	 * @throws RuntimeException    If there is already a unit test.
	 */
	public function generate( $fully_qualified_class_name ) {
		try {
			$reflector = new ReflectionClass( $fully_qualified_class_name );
		} catch ( ReflectionException $exception ) {
			throw $exception;
		}

		$unit_test_path = $this->generate_file_name( $reflector->getFileName() );

		if ( \file_exists( __DIR__ . '/../../' . $unit_test_path ) ) {
			throw new RuntimeException( \sprintf( 'A unit test already exists at path "%1$s"', $unit_test_path ) );
		}

		$name = $reflector->getShortName();

		$constructor = $reflector->getConstructor();

		if ( ! $constructor ) {
			$use_statements               = '';
			$property_statements          = '';
			$create_mock_statements       = '';
			$instance_argument_statements = '';
		}
		else {
			$constructor_arguments = $constructor->getParameters();

			$use_statements               = $this->generate_use_statements( $constructor_arguments );
			$property_statements          = $this->generate_property_statements( $constructor_arguments );
			$create_mock_statements       = $this->generate_create_mock_statements( $constructor_arguments );
			$instance_argument_statements = $this->generate_instance_argument_statements( $constructor_arguments );
		}

		$namespace = $this->generate_namespace( $fully_qualified_class_name );
		$groups    = $this->generate_groups( $reflector->getFileName() );

		$filled_in_template = $this->unit_test_template(
			$fully_qualified_class_name,
			$name,
			$namespace,
			$use_statements,
			$groups,
			$property_statements,
			$create_mock_statements,
			$instance_argument_statements
		);

		\file_put_contents( __DIR__ . '/../../' . $unit_test_path, $filled_in_template );

		return $unit_test_path;
	}

	/**
	 * Checks if the class is a Premium class.
	 *
	 * @param string $file_path The path to the class for which to generate a unit test.
	 *
	 * @return false|int returns 1 if the unit test is in Premium, 0 if it does not, or FALSE if an error occurred.
	 */
	protected function is_premium_class( $file_path ) {
		return \preg_match( '/\/premium\/src\/.*\.php$/', $file_path );
	}

	/**
	 * Generates the namespace of the test class.
	 *
	 * @param string $fully_qualified_class_name The fully qualified class name of the class under test.
	 *
	 * @return string The namespace of the test class.
	 */
	protected function generate_namespace( $fully_qualified_class_name ) {
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
	protected function generate_file_name( $path ) {
		$matches = [];
		\preg_match( '/\/src\/(.*)\/(.*)\.php$/', $path, $matches );

		$folders = $matches[1];
		$file    = $matches[2];

		$unit_test_folder = $this->is_premium_class( $path ) ? self::UNIT_TESTS_FOLDER_PREMIUM : self::UNIT_TESTS_FOLDER;

		return $unit_test_folder . '/' . $folders . '/' . $file . '-test.php';
	}

	/**
	 * Generates the unit test groups to use in the unit test.
	 *
	 * @param string $path The path to the class.
	 *
	 * @return string The groups.
	 */
	protected function generate_groups( $path ) {
		$matches = [];
		\preg_match( '/\/src\/(.*)\/.*\.php$/', $path, $matches );

		$groups = \explode( '/', $matches[1] );

		$groups = \array_map(
			static function( $group ) {
				return ' * @group ' . $group;
			},
			$groups
		);

		return \implode( \PHP_EOL, $groups );
	}

	/**
	 * Generates a unit test scaffold based on the given parameters.
	 *
	 * @param string $fully_qualified_class_name   The fully qualified class name of the class that is tested.
	 * @param string $name                         The name of the class that is tested.
	 * @param string $class_namespace              The namespace of the test class.
	 * @param string $use_statements               The use statements, one for each mocked constructor argument.
	 * @param string $groups                       The unit test groups.
	 * @param string $property_statements          The property statements, one for each mocked constructor argument.
	 * @param string $create_mock_statements       The creation statements, one for each mocked constructor argument.
	 * @param string $instance_argument_statements The arguments given to the instance constructor,
	 *                                             one for each mocked constructor argument.
	 *
	 * @return string The generated unit test scaffold.
	 */
	protected function unit_test_template(
		$fully_qualified_class_name,
		$name,
		$class_namespace,
		$use_statements,
		$groups,
		$property_statements,
		$create_mock_statements,
		$instance_argument_statements
	) {
		return <<<TPL
<?php

namespace Yoast\WP\SEO\Tests\Unit\\{$class_namespace};

use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use {$fully_qualified_class_name};

{$use_statements}

/**
 * Class {$name}_Test.
 *
{$groups}
 *
 * @coversDefaultClass \\{$fully_qualified_class_name}
 */
class {$name}_Test extends TestCase {

{$property_statements}

	/**
	 * The instance under test.
	 *
	 * @var {$name}
	 */
	protected \$instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		{$create_mock_statements}

		\$this->instance = new {$name}(
			{$instance_argument_statements}
		);
	}
}

TPL;
	}

	/**
	 * Generates `use` statements for each of the given constructor arguments.
	 *
	 * @param array $constructor_arguments The constructor arguments.
	 *
	 * @return string The generated use statements.
	 */
	protected function generate_use_statements( array $constructor_arguments ) {
		$statements = \array_map(
			static function( $argument ) {
				try {
					return 'use ' . $argument->getClass()->getName() . ';';
				} catch ( ReflectionException $exception ) {
					return 'use ' . $argument->getClass()->getShortName() . ';';
				}
			},
			$constructor_arguments
		);

		return \implode( \PHP_EOL, $statements );
	}

	/**
	 * Generates property statements for the given array of arguments.
	 *
	 * @param array $constructor_arguments The array of constructor arguments.
	 *
	 * @return string The generated property statements.
	 */
	protected function generate_property_statements( array $constructor_arguments ) {
		$statements = \array_map(
			static function( $argument ) {
				return self::generate_mocked_property_statement( $argument->getClass()->getShortName(), $argument->getName() );
			},
			$constructor_arguments
		);

		return \implode( \PHP_EOL . \PHP_EOL, $statements );
	}

	/**
	 * Generates a property statement of the given name, with as its type the given class and `Mockery\MockInterface`.
	 *
	 * @param string $class_name    The class for which to generate a property.
	 * @param string $property_name The name of the property.
	 *
	 * @return string The generated property statement.
	 */
	protected function generate_mocked_property_statement( $class_name, $property_name ) {
		return <<<TPL
	/**
	 * {$class_name} mock.
	 *
	 * @var Mockery\MockInterface|{$class_name}
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
	protected function generate_create_mock_statements( array $constructor_arguments ) {
		$statements = \array_map(
			static function( $argument ) {
				return '$this->' . $argument->getName() . ' = Mockery::mock( ' . $argument->getClass()->getShortName() . '::class );';
			},
			$constructor_arguments
		);

		return \implode( \PHP_EOL . "\t\t", $statements );
	}

	/**
	 * Generates the arguments for constructing the instance under test.
	 *
	 * @param array $constructor_arguments The array of constructor arguments.
	 *
	 * @return string The generated arguments to give the instance.
	 */
	protected function generate_instance_argument_statements( array $constructor_arguments ) {
		$statements = \array_map(
			static function( $argument ) {
				return '$this->' . $argument->getName();
			},
			$constructor_arguments
		);

		return \implode( ',' . \PHP_EOL . "\t\t\t", $statements );
	}
}
