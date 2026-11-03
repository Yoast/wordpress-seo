<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

/**
 * Base class for the abilities that read or write the SEO data of an author archive.
 */
abstract class Abstract_Author_SEO_Data_Ability extends Abstract_SEO_Data_Ability {

	/**
	 * Checks whether the current user can edit the advanced SEO metadata of other users.
	 *
	 * The user profile only shows these fields to users who can edit users, so this keeps the abilities away from
	 * users who could never use them. The capability helper is not used for edit_users, as it lets SEO managers pass.
	 *
	 * @return bool Whether the current user can edit the advanced SEO metadata of other users.
	 */
	public function can_edit_users_advanced_metadata(): bool {
		return $this->can_edit_advanced_metadata() && \current_user_can( 'edit_users' );
	}
}
