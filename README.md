[![pipeline status](https://gitlab.com/noraj/rawsec-cybersecurity-list/badges/master/pipeline.svg)](https://gitlab.com/noraj/rawsec-cybersecurity-list/commits/master)
[![License](https://img.shields.io/github/license/noraj/rawsec-cybersecurity-inventory.svg)](https://gitlab.com/noraj/rawsec-cybersecurity-list/blob/master/LICENSE)
[![Discord](https://img.shields.io/discord/437247125508587540.svg?style=flat&logo=discord)](https://discord.gg/Wspwv2h)

# Rawsec's Cybersecurity Inventory

Name            | Link
---             | ---
Website         | [link](https://list.rawsec.ml)
Git repository  | [link](https://gitlab.com/noraj/rawsec-cybersecurity-list)
Merge Requests  | [link](https://gitlab.com/noraj/rawsec-cybersecurity-list/merge_requests)
Issues          | [link](https://gitlab.com/noraj/rawsec-cybersecurity-list/issues)
Wiki            | [link](https://gitlab.com/noraj/rawsec-cybersecurity-list/wikis/home)
Chat            | [link](https://discord.gg/Wspwv2h)

## Development

### Install and build

Install dependencies:

```
$ npm install gulp-cli -g
$ npm install
```

Now you can simply build the site by using the following command:

```
$ gulp
```

The build output reside inside the `build/` folder.

For example you can view it with Firefox:

```
$ firefox build/index.html
```

### Tree view

Templates are written in Pug. The layout used for pages is `pug/layout/layout.pug`. Pages are at the root of `pug/` folder. Layout and pages use some partials stored in `pug/partials/`. All libraries and external scripts are stored in `vendor/` but internal scripts are in `js/`. CSS customizations are made in `sass/bulma.sass`.

### Indentation

Please use [EditorConfig](http://EditorConfig.org) defined in `.editorconfig`.

### Contribution Guidelines

See [Contribution Guidelines](https://list.rawsec.ml/contribute.html).

### About

See [About](https://list.rawsec.ml/about.html).
