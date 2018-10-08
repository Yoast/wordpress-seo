// See https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
	return {
		makepot: {
			potFile: "languages/yoast-seo.pot",
			textdomain: "js-text-analysis",
			command: function() {
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
			},
		},
		"get-current-branch": {
			command: "git branch | grep \\* | cut -d ' ' -f2",
			options: {
				// eslint-disable-next-line handle-callback-err
				callback: function( err, stdout, stderr, cb ) {
					grunt.config.set( "currentBranch", stdout );

					cb();
				},
			},
		},
		"clone-premium-configuration": {
			command: function() {
				let commands = [];

				if ( ! grunt.file.exists( "premium-configuration" ) ) {
					let gitUrl = "git@github.com:Yoast/YoastSEO.js-premium-configuration.git";

					if ( process.env.CI ) {
						gitUrl = "https://github.com/Yoast/YoastSEO.js-premium-configuration.git";
					}

					commands.push( `git clone ${ gitUrl } premium-configuration` );
				}

				commands.push( "cd premium-configuration" );
				commands.push( "git fetch" );

				return commands.join( "&&" );
			},
		},
		"checkout-premium-configuration": {
			command: function() {
				const commands = [];

				const branch = process.env.CI ? process.env.TRAVIS_BRANCH : grunt.config.get( "currentBranch" );

				commands.push( "cd premium-configuration" );
				commands.push( "git checkout develop" );
				commands.push( `git checkout ${ branch }` );

				return commands.join( "&&" );
			},
			options: {
				failOnError: false,
			},
		},
	};
};
