The options services are used to get or set our SEO options.
* An options service is called from the options helper. Which determines, based on if we are on a multisite or not, which service it should call.
* The service uses the validation helper to determine if it may set an option. Which to call is determined by its configuration.

The flow:
![Options flow](http://www.plantuml.com/plantuml/png/XP4nQyCm48Lt_ugpASW1kzaDBLa2xTJ1j4ifXqYEH5IsX7Hsut_VI5NQ1cooFdtltGVQU9QEXqvd-TqdJV00XHYSHcDPcLuKvtYKUg3uS6IslbclwIGxgodFxuqxHEPScID-ttcov0Fn3e8wonDwTge_Y0h2EG4VHPQzn9iUdqXRSb0_GgkOy1Atv4Qr8sW0qHEN48GhI7whR0uE8szIgxqCyMMvWV4d8vI-J0iL9CjLTjr8BjketKPjJ8JvlrN-gIomTRsWmqTdlk2vZrDurTwUTcG3FM_rwlGjcOJSSWX_E7UZNlg7LDbGlnyw_Gq0)
See this on [PlantUML](http://www.plantuml.com/plantuml/uml/XP4nQyCm48Lt_ugpASW1kzaDBLa2xTJ1j4ifXqYEH5IsX7Hsut_VI5NQ1cooFdtltGVQU9QEXqvd-TqdJV00XHYSHcDPcLuKvtYKUg3uS6IslbclwIGxgodFxuqxHEPScID-ttcov0Fn3e8wonDwTge_Y0h2EG4VHPQzn9iUdqXRSb0_GgkOy1Atv4Qr8sW0qHEN48GhI7whR0uE8szIgxqCyMMvWV4d8vI-J0iL9CjLTjr8BjketKPjJ8JvlrN-gIomTRsWmqTdlk2vZrDurTwUTcG3FM_rwlGjcOJSSWX_E7UZNlg7LDbGlnyw_Gq0)
