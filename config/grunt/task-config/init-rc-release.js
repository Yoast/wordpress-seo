module.exports = {
	"default": {
        options: {
            githubOwner: 'yoast',
            githubRepo: '<%= pluginSlug %>',
            enableSlack: true,
            type: 'release',
            enableSvnDeploy: false,
            enableGithubRelease: true,
            alternativeBranch: 'CI-test',
            alternativeBranchPush: true,
            noBump: false,
       }
    },
}