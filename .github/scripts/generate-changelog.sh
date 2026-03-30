#!/bin/bash
# Generates changelog.md from merged PRs since the latest tag on the current branch.
# Output format matches the premium plugin's changelog.md structure.
#
# Required environment variables:
#   GH_TOKEN   - GitHub token for API access.
#   VERSION    - Version number (e.g., 27.2).
#
# Optional environment variables:
#   PREVIOUS_TAG  - Tag to compare from (defaults to latest tag on branch).
#   RELEASE_DATE  - Release date in YYYY-MM-DD format (defaults to existing value in changelog, then calculated).
#   CHANGELOG_FILE - Path to the changelog file (defaults to changelog.md).

set -euo pipefail

VERSION="${VERSION:?VERSION is required}"
CHANGELOG_FILE="${CHANGELOG_FILE:-changelog.md}"

# If the version section already exists in the changelog file, extract its release
# date and any copy between the release date line and the first #### heading
# (the "preamble"). These are preserved as-is when regenerating.
EXISTING_RELEASE_DATE=""
EXISTING_PREAMBLE=""
if [ -f "$CHANGELOG_FILE" ]; then
	# Extract the section for the requested version (between its ## header and the next ## header or footer).
	VERSION_SECTION=$(sed -n "/^## ${VERSION}\$/,/^## [0-9]/{ /^## ${VERSION}\$/d; /^## [0-9]/d; p; }" "$CHANGELOG_FILE" \
		| sed '/^### Earlier versions/,$ d' || true)

	if [ -n "$VERSION_SECTION" ]; then
		# Extract the existing release date.
		EXISTING_RELEASE_DATE=$(echo "$VERSION_SECTION" | grep -oP '(?<=Release date: ).*' | head -1 || true)

		# Extract preamble: lines after the release date line and before the first #### heading.
		EXISTING_PREAMBLE=$(echo "$VERSION_SECTION" \
			| sed -n '/^Release date:/,/^####/{/^Release date:/d; /^####/d; p;}' \
			| sed -e '/./,$!d' -e :a -e '/^\n*$/{$d;N;ba;}' || true)
	fi
fi

# Use the provided RELEASE_DATE env var if set, otherwise preserve the existing
# release date from the changelog, otherwise calculate a new one.
if [ -n "${RELEASE_DATE:-}" ]; then
	: # RELEASE_DATE already set via environment.
elif [ -n "$EXISTING_RELEASE_DATE" ]; then
	RELEASE_DATE="$EXISTING_RELEASE_DATE"
else
	# Calculate release date using the same logic as the Grunt task:
	#   - Patch releases (x.y.z where z > 0): today's date.
	#   - Minor/major releases: next Tuesday ~2 weeks out (today + 2 + 14 - dayOfWeek).
	#   - Beta releases: add an extra 7 days (~3 weeks out).
	BASE_VERSION=$(echo "$VERSION" | cut -d'-' -f1)
	PATCH=$(echo "$BASE_VERSION" | awk -F. '{ print ($3 != "" ? $3 : 0) }')
	SUFFIX=$(echo "$VERSION" | grep -oP '(?<=-).*' || true)

	if [ "$PATCH" -gt 0 ]; then
		# Patch release: use today.
		RELEASE_DATE=$(date +%Y-%m-%d)
	else
		DAYS_TO_ADD=14
		if echo "$SUFFIX" | grep -qi "beta"; then
			DAYS_TO_ADD=21
		fi
		# dayOfWeek: 0=Sunday .. 6=Saturday. Tuesday=2.
		DAY_OF_WEEK=$(date +%w)
		OFFSET=$(( 2 + DAYS_TO_ADD - DAY_OF_WEEK ))
		RELEASE_DATE=$(date -d "+${OFFSET} days" +%Y-%m-%d)
	fi
fi

# Find previous tag if not provided. Defaults to the latest release tag (excludes RC/beta).
if [ -z "${PREVIOUS_TAG:-}" ]; then
	PREVIOUS_TAG=$(git tag --sort=-creatordate --merged HEAD | grep -E '^[0-9]+\.[0-9]+(\.[0-9]+)?$' | head -1 || echo "")
fi

if [ -z "$PREVIOUS_TAG" ]; then
	echo "::error::No previous tag found on this branch."
	exit 1
fi

