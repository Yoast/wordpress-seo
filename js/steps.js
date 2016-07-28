let Steps = {
	'intro': {
		title: 'Intro',
		fields: {
			"intro" : {
				"component" : "HTML",
				"html" : "<p>Good Job! You've finished setting up Yoast SEO. Thereby you've covered the technical part of <br />your site's SEO. Now it's time to focus on optimizing your content for onpage SEO. You can use our content analysis for that:</p>"
			}
		}
	},
	'environment': {
		title: 'Environment',
		fields: {
			"profileUrlFacebook": {
				"component": "Input",
				"properties": {
					"label": "Facebook page url",
					"pattern": "^https:\/\/www\.facebook\.com\/([^/]+)\/$"
				},
				"data": "{profile_url_facebook}"
			},
			"environment": {
				"component": "Choice",
				"properties": {
					"label": "Please specify the environment {site_url} is running in.",
					"choices": {
						"production": {
							"label": "Production - live site."
						},
						"staging": {
							"label": "Staging - copy of live site used for testing purposes only."
						},
						"development": {
							"label": "Development - locally running site used for development purposes."
						}
					},
				},
				"data": "",
				"default": "production"
			},
		}
	},
	'siteType': {
		title: 'Company or person',
		fields: {}
	}
};

export default Steps