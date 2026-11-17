<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Surfaces\Values;

use Yoast\WP\SEO\Surfaces\Values\Meta;

/**
 * A Meta double that returns canned rendered values through its getter.
 *
 * The real Meta resolves properties through presenters and rejects writes, so this
 * lightweight subclass overrides the getter instead of mocking it.
 */
final class Meta_Double extends Meta {

	/**
	 * The canned rendered values, keyed by property name.
	 *
	 * @var array<string, string>
	 */
	private $rendered_values;

	/**
	 * Constructor.
	 *
	 * @param array<string, string> $values The canned rendered values, keyed by Meta property name.
	 */
	public function __construct( array $values ) {
		$this->rendered_values = $values;
	}

	/**
	 * Returns the canned rendered value for a property.
	 *
	 * @param string $name The property name.
	 *
	 * @return string|null The canned value, or null when not set.
	 */
	public function __get( $name ) {
		return ( $this->rendered_values[ $name ] ?? null );
	}
}