echo "Generating changelog for version $VERSION since tag $PREVIOUS_TAG"

# Get PR numbers from merge commits since the previous tag.
PR_NUMBERS=$(git log --grep='Merge pull request' "$PREVIOUS_TAG..HEAD" --oneline | grep -oP '#\K[0-9]+' || true)

if [ -z "$PR_NUMBERS" ]; then
	echo "::warning::No merged PRs found since $PREVIOUS_TAG"
	exit 0
fi

ENHANCEMENTS=""
BUGFIXES=""
OTHER=""

for PR_NUM in $PR_NUMBERS; do
	echo "Processing PR #$PR_NUM..."

	# Get PR data.
	PR_JSON=$(gh pr view "$PR_NUM" --json labels,body 2>/dev/null || echo '{"labels":[],"body":""}')

	# Get changelog label.
	LABEL=$(echo "$PR_JSON" | jq -r '[.labels[].name] | map(select(startswith("changelog:"))) | first // empty' | sed 's/^changelog: //')

	if [ -z "$LABEL" ] || [ "$LABEL" = "non-user-facing" ]; then
		echo "  Skipping (label: ${LABEL:-none})"
		continue
	fi

	# Extract changelog entry from PR body.
	BODY=$(echo "$PR_JSON" | jq -r '.body // ""')

	# Get lines between "changelog entry:" and the next heading, filtering for bullet points.
	ENTRIES=$(echo "$BODY" | sed -n '/[Cc]hangelog entry/,/^##/p' | grep '^\*' | grep -v '^\* *$' || true)

	# Process each entry line.
	while IFS= read -r line; do
		[ -z "$line" ] && continue

		# Skip entries scoped to other repos (e.g., [wordpress-seo-premium], [shopify-seo]).
		if echo "$line" | grep -qP '^\* *\[(?!wordpress-seo[ \]])'; then
			echo "  Skipping scoped entry: $line"
			continue
		fi

		# Extract per-line label override from bracket prefix (e.g., [wordpress-seo bugfix]).
		LINE_LABEL="$LABEL"
		BRACKET_EXTRA=$(echo "$line" | grep -oP '^\* *\[wordpress-seo \K[^]]+' || true)
		if [ -n "$BRACKET_EXTRA" ]; then
			case "$BRACKET_EXTRA" in
				bugfix|enhancement|other) LINE_LABEL="$BRACKET_EXTRA" ;;
			esac
		fi

		# Remove [wordpress-seo ...] scope prefix if present.
		line=$(echo "$line" | sed 's/^\(\* *\)\[wordpress-seo[^]]*\] */\1/')

		case "$LINE_LABEL" in
			enhancement) ENHANCEMENTS+="$line"$'\n' ;;
			bugfix)      BUGFIXES+="$line"$'\n' ;;
			other)       OTHER+="$line"$'\n' ;;
			*)           echo "  Unknown label: $LINE_LABEL, treating as other"; OTHER+="$line"$'\n' ;;
		esac
	done <<< "$ENTRIES"
done

# Build the new version section.
SECTION="## $VERSION

Release date: $RELEASE_DATE
"

# Insert preserved preamble (copy between release date and first #### heading).
if [ -n "$EXISTING_PREAMBLE" ]; then
	SECTION+="
$EXISTING_PREAMBLE
"
fi

if [ -n "$ENHANCEMENTS" ]; then
	SECTION+="
#### Enhancements

$(echo -n "$ENHANCEMENTS" | sed '/^$/d')
"
fi

if [ -n "$BUGFIXES" ]; then
	SECTION+="
#### Bugfixes

$(echo -n "$BUGFIXES" | sed '/^$/d')
"
fi

if [ -n "$OTHER" ]; then
	SECTION+="
#### Other

$(echo -n "$OTHER" | sed '/^$/d')
"
fi

# Read metadata from readme.txt and the main plugin file.
REQUIRES_AT_LEAST=""
TESTED_UP_TO=""
REQUIRES_PHP=""

for META_FILE in readme.txt wp-seo.php; do
	if [ -f "$META_FILE" ]; then
		[ -z "$REQUIRES_AT_LEAST" ] && REQUIRES_AT_LEAST=$(grep -oP '(?<=Requires at least: ).*' "$META_FILE" | head -1 || true)
		[ -z "$TESTED_UP_TO" ] && TESTED_UP_TO=$(grep -oP '(?<=Tested up to: ).*' "$META_FILE" | head -1 || true)
		[ -z "$REQUIRES_PHP" ] && REQUIRES_PHP=$(grep -oP '(?<=Requires PHP: ).*' "$META_FILE" | head -1 || true)
	fi
