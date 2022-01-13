<?php

namespace Yoast\WP\SEO\Helpers;

use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * A helper object for sanitization.
 */
class Sanitization_Helper {

	/** @var ContainerInterface Container interface. */
	private $container;

	/** @var String_Helper String helper. */
	private $string;

	public function __construct( ContainerInterface $container, String_Helper $string ) {
		$this->container = $container;
		$this->string    = $string;
	}

	public function sanitize_as( $value, $sanitize_as ) {
		$sanitizer         = $this->string->to_pascal_case( $sanitize_as );
		$class             = "Yoast\WP\SEO\Sanitizers\\{$sanitizer}_Sanitizer";
		$sanitize_instance = $this->container->get( $class );

		return $sanitize_instance->validate( $value );
	}
}
