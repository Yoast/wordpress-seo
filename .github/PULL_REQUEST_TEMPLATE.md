## Context
<!--
What do we want to achieve with this PR? Why did we write this code?
-->

*

## Summary

<!--
Attach one of the following labels to the PR: `changelog: bugfix`, `changelog: enhancement`, `changelog: other`, `changelog: non-user-facing`.
If the changelog item is a bugfix, please use the following sentence structure: Fixes a bug where ... would ... (when ...).
If the changelog item is meant for the changelog of another add-on, start your changelog item with the name of that add-on's repo between square brackets, for example: * [wordpress-seo-premium] Fixes a bug where ....
If the changelog items is meant for the changelog of a javascript package, specify between square brackets in which package changelog the item should be included, for example: * [@yoast/components] Fixes a bug where ....
If the same changelog item is applicable to multiple changelogs/add-ons, add a separate changelog item for all of them.
-->
This PR can be summarized in the following changelog entry:

*

## Relevant technical choices:

*

## Test instructions
<!--
Please follow these guidelines when creating test instructions:
- Please provide step-by-step instructions how to reproduce the issue, if applicable.
- Write step-by-step test instructions aimed at non-tech-savvy users, even if the PR is not user-facing.
-->
### Test instructions for the acceptance test before the PR gets merged
This PR can be acceptance tested by following these steps:

*


### Test instructions for QA when the code is in the RC
<!--
Sometimes some steps from the test instructions for the acceptance test aren't relevant anymore once the code has been merged or the feature is complete. If that is the case, do not check the checkbox below.
QA is our Quality Assurance team. The RC is the release candidate zip that is tested before a release 
-->

* [ ] QA should use the same steps as above.

<!--
If the above checkbox has not been checked, write down all steps QA should take to test this PR, not only the difference with the acceptance test steps. If QA should use the test instructions specified on the epic, paste a link to the relevant comment on the epic.
-->
QA can test this PR by following these steps:

*

## Impact check
<!--
Sometimes PRs have a bigger impact than is suggested in the user-facing changes. In such cases,
additional (regression) testing might be necessary. To make it clear what parts might need additional testing, please outline which parts of the plugin have been impacted by this PR.
-->
This PR affects the following parts of the plugin, which may require extra testing:

*

## UI changes

* [ ] This PR changes the UI in the plugin. I have added the 'UI change' label to this PR.

## Other environments

* [ ] This PR also affects Shopify. I have added a changelog entry starting with `[shopify-seo]` and I have added test instructions for Shopify.

## Documentation

* [ ] I have written documentation for this change.

## Quality assurance

* [ ] I have tested this code to the best of my abilities
* [ ] I have added unittests to verify the code works as intended
* [ ] If any part of the code is behind a feature flag, my test instructions also cover cases where the feature flag is switched off.

Fixes #
