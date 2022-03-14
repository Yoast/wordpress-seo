// See https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
	/**
	 * Gets the bash command to get make pot files for this package.
	 *
	 * @returns {string} The bash command to get make pot files for this package.
	 */
	function makePotCommand() {
		var files;

		files = [ "src/**/*.js" ];
		files = grunt.file.expand( files );

		return "xgettext" +
			" --default-domain=<%= shell.makepot.textdomain %>" +
			" -o <%= shell.makepot.potFile %>" +
			" --package-version=<%= pkg.version %> --package-name=<%= pkg.name %>" +
			" --force-po" +
			" --from-code=UTF-8" +
			" --add-comments=\"translators: \"" +
			" --add-comments=\"Translators: \"" +
			" " + files.join( " " );
	}

	/**
	 * Gets the bash command to get the current branch of the repository.
	 *
	 * @returns {string} The bash command to get the current branch of the repository.
	 */
	function getCurrentBranchCommand() {
		return "git branch | grep \\* | cut -d ' ' -f2";
	}

	/**
	 * Gets the bash command to clone (if the premium-configuration directory doesn't already exist) and fetch the latest premium-configuration.
	 *
	 * @returns {string} The bash command to clone and fetch the latest premium-configuration.
	 */
	function clonePremiumConfiguration() {
		const commands = [];

		if ( ! grunt.file.exists( "premium-configuration" ) ) {
			let gitUrl = "git@github.com:Yoast/YoastSEO.js-premium-configuration.git";

			if ( process.env.CI ) {
				gitUrl = "https://github.com/Yoast/YoastSEO.js-premium-configuration.git";
			}

			commands.push( `git clone ${ gitUrl } premium-configuration` );
		}

		commands.push( "cd premium-configuration" );
		commands.push( "git fetch" );
		commands.push( "echo Done" );

		return commands.join( "&&" );
	}

	/**
	 * Gets the bash command to checkout the correct branch on the premium-configuration directory.
	 *
	 * @returns {string} The bash command to checkout the correct branch on the premium-configuration directory.
	 */
	function checkoutPremiumConfigurationCommand() {
		const commands = [];
		let branch = grunt.config.get( "currentBranch" );

		if ( process.env.CI ) {
			if ( process.env.GITHUB_HEAD_REF !== "" ) {
				branch = process.env.GITHUB_HEAD_REF;
			} else if ( process.env.GITHUB_REF_NAME !== "" ) {
				branch = process.env.GITHUB_REF_NAME;
			}
		}

		// Whitespace within the commands results into unexpected tokens.
		branch = branch.trim();

		// Defines a custom premium-configuration branch from the package.json file to run local and Travis tests against.
		const customBranch = grunt.config.get( "pkg" ).yoast.premiumConfiguration;

		if ( customBranch && customBranch !== "" ) {
			branch = customBranch;
		}

		commands.push( "cd premium-configuration" );
		commands.push( "git checkout develop" );
		commands.push( `git checkout ${ branch }` );

		return commands.join( "&&" );
	}

	/**
	 * Gets the bash command to pull the latest premium-configuration.
	 *
	 * @returns {string} The bash command to pull the latest premium-configuration.
	 */
	function pullPremiumConfigurationCommand() {
		const commands = [];

		commands.push( "cd premium-configuration" );
		commands.push( "git pull || echo 'Remote does not exist. Using local copy of branch.'" );

		return commands.join( "&&" );
	}

	return {
		makepot: {
			potFile: "languages/yoast-seo.pot",
			textdomain: "js-text-analysis",
			command: makePotCommand,
		},
		"get-current-branch": {
			command: getCurrentBranchCommand,
			options: {
				// eslint-disable-next-line handle-callback-err
				callback: function( err, stdout, stderr, cb ) {
					grunt.config.set( "currentBranch", stdout );

					cb();
				},
			},
		},
		"clone-premium-configuration": {
			command: clonePremiumConfiguration,
		},
		// This command tries to get the same branch for the premium configuration as for YoastSEO.js.
		// This way changes to the configuration can be tested in conjunction with testing YoastSEO.js.
		"checkout-premium-configuration": {
			command: checkoutPremiumConfigurationCommand,
			options: {
				failOnError: false,
			},
		},
		"pull-premium-configuration": {
			command: pullPremiumConfigurationCommand,
		},
	};
};
