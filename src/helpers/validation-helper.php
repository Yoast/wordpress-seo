<?php

namespace Yoast\WP\SEO\Helpers;

use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * The validation helper class.
 */
class Validation_Helper {

	/**
	 * Holds the container interface instance.
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
	 * Validates a value follows a certain prescription.
	 *
	 * @param mixed  $value       The value to validate.
	 * @param string $validate_as What to validate as.
	 *
	 * @return bool Whether the value is valid.
	 */
	public function validate_as( $value, $validate_as ) {
		if ( empty( $validate_as ) ) {
			return true;
		}

		$validator         = $this->string->to_pascal_case( $validate_as );
		$class             = "Yoast\WP\SEO\Validators\\{$validator}_Validator";
		$validate_instance = $this->container->get( $class );

		return $validate_instance->validate( $value );
	}
}
