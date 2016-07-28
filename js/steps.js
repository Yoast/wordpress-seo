let Steps = {
	'intro': {
		title: 'Intro',
		fields: {}
	},
	'environment': {
		title: 'Environment',
		fields: {
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