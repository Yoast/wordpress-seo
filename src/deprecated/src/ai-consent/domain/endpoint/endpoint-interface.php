<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Consent\Domain\Endpoint;

interface Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @return string
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_name(): string;

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_namespace(): string;

	/**
	 * Gets the route.
	 *
	 * @return string
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_route(): string;

	/**
	 * Gets the URL.
	 *
	 * @return string
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_url(): string;
}
