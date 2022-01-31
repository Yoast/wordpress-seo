<?php

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Utils;
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

	/**
	 * Emulate the WP native sanitize_text_field function in a %%variable%% safe way.
	 *
	 * @codeCoverageIgnore We have to write test when this method contains own code.
	 *
	 * @param string $value String value to sanitize.
	 *
	 * @return string The sanitized string.
	 */
	public function sanitize_text_field( $value ) {
		return WPSEO_Utils::sanitize_text_field( $value );
	}

	/**
	 * Sanitize a url for saving to the database.
	 * Not to be confused with the old native WP function.
	 *
	 * @codeCoverageIgnore We have to write test when this method contains own code.
	 *
	 * @param string $value             String URL value to sanitize.
	 * @param array  $allowed_protocols Optional set of allowed protocols.
	 *
	 * @return string The sanitized URL.
	 */
	public function sanitize_url( $value, $allowed_protocols = [ 'http', 'https' ] ) {
		return WPSEO_Utils::sanitize_url( $value, $allowed_protocols );
	}
}
