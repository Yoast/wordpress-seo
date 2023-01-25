// See https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
	/**
	 * Will throw an error if there are uncommitted changes.
	 *
	 * @param {*}        error     A potential error in calling in the git status --porcelain command.
	 * @param {*}        stdout    The response if no errors.
	 * @param {*}        stderr    A stderr.
	 * @param {Function} callback  The callback function.
	 *
	 * @returns {void}
	 */
	function throwUncommittedChangesError( error, stdout, stderr, callback ) {
		if ( stdout ) {
			throw "You have uncommitted changes. Commit, stash or reset the above files.";
		} else {
			grunt.log.ok( "You have no uncommitted changes. Continuing..." );
		}
		callback();
	}

	return {
		webpack: {
			command: "cross-env NODE_ENV=development yarn run wp-scripts build --config config/webpack/webpack.config.js",
		},

		"webpack-prod": {
			command: "yarn run wp-scripts build --config config/webpack/webpack.config.js",
		},

		"webpack-watch": {
			command: "yarn run wp-scripts start --config config/webpack/webpack.config.js",
		},

		"composer-install-production": {
			command: "composer install --prefer-dist --optimize-autoloader --no-dev --no-scripts",
		},

		"composer-install": {
			command: "composer install",
		},

		"composer-update-yoast-dependencies": {
			command: "composer update yoast/license-manager yoast/i18n-module",
		},

		"compile-dependency-injection-container": {
			command: "composer compile-di",
		},

		"remove-dependency-injection-meta": {
			command: "rm ./src/generated/container.php.meta",
		},

		"php-lint": {
			command: "composer lint-branch",
		},

		phpcs: {
			command: "composer check-branch-cs",
		},

		"unlink-monorepo": {
			command: "yarn unlink-monorepo",
		},

		"get-monorepo-versions": {
			command: "yarn list --pattern 'yoastseo|yoast-components' --depth=0",
		},

		"install-schema-blocks": {
			command: "cd packages/schema-blocks && yarn install && yarn build && cd ../..",
		},
		"build-ui-library": {
			command: "cd packages/ui-library && yarn build && cd ../..",
		},

		"check-for-uncommitted-changes": {
			// --porcelain gives the output in an easy-to-parse format for scripts.
			command: "git status --porcelain",
			options: {
				callback: throwUncommittedChangesError,
			},
		},

		"readme-reset-txt": {
			command: "git checkout readme.txt",
			options: {
				failOnError: false,
			},
		},

		"postcss-dev": {
			command: "yarn build:css:dev",
		},
		"postcss-release": {
			command: "yarn build:css",
		},
	};
	/* eslint-enable require-jsdoc */
};
