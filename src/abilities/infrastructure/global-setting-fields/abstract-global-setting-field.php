<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Fields;

use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Field_Interface;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;

/**
 * Shared base for the global setting fields: a field is stored in one option per target that has it.
 */
abstract class Abstract_Global_Setting_Field implements Global_Setting_Field_Interface {

	/**
	 * Returns the option pattern of each target that has the field, keyed by target name.
	 *
	 * The target turns the pattern into the name of the option, like the content type archive filling in its post
	 * type for the %s placeholder.
	 *
	 * @return array<string, string> The option pattern of each target, keyed by target name.
	 */
	abstract protected function get_option_patterns(): array;

	/**
	 * Returns the option the field is stored in for a target.
	 *
	 * @param Global_Setting_Target_Interface $target The target.
	 *
	 * @return string|null The option name, or null when the target does not have the field.
	 */
	public function get_option_name( Global_Setting_Target_Interface $target ): ?string {
		$option_pattern = ( $this->get_option_patterns()[ $target->get_name() ] ?? null );
		if ( $option_pattern === null ) {
			return null;
		}

		return $target->format_option_name( $option_pattern );
	}
}
