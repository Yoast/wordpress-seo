# 1. Record architecture decisions

Date: 2021-12-13

## Status

Accepted

## Context

We want clean code. Part of that is to limit a code file to a single responsibility.

## Decision

Each code file (including but not limited to `.php`, `.js`, `.ts`, `.sh`) should have a single responsibility.
As a consequence of that decision:
- Interfaces, Types, Classes and global functions should get their own file.
- every JavaScript / TypeScript file should have a `default export` statement exporting the single element defined in the file.

## Consequences

- the number of files will increase.
- each file in the repository will be more explicit in its purpose.
- splitting up existing files should be done with some care; preferably one element at a time, to be able to correct any breaking import statements one at a time.