# Contribution Guidelines
<img src="https://yoast-mercury.s3.amazonaws.com/uploads/2013/02/Yoast_Logo_Large_RGB.png" alt="Yoast logo" width="250px">

Before filing a bug report or a feature request, be sure to read the contribution guidelines.

## How to use GitHub
We use GitHub exclusively for well-documented bugs, feature requests and code contributions. Communication is always done in English.

To receive free support for WordPress SEO we have the following channels:
* [Yoast Knowledge base](https://yoa.st/1y0)
* [Support forums](https://wordpress.org/support/plugin/wordpress-seo) on WordPress.org

If you have purchased one of [our premium plugins](https://yoa.st/1y1), we will give you personal support via email, please see your purchase email for details.


Thanks for your understanding.

## Security issues
Please do not report security issues here. Instead, email them to security at yoast dot com so we can deal with them securely and quickly.

## I have found a bug
Before opening a new issue, please:
* update to the newest versions of WordPress and the Yoast SEO plugins.
* search for duplicate issues to prevent opening a duplicate issue. If there is already an open existing issue, please comment on that issue.
* check our [knowledge base](https://yoa.st/1y0) for your issue. There are a lot of common errors documented there with possible solutions.
* follow our _New issue_ template when creating a new issue.
* check for [plugin and theme conflicts](https://yoa.st/1y2). Please report your findings in the issue.
* check for [JavaScript errors with your browser's console](https://yoa.st/1y3). Please report your findings in the issue.
* add as much information as possible. For example: add screenshots, relevant links, step by step guides etc.

## I have a feature request
Before opening a new issue, please:
* search for duplicate issues to prevent opening a duplicate feature request. If there is already an open existing request, please leave a comment there.
* add as much information as possible. For example: give us a clear explanation of why you think the feature request is something we should consider for the Yoast SEO plugins.

## I want to create a patch
Community made patches, localizations, bug reports and contributions are very welcome and help Yoast SEO remain the #1 SEO plugin for WordPress.

When contributing please ensure you follow the guidelines below so that we can keep on top of things.

#### Submitting an issue you found
Make sure your problem does not exist as a ticket already by searching through [the existing issues](https://github.com/Yoast/wordpress-seo/issues). If you cannot find anything which resembles your problem, please [create a new issue](https://github.com/Yoast/wordpress-seo/issues/new).

#### Fixing an issue

* Fork the repository on GitHub (make sure to use the trunk branch, not master).
* Make the changes to your forked repository.
* Ensure you stick to the [WordPress Coding Standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/) and you properly document any new functions, actions and filters following the [documentation standards](https://make.wordpress.org/core/handbook/best-practices/inline-documentation-standards/php/).
* When committing, reference your issue and include a note about the fix.
* Push the changes to your fork and submit a pull request to the 'trunk' branch of the Yoast SEO repository.

We will review your pull request and merge when everything is in order. We will help you to make sure the code complies with the standards described above.

#### 'Patch welcome' issues
Some issues are labeled 'patch-welcome'. This means we see the value in the particular enhancement being suggested but have decided for now not to prioritize it. If you however decide to write a patch for it, we'll gladly include it after some code review.

## Additional Notes

### Issue and Pull Request Labels
This section lists the labels we use to help us track and manage issues and pull requests.

GitHub search makes it easy to use labels for finding groups of issues or pull requests you're interested in. To help you find issues and pull requests, each label is listed with search links for finding open items with that label. We encourage you to read about other search filters which will help you write more focused queries.

The labels are loosely grouped by their purpose, but it's not required that every issue have a label from every group or that an issue can't have more than one label from the same group.

Please open an issue if you have suggestions for new labels, and if you notice some labels are missing on some repositories, then please open an issue.

##### Type of Issue and Issue State

| Label name | Description |
| --- | --- |
| [`enhancement`][label-enhancement] | Feature requests. |
| [`bug`][label-bug] | Confirmed bugs or reports that are very likely to be bugs. |
| [`question`][label-question] | Questions more than bug reports or feature requests (e.g. how do I do X). |
| [`feedback`][label-feedback] | General feedback more than bug reports or feature requests. |
| [`help-wanted`][label-help-wanted] | Help from the community in resolving these issues is appreciated. |
| [`beginner`][label-beginner] | Less complex issues which would be good first issues to work on for users who want to contribute to Dream Plus. |
| [`more-information-needed`][label-more-information-needed] | More information needs to be collected about these problems or feature requests (e.g. steps to reproduce). |
| [`needs-reproduction`][label-needs-reproduction] | Likely bugs, but haven't been reliably reproduced. |
| [`duplicate`][label-duplicate] | Issues which are duplicates of other issues, i.e. they have been reported before. |
| [`wontfix`][label-wontfix] | Issues which won't be worked on for now. |
| [`invalid`][label-invalid] | Issues which aren't valid (e.g. user errors). |

#### Pull Request Labels

| Label name | Description
| --- | --- |
| [`work-in-progress`][label-work-in-progress] | Pull requests which are still being worked on, more changes will follow. |
| [`needs-review`][label-needs-review] | Pull requests which need code review. |
| [`under-review`][label-under-review] | Pull requests being reviewed. |
| [`requires-changes`][label-requires-changes] | Pull requests which need to be updated based on review comments and then reviewed again. |
| [`needs-testing`][label-needs-testing] | Pull requests which need manual testing. |

[label-enhancement]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement
[label-bug]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Abug
[label-question]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Aquestion
[label-feedback]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Afeedback
[label-help-wanted]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Ahelp-wanted
[label-beginner]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Abeginner
[label-more-information-needed]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Amore-information-needed
[label-needs-reproduction]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Aneeds-reproduction
[label-documentation]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Adocumentation
[label-blocked]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Ablocked
[label-duplicate]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Aduplicate
[label-wontfix]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Awontfix
[label-invalid]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Ainvalid

[beginner]:https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Abeginner+label%3Ahelp-wanted+sort%3Acomments-desc
[help-wanted]:https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Aissue+label%3Ahelp-wanted+sort%3Acomments-desc+-label%3Abeginner

[label-work-in-progress]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Apr+label%3Awork-in-progress
[label-needs-review]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Apr+label%3Aneeds-review
[label-under-review]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Apr+label%3Aunder-review
[label-requires-changes]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Apr+label%3Arequires-changes
[label-needs-testing]: https://github.com/UtkarshVerma/hugo-dream-plus/issues?q=is%3Aopen+is%3Apr+label%3Aneeds-testing

#### Additional Resources
* [Yoast SEO API](https://yoa.st/1y4)
* [General GitHub Documentation](https://help.github.com/)
* [GitHub Pull Request documentation](https://help.github.com/send-pull-requests/)
