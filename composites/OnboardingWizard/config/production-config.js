import MailchimpSignup from "../components/custom_components/MailchimpSignup";
import PublishingEntity from "../components/custom_components/PublishingEntity";
import PostTypeVisibility from "../components/custom_components/PostTypeVisibility";
import ConnectGoogleSearchConsole from "../components/custom_components/ConnectGoogleSearchConsole";

const configuration = {
	finishUrl: "",
	endpoint: "http://127.0.0.1:8882/onboarding?wp_nonce=nonce",
	customComponents: {
		MailchimpSignup, PublishingEntity, PostTypeVisibility, ConnectGoogleSearchConsole,
	},
	fields: {
		upsellConfigurationService: {
			componentName: "HTML",
			properties: {
				html: "You can now have Yoast configure Yoast SEO for you!",
			},
		},
		upsellSiteReview: {
			componentName: "HTML",
			properties: {
				html: "Get more visitors! Our SEO website review will tell you what to improve!",
			},
		},
		successMessage: {
			componentName: "HTML",
			properties: {
				html: "Good Job! You've finished setting up Yoast SEO." +
				" Thereby you've covered the technical part of your site's SEO." +
				" Now it's time to focus on optimizing your content for onpage SEO." +
				" You can use our content analysis for that: <br>{gif_showing_content_analysis}",
			},
		},
		mailchimpSignup: {
			componentName: "MailchimpSignup",
			properties: {
				label: "If you would like us to keep you up-to-date regarding Yoast SEO and other plugins by Yoast, subscribe to our newsletter:",
				mailchimpActionUrl: "{http://yoast.us1.list-manage1.com/subscribe/post?u=ffa93edfe21752c921f860358&amp;id=972f1c9122}",
				currentUserEmail: "{current_user_email:String}",
			},
			data: "false",
		},
		environment: {
			componentName: "Choice",
			properties: {
				label: "Please specify the environment {site_url} is running in.",
				choices: {
					production: {
						label: "Production - live site.",
					},
					staging: {
						label: "Staging - copy of live site used for testing purposes only.",
					},
					development: {
						label: "Development - locally running site used for development purposes.",
					},
				},
			},
			data: "development",
			"default": "production",
		},
		siteType: {
			componentName: "Choice",
			properties: {
				label: "What type of site is {site_url}?",
				choices: {
					blog: {
						label: "Blog",
					},
					shop: {
						label: "Shop",
					},
					news: {
						label: "News site",
					},
					smallBusiness: {
						label: "Small business site",
					},
					corporateOther: {
						label: "Other corporate site",
					},
					personalOther: {
						label: "Other personal site",
					},
				},
			},
			data: "blog",
		},
		publishingEntity: {
			componentName: "Choice",
			properties: {
				label: "Is this a personal site or is it for a company?",
				choices: {
					person: {
						label: "Personal website",
					},
					company: {
						label: "Company website",
					},
				},
			},
			data: "person",
		},
		personPublishingEntity: {
			componentName: "Input",
			properties: {
				label: "Your name:",
				pattern: "*",
			},
			requires: {
				field: "publishingEntity",
				value: "person",
			},
		},
		businessPublishingEntity: {
			componentName: "Input",
			conditionalType: "TextField",
			properties: {
				label: "The company name:",
				pattern: "*",
			},
			requires: {
				field: "publishingEntity",
				value: "company",
			},
		},
		profileUrlFacebook: {
			componentName: "Input",
			properties: {
				label: "Facebook page url",
				pattern: "^https://www.facebook.com/([^/]+)/$",
			},
			data: "{profile_url_facebook}",
		},
		profileUrlTwitter: {
			componentName: "Input",
			properties: {
				label: "Twitter url",
				pattern: "^https://twitter.com/([^/]+)$",
			},
			data: "{profile_url_twitter}",
		},
		profileUrlInstagram: {
			componentName: "Input",
			properties: {
				label: "Instagram url",
				pattern: "^https://www.instagram.com/([^/]+)/$",
			},
			data: "{profile_url_instagram}",
		},
		profileUrlLinkedIn: {
			componentName: "Input",
			properties: {
				label: "LinkedIn url",
				pattern: "^https://www.linkedin.com/in/([^/]+)$",
			},
			data: "{profile_url_linkedin}",
		},
		profileUrlMySpace: {
			componentName: "Input",
			properties: {
				label: "MySpace url",
				pattern: "^https://myspace.com/([^/]+)/$",
			},
			data: "{profile_url_myspace}",
		},
		profileUrlPinterest: {
			componentName: "Input",
			properties: {
				label: "Pinterest url",
				pattern: "^https://www.pinterest.com/([^/]+)/$",
			},
			data: "{profile_url_pinterest}",
		},
		profileUrlYouTube: {
			componentName: "Input",
			properties: {
				label: "YouTube url",
				pattern: "^https://www.youtube.com/([^/]+)$",
			},
			data: "{profile_url_youtube}",
		},
		profileUrlGooglePlus: {
			componentName: "Input",
			properties: {
				label: "Google+ URL",
				pattern: "^https://plus.google.com/([^/]+)$",
			},
			data: "{profile_url_google_plus}",
		},
		multipleAuthors: {
			componentName: "Choice",
			properties: {
				label: "Does your site have multiple authors?",
				choices: {
					yes: {
						label: "Yes",
					},
					no: {
						label: "No",
					},
				},
			},
			data: "yes",
		},
		tagLine: {
			componentName: "Input",
			properties: {
				label: "You still have the default WordPress tagline," +
				" even an empty one is probably better." +
				" Please clear it or replace it with something unique.",
			},
			data: "{wp_tagline}",
		},
		postTypeVisibility: {
			componentName: "PostTypeVisibility",
			properties: {
				label: "Please specify if which of the following public post types you would like Google to see",
				postTypes: {
					locations: "Locations",
					products: "Products",
				},
			},
			data: {
				locations: "{:bool}",
				products: "{:bool}",
			},
		},
		connectGoogleSearchConsole: {
			componentName: "ConnectGoogleSearchConsole",
			data: {
				token: "{gsc_token}",
				profile: "{gsc_profile}",
			},
		},
		siteName: {
			componentName: "Input",
			properties: {
				label: "Sitename",
				explanation: "Google shows your website's name in the search results, " +
				                "we will default to your site name but you can adapt it here.",
			},
			data: "{sitename}",
		},
		separator: {
			componentName: "Choice",

			properties: {
				label: "Separator",
				explanation: "Choose the symbol to use as your title separator. " +
				                "This will display, for instance, between your post title and site name. " +
				                "Symbols are shown in the size they'll appear in the search results.",
				choices: {
					dash: {
						label: "‐",
						screenReaderText: "Dash",
					},
					ndash: {
						label: "–",
						screenReaderText: "En dash",
					},
					mdash: {
						label: "—",
						screenReaderText: "Em dash",
					},
					middot: {
						label: "·",
						screenReaderText: "Middle dot",
					},
					bull: {
						label: "•",
						screenReaderText: "Bullet",
					},
					asterisk: {
						label: "*",
						screenReaderText: "Asterisk",
					},
					lowast: {
						label: "⁎",
						screenReaderText: "Low asterisk",
					},
					pipe: {
						label: "|",
						screenReaderText: "Vertical bar",
					},
					tilde: {
						label: "~",
						screenReaderText: "Small tilde",
					},
					laquo: {
						label: "«",
						screenReaderText: "Left angle quotation mark",
					},
					raquo: {
						label: "&raquo;",
						screenReaderText: "Right angle quotation mark",
					},
					lt: {
						label: "&lt;",
						screenReaderText: "Less than sign",
					},
					gt: {
						label: "&gt;",
						screenReaderText: "Greater than sign",
					},
				},
			},
		},
		data: "{separator}",
	},
	steps: {
		intro: {
			title: "Intro",
			fields: [ "upsellConfigurationService", "mailchimpSignup" ],
			fullWidth: true,
		},
		environment: {
			title: "Environment",
			fields: [ "environment" ],
		},
		siteType: {
			title: "Site type",
			fields: [ "siteType" ],
		},
		publishingEntity: {
			title: "Company or person",
			fields: [
				"publishingEntity",
				"personPublishingEntity",
				"businessPublishingEntity",
			],
		},
		profileUrls: {
			title: "Social profiles",
			fields: [
				"profileUrlFacebook",
				"profileUrlTwitter",
				"profileUrlInstagram",
				"profileUrlLinkedIn",
				"profileUrlMySpace",
				"profileUrlPinterest",
				"profileUrlYouTube",
				"profileUrlGooglePlus",
			],
		},
		postTypeVisibility: {
			title: "Post type visibility",
			fields: [ "postTypeVisibility" ],
		},
		multipleAuthors: {
			title: "Multiple authors",
			fields: [ "multipleAuthors" ],
		},
		connectGoogleSearchConsole: {
			title: "Google Search Console",
			fields: [ "connectGoogleSearchConsole" ],
		},
		titleTemplate: {
			title: "Title settings",
			fields: [ "siteName", "separator" ],
		},
		tagLine: {
			title: "Tagline",
			fields: [ "tagLine" ],
		},
		success: {
			title: "Success!",
			fields: [ "successMessage", "upsellSiteReview", "mailchimpSignup" ],
		},
	},
};

export default configuration;
