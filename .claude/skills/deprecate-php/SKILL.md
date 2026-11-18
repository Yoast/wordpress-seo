---
name: deprecate-php
description: Deprecate PHP methods, classes, filters, and actions in this repo following the official deprecation guide. The full procedure lives in DEPRECATING.md so it can be shared with Cursor, human contributors, and any other tool. This skill is a thin pointer; edit the guide, not this file, when the process changes.
user_invocable: true
---

# deprecate-php

Read [`DEPRECATING.md`](../../../DEPRECATING.md) and follow it exactly. That file is the single source of truth for deprecating PHP in this repo and is shared across tools.

@../../../DEPRECATING.md

The guide itself references:

- [`AGENTS.md`](../../../AGENTS.md): agent behaviour rules, including the pointer to the guide.
- [`config/dependency-injection/deprecated-classes.php`](../../../config/dependency-injection/deprecated-classes.php): the DI container's deprecated-classes list.

If any step in the guide appears to conflict with `AGENTS.md` or `.github/CONTRIBUTING.md`, the rule files win. Edit them, then update the guide.
