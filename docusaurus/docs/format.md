---
id: format
title: Format conventions
---
## General

- **Mimetism**: Before submitting anything read the source code and do the same
- Use [**EditorConfig**][editorconfig] to maintain the coding style, there is `.editorconfig` file on the repository

## Contribution

- Items should be sorted alphabetically
- Description begins with an uppercase letter and doesn't end with a dot (`.`)
- Description should not contain the word `tool` if the item is a tool as it is already implicit per the meta-category named `Tools`
- Description should be clear, concise, and non-promotional
- Description should not contain the language since it is already in the `language` field
- The `keywords` field should not contain words that are already in the description

## Development

- Use [**pug-lint**][puglint] to ensure good pug coding style if you have to modify the templates
- Never use spaces
  - use hyphen (`-`) for _classes_ or _IDs_
  - use underscore (`_`) for _filenames_
- If you have a doubt, read the code, it's easy to understand

[editorconfig]: http://editorconfig.org/

[puglint]: https://yarnpkg.com/package/pug-lint
