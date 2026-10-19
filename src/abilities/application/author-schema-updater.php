<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Social_Profiles_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Application service that updates the author schema settings of a user.
 *
 * Social profiles are saved through the social profiles helper, so they are validated exactly like they are
 * in the first-time configuration. The other settings are saved by the repository they are registered with in the
 * field map.
 */
class Author_Schema_Updater extends Abstract_Fields_Updater {

	/**
	 * The user meta key of the X username.
	 *
	 * @var string
	 */
	private const X_USERNAME = 'twitter';

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
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Constructor.
	 *
	 * @param Author_Schema_Field_Map $field_map              The author schema field map.
	 * @param Social_Profiles_Helper  $social_profiles_helper The social profiles helper.
	 * @param Options_Helper          $options_helper         The options helper.
	 * @param User_Helper             $user_helper            The user helper.
	 */
	public function __construct(
		Author_Schema_Field_Map $field_map,
		Social_Profiles_Helper $social_profiles_helper,
		Options_Helper $options_helper,
		User_Helper $user_helper
	) {
		$this->field_map              = $field_map;
		$this->social_profiles_helper = $social_profiles_helper;
		$this->options_helper         = $options_helper;
		$this->user_helper            = $user_helper;
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
	 * @param array<string, mixed> $input   The author schema settings to change, keyed by field name.
	 *
	 * @return array<string, mixed>|WP_Error The new author schema settings, plus a warning when some could not be changed,
	 *                                       or an error when the user does not exist.
	 */
	public function update( int $user_id, array $input ) {
		if ( \get_userdata( $user_id ) === false ) {
			return new WP_Error(
				'yoast_seo_user_not_found',
				\__( 'No user exists with the given ID.', 'wordpress-seo' ),
				[ 'status' => 404 ],
			);
		}

		$fields = $this->field_map->get_fields();
		$update = $this->update_fields( $fields, $this->field_map->get_validators(), $input, [ 'user_id' => $user_id ] );

		if ( $update['saved_any'] ) {
			// Like saving the user profile page does, so the author sitemap gets the right last modified date.
			$this->user_helper->update_meta( $user_id, '_yoast_wpseo_profile_updated', \time() );
		}

		$result = \array_merge( [ 'user_id' => $user_id ], $this->get_settings( $user_id, $fields ) );

		if ( $update['warning'] !== null ) {
			$result['warning'] = $update['warning'];
		}

		return $result;
	}

	/**
	 * Saves a single field.
	 *
	 * Person social profiles are saved through the social profiles helper, so they are validated like they are
	 * in the first-time configuration, including the ones that add-ons register there. The other fields are
	 * saved by their repository.
	 *
	 * @param string               $field_name The name of the field.
	 * @param mixed                $value      The value to save.
	 * @param array<string, mixed> $context    The ID of the user, under 'user_id'.
	 *
	 * @return bool Whether the field was saved as provided.
	 */
	protected function save_field( string $field_name, $value, array $context ): bool {
		$user_id    = $context['user_id'];
		$repository = $this->field_map->get_repositories()[ $field_name ];

		if ( \array_key_exists( $field_name, $this->social_profiles_helper->get_person_social_profile_fields() ) ) {
			if ( $field_name === self::X_USERNAME ) {
				$value = $this->get_x_username( $value );
			}

			// One profile at a time, as the helper saves none of the provided profiles when one of them is invalid.
			if ( $this->social_profiles_helper->set_person_social_profiles( $user_id, [ $field_name => $value ] ) !== [] ) {
				return false;
			}

			// The helper only reports invalid profiles, not failed saves, so the stored value is checked instead.
			return $repository->get( $user_id, $field_name ) === $value;
		}

		return $repository->save( $user_id, $field_name, $value );
	}

	/**
	 * Returns the X username from an X username, with or without a leading @, or profile URL, cleaned up like the
	 * organization's X username.
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
	 * Returns the current value of each field, read from its repository and cast to the type its schema declares.
	 *
	 * @param int                                 $user_id The ID of the user.
	 * @param array<string, array<string, mixed>> $fields  The JSON schema of each field, keyed by field name.
	 *
	 * @return array<string, mixed> The current value of each field.
	 */
	private function get_settings( int $user_id, array $fields ): array {
		$settings     = [];
		$repositories = $this->field_map->get_repositories();

		foreach ( $fields as $field_name => $schema ) {
			$settings[ $field_name ] = $this->cast_to_schema_type( $repositories[ $field_name ]->get( $user_id, $field_name ), $schema );
		}

		return $settings;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
