#!/usr/bin/env bash
########################################################################
# Convenience script to run WordPress integration tests via wp-env.
#
# Usage:
#   ./config/scripts/run-wp-env-tests.sh                        # All tests
#   ./config/scripts/run-wp-env-tests.sh --filter=SomeTest      # Specific test
#   ./config/scripts/run-wp-env-tests.sh --multisite            # Multisite mode
#   ./config/scripts/run-wp-env-tests.sh --coverage             # With coverage
#   ./config/scripts/run-wp-env-tests.sh --php=7.4              # Specific PHP version
#   ./config/scripts/run-wp-env-tests.sh --wp=6.8               # Specific WP version
#   ./config/scripts/run-wp-env-tests.sh --php=8.3 --wp=trunk   # Both
#
# Prerequisites:
#   - Docker running
#   - composer install (must have been run on host)
#   - yarn install (to have wp-env available)
########################################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PLUGIN_PATH="/var/www/html/wp-content/plugins/wordpress-seo"
OVERRIDE_FILE="$PROJECT_DIR/.wp-env.override.json"

# Parse arguments.
MULTISITE=false
COVERAGE=false
PHP_VERSION=""
WP_VERSION=""
PHPUNIT_ARGS=()

for arg in "$@"; do
  case "$arg" in
    --multisite)
      MULTISITE=true
      ;;
    --coverage)
      COVERAGE=true
      ;;
    --php=*)
      PHP_VERSION="${arg#--php=}"
      ;;
    --wp=*)
      WP_VERSION="${arg#--wp=}"
      ;;
    *)
      PHPUNIT_ARGS+=("$arg")
      ;;
  esac
done

# Add --no-coverage unless --coverage was explicitly requested.
if [ "$COVERAGE" = false ]; then
  PHPUNIT_ARGS+=("--no-coverage")
fi

# Verify Docker is running.
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker and try again."
  exit 1
fi

# Verify vendor directory exists.
if [ ! -d "$PROJECT_DIR/vendor" ]; then
  echo "Error: vendor/ directory not found. Run 'composer install' first."
  exit 1
fi

cd "$PROJECT_DIR"

# Handle PHP/WP version overrides via .wp-env.override.json.
NEEDS_RESTART=false

if [ -n "$PHP_VERSION" ] || [ -n "$WP_VERSION" ]; then
  # Build the override JSON.
  OVERRIDE_JSON="{"
  FIRST=true

  if [ -n "$PHP_VERSION" ]; then
    OVERRIDE_JSON+="\"phpVersion\":\"$PHP_VERSION\""
    FIRST=false
  fi

  if [ -n "$WP_VERSION" ]; then
    if [ "$FIRST" = false ]; then
      OVERRIDE_JSON+=","
    fi
    # wp-env expects a GitHub reference for core version.
    if [ "$WP_VERSION" = "trunk" ] || [ "$WP_VERSION" = "nightly" ]; then
      OVERRIDE_JSON+="\"core\":\"WordPress/WordPress\""
    else
      OVERRIDE_JSON+="\"core\":\"WordPress/WordPress#$WP_VERSION\""
    fi
  fi

  OVERRIDE_JSON+="}"

  # Check if override file needs updating.
  if [ -f "$OVERRIDE_FILE" ]; then
    CURRENT_OVERRIDE=$(cat "$OVERRIDE_FILE")
    if [ "$CURRENT_OVERRIDE" != "$OVERRIDE_JSON" ]; then
      NEEDS_RESTART=true
    fi
  else
    NEEDS_RESTART=true
  fi

  echo "$OVERRIDE_JSON" > "$OVERRIDE_FILE"
fi

# Start wp-env if not already running, or restart if config changed.
if [ "$NEEDS_RESTART" = true ]; then
  echo "Configuration changed. (Re)starting wp-env..."
  npx wp-env start --update
elif ! npx wp-env run tests-cli -- wp --info > /dev/null 2>&1; then
  echo "Starting wp-env..."
  npx wp-env start
fi

# Patch wp-tests-config.php to match the standard WP test environment.
# wp-env sets values that differ from the standard install-wp-tests.sh setup:
# - WP_HOME/WP_SITEURL hardcoded to localhost (breaks tests that override home URL).
# - WP_TESTS_DOMAIN set to localhost:port (should be example.org like standard setup).
# - WP_ENVIRONMENT_TYPE set to 'local' (Yoast skips indexable creation on non-production).
WP_TESTS_CONFIG="/wordpress-phpunit/wp-tests-config.php"
npx wp-env run tests-cli -- bash -c "\
  sed -i '/define.*WP_SITEURL/d; /define.*WP_HOME/d' $WP_TESTS_CONFIG && \
  sed -i \"s/define( 'WP_TESTS_DOMAIN', 'localhost:[0-9]*' )/define( 'WP_TESTS_DOMAIN', 'example.org' )/\" $WP_TESTS_CONFIG && \
  sed -i \"s/define( 'WP_ENVIRONMENT_TYPE', 'local' )/define( 'WP_ENVIRONMENT_TYPE', 'production' )/\" $WP_TESTS_CONFIG \
" > /dev/null 2>&1

# Install PCOV coverage driver if --coverage was requested and it's not already installed.
if [ "$COVERAGE" = true ]; then
  if ! npx wp-env run tests-cli -- php -m 2>/dev/null | grep -q pcov; then
    echo "Installing PCOV coverage driver..."
    npx wp-env run tests-cli -- sudo bash -c "\
      pecl install pcov > /dev/null 2>&1 && \
      echo 'extension=pcov.so' > /usr/local/etc/php/conf.d/docker-php-ext-pcov.ini \
    " > /dev/null 2>&1
  fi
fi

# Build the environment variables prefix for the command.
ENV_PREFIX="WP_TESTS_DIR=/wordpress-phpunit/"

if [ "$MULTISITE" = true ]; then
  ENV_PREFIX="WP_TESTS_DIR=/wordpress-phpunit/ WP_MULTISITE=1"
fi

echo "Running integration tests..."
npx wp-env run tests-cli \
  --env-cwd="$PLUGIN_PATH" \
  -- env $ENV_PREFIX \
  php vendor/phpunit/phpunit/phpunit \
  -c phpunit-wp.xml.dist \
  "${PHPUNIT_ARGS[@]}"
