const path = require( "path" );

// See https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
    return {
        "test-shell-command": {
            options: {
                stdout: true,
                slug: ' <%= pluginSlug %> ',
                pluginVersion: '<%= pluginVersion %>',
            },
			command: () => "echo :  " + path.normalize( "./node_modules/.bin/i18n-calypso" )
		},
        "test-shell-command-dryrun": {
            options: {
                stdout: true,
                dryrun: true,
                slug: ' <%= pluginSlug %> ',
                pluginVersion: '<%= pluginVersion %>',
            },
			command: () => "echo :  " + path.normalize( "./node_modules/.bin/i18n-calypso" )
		},


    }
}