
import MailchimpSignup from './custom_components/MailchimpSignup';
import PublishingEntity from "./custom_components/PublishingEntity"
import PostTypeVisibility from "./custom_components/PostTypeVisibility"


let configuration = {
	"endpoint": "http://local.wordpress.dev/wp-admin/yoast/onboarding?wp_nonce=nonce",
	"customComponents": {
		MailchimpSignup, PublishingEntity, PostTypeVisibility
	},
	"fields": {
		"upsellConfigurationService": {
			"component": "HTML",
			"properties": {
				"html": "You can now have Yoast configure Yoast SEO for you."
			}
		},
		"upsellSiteReview": {
			"component": "HTML",
			"properties": {
				"html": "Get more visitors! Our SEO website review will tell you what to improve!"
			}
		},
		"successMessage": {
			"component": "HTML",
			"properties": {
				"html": "Good Job! You've finished setting up Yoast SEO. Thereby you've covered the technical part of your site's SEO. Now it's time to focus on optimizing your content for onpage SEO. You can use our content analysis for that: <br>{gif_showing_content_analysis}"
			}
		},
		"mailchimpSignup": {
			"component": "MailchimpSignup",
			"properties": {
				"label": "If you would like us to keep you up-to-date regarding Yoast SEO and other plugins by Yoast, subscribe to our newsletter:",
				"mailchimpActionUrl": "{http://yoast.us1.list-manage1.com/subscribe/post?u=ffa93edfe21752c921f860358&amp;id=972f1c9122}",
				"currentUserEmail": "{current_user_email:String}"
			},
			"data": ""
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
				}
			},
			"data": "",
			"default": "production"
		},
		"siteType": {
			"component": "Choice",
			"properties": {
				"label": "What type of site is {site_url}?",
				"choices": {
					"blog": {
						"label": "Blog"
					},
					"shop": {
						"label": "Shop"
					},
					"news": {
						"label": "News site"
					},
					"smallBusiness": {
						"label": "Small business site"
					},
					"corporateOther": {
						"label": "Other corporate site"
					},
					"personalOther": {
						"label": "Other personal site"
					}
				}
			},
			"data": ""
		},
		"publishingEntity": {
			"component": "PublishingEntity",
			"data": {
				"publishingEntityType": "{publishing_entity_type}",
				"publishingEntityPersonName": "{publishing_entity_person_name}",
				"publishingEntityCompanyName": "{publishing_entity_company_name}",
				"publishingEntityCompanyLogo": "{publishing_entity_company_logo}"
			},
			"defaults": {
				"publishingEntityType": "",
				"publishingEntityPersonName": "{currentuser.name}",
				"publishingEntityCompanyName": "",
				"publishingEntityCompanyLogo": ""
			}
		},
		"profileUrlFacebook": {
			"component": "Input",
			"properties": {
				"label": "Facebook page url",
				"pattern": "^https:\/\/www\.facebook\.com\/([^/]+)\/$"
			},
			"data": "{profile_url_facebook}"
		},
		"profileUrlTwitter": {
			"component": "Input",
			"properties": {
				"label": "Twitter url",
				"pattern": "^https:\/\/twitter\.com\/([^/]+)$"
			},
			"data": "{profile_url_twitter}"
		},
		"profileUrlInstagram": {
			"component": "Input",
			"properties": {
				"label": "Instagram url",
				"pattern": "^https:\/\/www\.instagram\.com\/([^/]+)\/$"
			},
			"data": "{profile_url_instagram}"
		},
		"profileUrlLinkedIn": {
			"component": "Input",
			"properties": {
				"label": "LinkedIn url",
				"pattern": "^https:\/\/www\.linkedin\.com\/in\/([^/]+)$"
			},
			"data": "{profile_url_linkedin}"
		},
		"profileUrlMySpace": {
			"component": "Input",
			"properties": {
				"label": "MySpace url",
				"pattern": "^https:\/\/myspace\.com\/([^/]+)\/$"
			},
			"data": "{profile_url_myspace}"
		},
		"profileUrlPinterest": {
			"component": "Input",
			"properties": {
				"label": "Pinterest url",
				"pattern": "^https:\/\/www\.pinterest\.com\/([^/]+)\/$"
			},
			"data": "{profile_url_pinterest}"
		},
		"profileUrlYouTube": {
			"component": "Input",
			"properties": {
				"label": "YouTube url",
				"pattern": "^https:\/\/www\.youtube\.com\/([^/]+)$"
			},
			"data": "{profile_url_youtube}"
		},
		"profileUrlGooglePlus": {
			"component": "Input",
			"properties": {
				"label": "Google+ URL",
				"pattern": "^https:\/\/plus\.google\.com\/([^/]+)$"
			},
			"data": "{profile_url_google_plus}"
		},
		"multipleAuthors": {
			"component": "Choice",
			"properties": {
				"label": "Does your site have multiple authors?",
				"choices": {
					"yes": {
						"label": "Yes"
					},
					"no": {
						"label": "No"
					}
				}
			},
			"data": ""
		},
		"tagLine": {
			"component": "Input",
			"properties": {
				"label": "You still have the default WordPress tagline, even an empty one is probably better. Please clear it or replace it with something unique.",
			},
			"data": "{wp_tagline}",
		},
		"postTypeVisibility": {
			"component": "PostTypeVisibility",
			"properties": {
				"label": "Please specify if which of the following public post types you would like Google to see",
				"postTypes": {
					"locations": "Locations",
					"products": "Products"
				}
			},
			"data": {
				"locations": "{:bool}",
				"products": "{:bool}"
			}
		},
		"connectGoogleSearchConsole": {
			"component": "ConnectGoogleSearchConsole",
			"data": {
				"token": "{gsc_token}",
				"profile": "{gsc_profile}"
			}
		},
		"siteName": {
			"component": "Input",
			"properties": {
				"label": "Sitename"
			},
			"data": "{sitename}"
		},
		"separator": {
			"component": "Choice",
			"properties": {
				"label": "Separator",
				"choices": {
					"dash": {
						"label": "&dash;",
						"screenReaderText": "Dash"
					},
					"ndash": {
						"label": "&ndash;",
						"screenReaderText": "En dash"
					},
					"mdash": {
						"label": "&mdash;",
						"screenReaderText": "Em dash"
					},
					"middot": {
						"label": "&middot;",
						"screenReaderText": "Middle dot"
					},
					"bull": {
						"label": "&bull;",
						"screenReaderText": "Bullet"
					},
					"asterisk": {
						"label": "*",
						"screenReaderText": "Asterisk"
					},
					"lowast": {
						"label": "&#8270;",
						"screenReaderText": "Low asterisk"
					},
					"pipe": {
						"label": "|",
						"screenReaderText": "Vertical bar"
					},
					"tilde": {
						"label": "~",
						"screenReaderText": "Small tilde"
					},
					"laquo": {
						"label": "&laquo;",
						"screenReaderText": "Left angle quotation mark"
					},
					"raquo": {
						"label": "&raquo;",
						"screenReaderText": "Right angle quotation mark"
					},
					"lt": {
						"label": "<",
						"screenReaderText": "Less than sign"
					},
					"gt": {
						"label": ">",
						"screenReaderText": "Greater than sign"
					},
					"dash": "&dash;",
					"ndash": "&ndash;",
					"mdash": "&mdash;",
					"middot": "&middot;",
					"bull": "&bull;",
					"asterisk": "*",
					"lowast": "&#8270;",
					"pipe": "|",
					"tilde": "~",
					"laquo": "&laquo;",
					"raquo": "&raquo;",
					"lt": "<",
					"gt": ">"
				}
			},
			"data": "{separator}"
		},
	},
	"steps": {
		"intro": {
			"title": "Intro",
			"fields": ["upsellConfigurationService", "mailchimpSignup"]
		},
		"environment": {
			"title": "Environment",
			"fields": ["environment", "siteType"]
		},
		"siteType": {
			"title": "Site type",
			"fields": ["siteType"]
		},
		"publishingEntity": {
			"title": "Company or person",
			"fields" : ["publishingEntity"]
		},
		"profileUrls": {
			"title": "Social profiles",
			"fields" : [
				"profileUrlFacebook",
				"profileUrlTwitter",
				"profileUrlInstagram",
				"profileUrlLinkedIn",
				"profileUrlMySpace",
				"profileUrlPinterest",
				"profileUrlYouTube",
				"profileUrlGooglePlus"
			]
		},
		"postTypeVisibility": {
			"title": "Post type visibility",
			"fields": ["postTypeVisibility"]
		},
		"multipleAuthors": {
			"title": "Multiple authors",
			"fields": ["multipleAuthors"]
		},
		"connectGoogleSearchConsole": {
			"title": "Google Search Console",
			"fields": ["connectGoogleSearchConsole"]
		},
		"titleTemplate": {
			"title": "Title settings",
			"fields": ["siteName","separator"]
		},
		"tagLine": {
			"title": "Tagline",
			"fields": ["tagLine"]
		},
		"success": {
			"title": "Success!",
			"fields": ["successMessage", "upsellSiteReview", "mailchimpSignup"]
		}
	}
};

export default configuration