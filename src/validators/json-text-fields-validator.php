<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Json_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Helpers\Json_Helper;

/**
 * The JSON text fields validator class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Validator is not part of the name.
 */
class Json_Text_Fields_Validator extends String_Validator {

	/**
	 * Holds the regex validator instance.
	 *
	 * @var Text_Field_Validator
	 */
	protected $text_field_validator;

	/**
	 * Holds the array validator instance.
	 *
	 * @var Array_Validator
	 */
	protected $array_validator;

	/**
	 * Holds the JSON helper instance.
	 *
	 * @var Json_Helper
	 */
	protected $json_helper;

	/**
	 * Constructs a JSON text fields validator instance.
	 *
	 * @param Text_Field_Validator $text_field_validator The regex validator.
	 * @param Array_Validator      $array_validator      The array validator.
	 * @param Json_Helper          $json_helper          The JSON helper.
	 */
	public function __construct( Text_Field_Validator $text_field_validator, Array_Validator $array_validator, Json_Helper $json_helper ) {
		$this->text_field_validator = $text_field_validator;
		$this->array_validator      = $array_validator;
		$this->json_helper          = $json_helper;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Reason: The string, array and text field validates can throw too.

	/**
	 * Validates if a value is stringified JSON and the values as text fields.
	 *
	 * @param mixed      $value    The value to validate.
	 * @param array|null $settings Optional settings.
	 *
	 * @throws Invalid_Type_Exception When the type of the value is not a string or the type of the decoded string is
	 *                                not an array.
	 * @throws Invalid_Json_Exception When an error occurred during decoding or encoding of JSON.
	 *
	 * @return string A valid stringified JSON containing text fields.
	 */
	public function validate( $value, array $settings = null ) {
		$string = parent::validate( $value, $settings );

		$decoded = \json_decode( $string, true );
		if ( \json_last_error() !== \JSON_ERROR_NONE ) {
			throw new Invalid_Json_Exception();
		}

		$array = $this->array_validator->validate( $decoded );

		$sanitized = [];
		foreach ( $array as $key => $value ) {
			$sanitized[ $this->text_field_validator->validate( $key ) ] = $this->text_field_validator->validate( $value );
		}

		$json = $this->json_helper->format_encode( $sanitized );
		if ( ! $json ) {
			throw new Invalid_Json_Exception();
		}

		return $json;
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}
