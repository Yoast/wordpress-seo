<?php

namespace Yoast\WP\SEO\Indexables\Domain;

class Plugin_Deactivated_Timestamp {

	/**
	 * Timestamp representing when the plugin was deactivated.
	 *
	 * @var string $timestamp
	 */
	private $timestamp;

	/**
	 * The constructor.
	 *
	 * @param string $timestamp
	 */
	public function __construct( string $timestamp ) {
		$this->timestamp = $timestamp;
	}
}
