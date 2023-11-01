---
layout: default
title: Installation and building
parent: Development guidelines
nav_order: 1
---
- TOC
{:toc}

## Inventory

Install dependencies:

```plaintext
$ yarn global add gulp-cli
$ yarn install
```

Now you can simply build the site by using the following command:

```plaintext
$ gulp
```

The build output reside inside the `build/` folder.

For example you can view it with Firefox:

```plaintext
$ firefox build/index.html
```

## Documentation

Go inside the documentation folder:

```plaintext
$ cd documentation
```

Install dependencies:

```plaintext
$ bundle install install
```

Build the documentation:

```plaintext
$ bundle exec jekyll build
```

You can manually browse it in the `build/` (`documentation/_site_/`) folder or run `bundle exec jekyll serve`.

For more information on how the documentation works, check [Jekyll](https://jekyllrb.com/docs/) and [Just the Docs](https://just-the-docs.com/) websites.
