# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Plan: Hash-Based URL Navigation

## Context
The app has zero URL awareness -- all navigation state (current amud, parsha, aliya) lives in React state inside `useTikkun`. When you navigate to a parsha or scroll to amud 150, the URL bar still shows `/`. You can't bookmark, share, or refresh without losing your place. This adds hash-based URL routing (`/#/amud/42`, `/#/בראשית/בראשית/3`) with zero dependencies, compatible with GitHub Pages.

## URL Scheme...

