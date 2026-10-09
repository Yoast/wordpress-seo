<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Helpers\Social_Profiles_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Application service that updates the author schema settings of a user.
 *
 * Social profiles are saved through the social profiles helper, so they are validated exactly like they are
 * in the first-time configuration. The other settings are sanitized like they are on the user profile page.
 */
class Author_Schema_Updater {

	/**
	 * The user meta key of the X username.
	 *
	 * @var string
	 */
	private const X_USERNAME = 'twitter';

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * The author schema field map.
	 *
	 * @var Author_Schema_Field_Map
	 */
	private $field_map;

	/**
	 * The social profiles helper.
	 *
	 * @var Social_Profiles_Helper
	 */
	private $social_profiles_helper;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The sanitization helper.
	 *
	 * @var Sanitization_Helper
	 */
	private $sanitization_helper;

	/**
	 * Constructor.
	 *
	 * @param User_Helper             $user_helper            The user helper.
	 * @param Author_Schema_Field_Map $field_map              The author schema field map.
	 * @param Social_Profiles_Helper  $social_profiles_helper The social profiles helper.
	 * @param Options_Helper          $options_helper         The options helper.
	 * @param Sanitization_Helper     $sanitization_helper    The sanitization helper.
	 */
	public function __construct(
		User_Helper $user_helper,
		Author_Schema_Field_Map $field_map,
		Social_Profiles_Helper $social_profiles_helper,
		Options_Helper $options_helper,
		Sanitization_Helper $sanitization_helper
	) {
		$this->user_helper            = $user_helper;
		$this->field_map              = $field_map;
		$this->social_profiles_helper = $social_profiles_helper;
		$this->options_helper         = $options_helper;
		$this->sanitization_helper    = $sanitization_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through the filter can hold any user meta value.

	/**
	 * Updates the author schema settings of a user in the input and returns the new state of all of them.
	 *
	 * Only fields present in the input are changed (patch semantics), so an input without fields only reads
	 * the settings. Settings that cannot be applied or saved are reported in a warning, while the other
	 * settings are still saved.
	 *
	 * @param int                  $user_id The ID of the user.
	 * @param array<string, mixed> $input   The author schema settings to change, keyed by user meta key.
	 *
	 * @return array<string, mixed>|WP_Error The new author schema settings, plus a warning when some could not be changed,
	 *                                       or an error when the user does not exist.
	 */
	public function update( int $user_id, array $input ) {
		if ( ! $this->user_helper->user_exists( $user_id ) ) {
			return new WP_Error(
				'yoast_seo_user_not_found',
				\__( 'No user exists with the given ID.', 'wordpress-seo' ),
				[ 'status' => 404 ],
			);
		}

		$fields    = $this->field_map->get_fields();
		$warnings  = [];
		$saved_any = false;

		foreach ( \array_keys( \array_intersect_key( $fields, $input ) ) as $field_name ) {
			$warning = $this->update_field( $user_id, $field_name, $input[ $field_name ] );
			if ( $warning === null ) {
				$saved_any = true;
				continue;
			}

			$warnings[] = $warning;
		}

		$result = \array_merge( [ 'user_id' => $user_id ], $this->get_settings( $user_id, $fields ) );

		if ( $warnings !== [] ) {
			$warnings[]        = ( $saved_any ) ? \__( 'The other settings were saved.', 'wordpress-seo' ) : \__( 'No other settings were saved.', 'wordpress-seo' );
			$result['warning'] = \implode( ' ', $warnings );
		}

		return $result;
	}

	/**
	 * Validates and saves a single field.
	 *
	 * @param int    $user_id    The ID of the user.
	 * @param string $field_name The user meta key of the field.
	 * @param mixed  $value      The value to save.
	 *
	 * @return string|null A warning when the field could not be saved, null otherwise.
	 */
	private function update_field( int $user_id, string $field_name, $value ): ?string {
		$warning = $this->validate_field( $field_name, $value );
		if ( $warning !== null ) {
			return $warning;
		}

		if ( ! $this->save_field( $user_id, $field_name, $value ) ) {
			// A failed save is also reported when the value was invalid or got sanitized into something else,
			// so the warning points to the returned value rather than claiming nothing was stored.
			return \sprintf(
				/* translators: %s expands to the name of a setting. */
				\__( 'The %s setting could not be saved as provided, so its current value is returned.', 'wordpress-seo' ),
				$field_name,
			);
		}

		return null;
	}

	/**
	 * Validates a single field with the validator it is registered with in the field map, if any.
	 *
	 * @param string $field_name The user meta key of the field.
	 * @param mixed  $value      The value to save.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	private function validate_field( string $field_name, $value ): ?string {
		$validators = $this->field_map->get_validators();
		if ( ! isset( $validators[ $field_name ] ) ) {
			return null;
		}

		$warning = \call_user_func( $validators[ $field_name ], $value, $field_name );

		// Anything but a non-empty string cannot be relayed as a warning, so the value is saved instead.
		if ( ! \is_string( $warning ) || $warning === '' ) {
			return null;
		}

		return $warning;
	}

	/**
	 * Saves a single field.
	 *
	 * Person social profiles are saved through the social profiles helper, so they are validated like they are
	 * in the first-time configuration, including the ones that add-ons register there. The other fields are
	 * sanitized like the user profile page does.
	 *
	 * @param int    $user_id    The ID of the user.
	 * @param string $field_name The user meta key of the field.
	 * @param mixed  $value      The value to save.
	 *
	 * @return bool Whether the field was saved as provided.
	 */
	private function save_field( int $user_id, string $field_name, $value ): bool {
		if ( \array_key_exists( $field_name, $this->social_profiles_helper->get_person_social_profile_fields() ) ) {
			if ( $field_name === self::X_USERNAME ) {
				$value = $this->get_x_username( $value );
			}

			// One profile at a time, as the helper saves none of the provided profiles when one of them is invalid.
			return $this->social_profiles_helper->set_person_social_profiles( $user_id, [ $field_name => $value ] ) === [];
		}

		$this->user_helper->update_meta( $user_id, $field_name, $this->sanitization_helper->sanitize_text_field( $value ) );

		// Updating user meta also returns false when the value did not change, so the stored value is checked instead.
		return $this->user_helper->get_meta( $user_id, $field_name, true ) === $value;
	}

	/**
	 * Returns the X username from an X username or profile URL.
	 *
	 * Unlike the organization's X username, the user's one is not cleaned up when saved, while the schema and
	 * the meta tags expect a username.
	 *
	 * @param string $value The X username or profile URL.
	 *
	 * @return string The X username, or the value as provided when it is empty or not valid, for the social
	 *                profiles helper to reject.
	 */
	private function get_x_username( string $value ): string {
		if ( $value === '' ) {
			return $value;
		}

		$x_username = $this->options_helper->get_twitter_id( $value );

		return ( \is_string( $x_username ) ) ? $x_username : $value;
	}

	/**
	 * Returns the current value of each field, cast to the type its schema declares.
	 *
	 * @param int                                 $user_id The ID of the user.
	 * @param array<string, array<string, mixed>> $fields  The JSON schema of each field, keyed by user meta key.
	 *
	 * @return array<string, mixed> The current value of each field.
	 */
	private function get_settings( int $user_id, array $fields ): array {
		$settings = [];

		foreach ( $fields as $field_name => $schema ) {
			$value = $this->user_helper->get_meta( $user_id, $field_name, true );

			// Unset user meta comes back as an empty string, which is not always of the declared type.
			switch ( ( $schema['type'] ?? null ) ) {
				case 'integer':
					$value = (int) $value;
					break;
				case 'string':
					$value = (string) $value;
					break;
			}

			$settings[ $field_name ] = $value;
		}

		return $settings;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
