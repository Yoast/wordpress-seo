<?php

namespace Yoast\WP\SEO\Helpers;

use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * The sanitization helper class.
 */
class Sanitization_Helper {

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
	 * Constructs a sanitization helper instance.
	 *
	 * @param ContainerInterface $container The container interface.
	 * @param String_Helper      $string    The string helper.
	 */
	public function __construct( ContainerInterface $container, String_Helper $string ) {
		$this->container = $container;
		$this->string    = $string;
	}

	/**
	 * Sanitizes a value to follow a certain prescription.
	 *
	 * @param mixed  $value       The value to validate.
	 * @param string $sanitize_as What to sanitize as.
	 *
	 * @return mixed The sanitized value.
	 */
	public function sanitize_as( $value, $sanitize_as ) {
		$sanitizer         = $this->string->to_pascal_case( $sanitize_as );
		$class             = "Yoast\WP\SEO\Sanitizers\\{$sanitizer}_Sanitizer";
		$sanitize_instance = $this->container->get( $class );

		return $sanitize_instance->sanitize( $value );
	}
}
