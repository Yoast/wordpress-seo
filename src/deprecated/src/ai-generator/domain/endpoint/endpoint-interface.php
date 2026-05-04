<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Generator\Domain\Endpoint;

interface Endpoint_Interface {

	/**
	 * Gets the name.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_name(): string;

	/**
	 * Gets the namespace.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_namespace(): string;

	/**
	 * Gets the route.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_route(): string;

	/**
	 * Gets the URL.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_url(): string;
}
