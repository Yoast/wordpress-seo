<?php

namespace Yoast\WP\SEO\Helpers;

use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * A helper object for validation.
 */
class Validation_Helper {

	/** @var ContainerInterface Container interface. */
	private $container;

	/** @var String_Helper String helper. */
	private $string;

	public function __construct( ContainerInterface $container, String_Helper $string ) {
		$this->container = $container;
		$this->string    = $string;
	}

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
