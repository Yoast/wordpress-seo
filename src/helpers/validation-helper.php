<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * The validation helper class.
 *
 * Use this on values that are returned by the sanitization helper.
 */
class Validation_Helper {

	/**
	 * Holds the dependency injection container interface instance.
	 *
	 * @var ContainerInterface
	 */
	private $container;

	/**
	 * Holds the string helper instance.
	 *
	 * @var String_Helper
	 */
	private $string;

	/**
	 * Constructs a validation helper instance.
	 *
	 * @param ContainerInterface $container The container interface.
	 * @param String_Helper      $string    The string helper.
	 */
	public function __construct( ContainerInterface $container, String_Helper $string ) {
		$this->container = $container;
		$this->string    = $string;
	}

	/**
	 * Validates a value.
	 *
	 * @param mixed $value The value to validate.
	 * @param array $types What to validate as.
	 *
	 * @throws Abstract_Validation_Exception When no type deemed the value valid.
	 *
	 * @return mixed A valid value.
	 */
	public function validate_as( $value, array $types ) {
		$last_exception = null;
		foreach ( $types as $type => $settings ) {
			/*
			 * Allows for the types array to specify settings.
			 * E.g. [ 'without', 'with' => 'settings' ]
			 * Which is really like [ 0 => 'without', 'with' => 'settings' ]
			 */
			if ( ! \is_string( $type ) ) {
				$type     = $settings;
				$settings = null;
			}

			$name  = $this->string->to_pascal_case( $type );
			$class = "Yoast\WP\SEO\Validators\\{$name}_Validator";

			// Unknown validator requested, skip this type.
			if ( ! $this->container->has( $class ) ) {
				continue;
			}
			$instance = $this->container->get( $class );

			try {
				return $instance->validate( $value, $settings );
			} catch ( Abstract_Validation_Exception $exception ) {
				// Remember this exception, as the next type might succeed.
				$last_exception = $exception;
			}
		}

		// No valid type found, re-throw the last exception.
		if ( $last_exception !== null ) {
			throw $last_exception;
		}

		// No types given.
		return $value;
	}
}
