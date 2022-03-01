<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Settings_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Not_In_Array_Exception;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * The in array provider validator class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Validator should not count.
 */
class In_Array_Provider_Validator extends In_Array_Validator {

	/**
	 * The setting' provider key.
	 *
	 * @var string
	 */
	const PROVIDER_KEY = 'provider';

	/**
	 * The setting' provider class key.
	 *
	 * Should represent the class of the provider.
	 *
	 * @var string
	 */
	const CLASS_KEY = 'class';

	/**
	 * The setting' provider method key.
	 *
	 * Should represent the name of the class method to call.
	 *
	 * @var string
	 */
	const METHOD_KEY = 'method';

	/**
	 * The setting' provider arguments key.
	 *
	 * Should contain the arguments that should be passed to the method.
	 *
	 * @var string
	 */
	const ARGUMENTS_KEY = 'arguments';

	/**
	 * Holds the dependency injection container interface instance.
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * Constructs an in array provider validation instance.
	 *
	 * @param ContainerInterface $container The container interface.
	 */
	public function __construct( ContainerInterface $container ) {
		$this->container = $container;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Reason: The parent validate can throw too.

	/**
	 * Validates if a value is in the allow-list.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Missing_Settings_Key_Exception When settings are missing.
	 * @throws Invalid_Settings_Exception When the settings are invalid.
	 * @throws Not_In_Array_Exception When the value is not in the allow-list.
	 *
	 * @return mixed A valid value.
	 */
	public function validate( $value, array $settings = null ) {
		if ( $settings === null ) {
			throw new Missing_Settings_Key_Exception( self::ALLOW_KEY );
		}

		if ( ! \array_key_exists( self::PROVIDER_KEY, $settings ) ) {
			throw new Missing_Settings_Key_Exception( self::PROVIDER_KEY );
		}

		$provider = $settings[ self::PROVIDER_KEY ];

		if (
			! \is_array( $settings[ self::PROVIDER_KEY ] )
			|| ! \array_key_exists( self::CLASS_KEY, $provider )
			|| ! \array_key_exists( self::METHOD_KEY, $provider )
		) {
			throw new Invalid_Settings_Exception();
		}

		if ( ! $this->container->has( $provider[ self::CLASS_KEY ] ) ) {
			throw new Invalid_Settings_Exception();
		}

		$instance = $this->container->get( $provider[ self::CLASS_KEY ] );
		if ( \array_key_exists( self::ARGUMENTS_KEY, $provider ) && \is_array( $provider[ self::ARGUMENTS_KEY ] ) ) {
			$values = \call_user_func_array(
				[
					$instance,
					$provider[ self::METHOD_KEY ],
				],
				$provider[ self::ARGUMENTS_KEY ]
			);
		}
		else {
			$values = \call_user_func( [ $instance, $provider[ self::METHOD_KEY ] ] );
		}

		if ( ! \is_array( $values ) ) {
			throw new Invalid_Settings_Exception();
		}

		return parent::validate( $value, [ parent::ALLOW_KEY => $values ] );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}