done

HEADER="Yoast SEO
=========
Requires at least: ${REQUIRES_AT_LEAST:-6.5}
Tested up to: ${TESTED_UP_TO:-6.9}
Requires PHP: ${REQUIRES_PHP:-7.4}

Changelog
=========
"

FOOTER="### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/yoast-seo-changelog)."

# Preserve existing changelog entries.
# Rules:
#   - If the exact version already exists, replace it (no duplicates).
#   - Keep versions with major.minor >= previous minor release.
#   - Drop anything older than the previous minor release.
EXISTING=""
if [ -f "$CHANGELOG_FILE" ]; then
	# Extract all version sections (between "## x.y" headers), excluding the footer.
	ALL_SECTIONS=$(sed -n '/^## [0-9]/,$ p' "$CHANGELOG_FILE" | sed '/^### Earlier versions/,$ d' || true)

	# Determine the current major.minor to figure out what to keep.
	CURRENT_MAJOR=$(echo "$VERSION" | cut -d. -f1)
	CURRENT_MINOR=$(echo "$VERSION" | cut -d. -f2)

	# Previous minor version number.
	if [ "$CURRENT_MINOR" -gt 0 ]; then
		PREV_MAJOR=$CURRENT_MAJOR
		PREV_MINOR=$(( CURRENT_MINOR - 1 ))
	else
		PREV_MAJOR=$(( CURRENT_MAJOR - 1 ))
		# We don't know the exact previous minor, so keep anything from the previous major.
		PREV_MINOR=""
	fi

	# Decides whether a version section should be kept.
	# Args: $1 = section version string (e.g., "27.1.1").
	should_keep_section() {
		local section_version="$1"

		# Drop the exact version being generated (it will be replaced).
		if [ "$section_version" = "$VERSION" ]; then
			return 1
		fi

		local section_major section_minor
		section_major=$(echo "$section_version" | cut -d. -f1)
		section_minor=$(echo "$section_version" | cut -d. -f2)

		# Keep if major.minor >= previous minor release.
		if [ "$section_major" -gt "$PREV_MAJOR" ]; then
			return 0
		elif [ "$section_major" -eq "$PREV_MAJOR" ]; then
			if [ -z "$PREV_MINOR" ] || [ "$section_minor" -ge "$PREV_MINOR" ]; then
				return 0
			fi
		fi

		return 1
	}

	# Split sections and filter.
	EXISTING=""
	CURRENT_SECTION=""
	CURRENT_SECTION_VERSION=""

	while IFS= read -r line; do
		# Stop if we hit the "Earlier versions" footer.
		if [[ "$line" =~ ^###\ Earlier ]]; then
			break
		fi

		if [[ "$line" =~ ^##\ ([0-9]+\.[0-9]+(\.[0-9]+)?) ]]; then
			# Flush the previous section if it should be kept.
			if [ -n "$CURRENT_SECTION_VERSION" ] && should_keep_section "$CURRENT_SECTION_VERSION"; then
				EXISTING+="$CURRENT_SECTION"
			fi

			CURRENT_SECTION="$line"$'\n'
			CURRENT_SECTION_VERSION="${BASH_REMATCH[1]}"
		else
			CURRENT_SECTION+="$line"$'\n'
		fi
	done <<< "$ALL_SECTIONS"

	# Flush the last section.
	if [ -n "$CURRENT_SECTION_VERSION" ] && should_keep_section "$CURRENT_SECTION_VERSION"; then
		EXISTING+="$CURRENT_SECTION"
	fi
fi

# Write the final changelog.md file.
{
	printf '%s\n' "$HEADER"
	printf '%s\n' "$SECTION"
	if [ -n "$EXISTING" ]; then
		# Trim trailing blank lines before the footer.
		EXISTING="${EXISTING%$'\n'}"
		EXISTING="${EXISTING%$'\n'}"
		printf '%s\n' "$EXISTING"
	fi
	printf '\n%s\n' "$FOOTER"
} > "$CHANGELOG_FILE"

echo "Changelog written to $CHANGELOG_FILE"
