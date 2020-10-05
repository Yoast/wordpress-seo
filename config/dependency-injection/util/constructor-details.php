<?php

namespace Yoast\WP\SEO\Dependency_Injection\Util;

/**
 * Helper class to wrap the reflected constructor.
 */
class Constructor_Details {

	/**
	 * Represents the class containing a constructor with a splat parameter.
	 *
	 * @var string
	 */
	public $target_class_name;

	/**
	 * Represents the constructor function.
	 *
	 * @var \ReflectionMethod
	 */
	public $constructor;

	/**
	 * Represents the constructor parameter.
	 *
	 * @var ReflectionParameter
	 */
	public $splat_argument;

	/**
	 * Represents the constructor parameter's type.
	 *
	 * @var ReflectionParameterType
	 */
	public $splat_argument_type;
}
