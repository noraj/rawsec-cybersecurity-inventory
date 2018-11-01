---
id: format
title: Format conventions
---
## General

- **Mimetism**: Before submitting anything read the source code and do the same
- Use [**EditorConfig**][editorconfig] to maintain the coding style, there is `.editorconfig` file on the repository

## Contribution

- Description begins with an uppercase letter and doesn't end with a dot (`.`)
- Items should be sorted alphabetically

## Development

- Use [**pug-lint**][puglint] to ensure good pug coding style if you have to modify the templates
- Never use spaces
  + use hyphen (`-`) for *classes* or *IDs*
  + use underscore (`_`) for *filenames*
- If you have a doubt, read the code, it's easy to understand

[editorconfig]:http://editorconfig.org/
[puglint]:https://www.npmjs.com/package/pug-lint
