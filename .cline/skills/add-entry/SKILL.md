---
name: add-entry
description: Add a new entry (tool, resource, etc.) to the inventory.
---

# My Skill

Add the entry. Add BlackArch package name if existing. Create author mention message.

## Steps

1. Add the entry (tool, resource, etc.) in the correct category following the rules.
2. Run `pacman -Ss <tool_name>` to check if the tool exists in BlackArch or ArchLinxu repository. If it is the case add a `"blackarch"` JSON node to the entry with the corresponding package name.
3. Check the author's github profile (e.g. https://github.com/noraj) or website homepage (only, don't crawl) for the entry (e.g. https://github.com/noraj/unisec) to find if the author as a X / Twitter profile. If yes, append the following message at the end of the task (replacing placeholders): ``` <entry_name> by `@twitter_handle` ``` (e.g. ``` unisec by `@noraj_rawsec` ```). If the github namespace is a company or organization, also check for the top contributor (https://github.com/<company>/<project>/graphs/contributors?all=1) and check if the top contributor has a X / Twitter profile too, in that case aim the message to be ``` <entry_name> by `@to_contrib_twitter_handle` at `@company_twitter_handle` ```. Really add the backquotes around the X / Twitter handle. Else, if author has no X / Twitter profile, replace `@twitter_handle` by Github profile name or real name.
