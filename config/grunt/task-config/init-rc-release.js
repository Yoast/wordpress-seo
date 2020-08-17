module.exports = {
	"default": {
        options: {
            githubOwner: 'noud-github',
            githubRepo: '<%= pluginSlug %>',
            enableSlack: true,
            type: 'release',
            enableSvnDeploy: false,
            enableGithubRelease: true,
            alternativeBranch: 'CI-test',
            alternativeBranchPush: true,
       }
    },
}