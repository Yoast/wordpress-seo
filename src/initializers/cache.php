<?php


namespace Yoast\WP\SEO\Initializers;

class Cache {

	/**
	 * @var TKey
	 */
	protected $value;

	/**
	 * The function to get a fresh value
	 *
	 * @var function
	 */
	protected $getter;

	// create a cache class with a property name and a function to get the value;
	// essentially if ( ! isset cache[ $prop ] ) cache [ $ prop] = getter(); return cache [ $prop ];
}
