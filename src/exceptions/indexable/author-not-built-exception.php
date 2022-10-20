<?php

namespace Yoast\WP\SEO\Exceptions\Indexable;

/**
 * For when an author indexable is not being built.
 */
class Author_Not_Built_Exception extends Not_Built_Exception {

	/**
	 * Named constructor for creating an Author_Not_Built_Exception
	 * when author archives are disabled for users without posts.
	 *
	 * @param string $user_id The user id.
	 *
	 * @return Author_Not_Built_Exception The exception.
	 */
	public static function author_archives_are_disabled_for_users_without_posts( $user_id ) {
		return new Author_Not_Built_Exception(
			'Indexable for author with id ' . $user_id . ' is not being built, since author archives are disabled for users without posts.'
		);
	}

	/**
	 * Named constructor for creating an Author_Not_Built_Exception
	 * when author archives are disabled.
	 *
	 * @param string $user_id The user id.
	 *
	 * @return Author_Not_Built_Exception The exception.
	 */
	public static function author_archives_are_disabled( $user_id ) {
		return new Author_Not_Built_Exception(
			'Indexable for author with id ' . $user_id . ' is not being built, since author archives are disabled.'
		);
	}

	/**
	 * Named constructor for creating an Author_Not_Built_Exception
	 * when author archives are disabled for the user with the given id.
	 *
	 * @param string $user_id The user id.
	 *
	 * @return Author_Not_Built_Exception The exception.
	 */
	public static function author_archives_are_disabled_for_user( $user_id ) {
		return new Author_Not_Built_Exception(
			'Indexable for author with id ' . $user_id . ' is not being built, since author archives are disabled for this user.'
		);
	}
}
