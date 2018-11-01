---
id: tree
title: Directory structure
---

```plaintext
├── build/ # The build output reside inside here
├── CONTRIBUTORS.txt
├── COPYRIGHT
├── data/ # JSON files where tools and resources are stored
├── docs # Documentation source files
├── docusaurus # Documentation project
├── gulpfile.js # Building script
├── img/ # Badges and logos are here
├── js/
│   ├── auto-font-mfizz.js # Add mini logo for OS and languages
│   ├── sweetalert2.js # Popup alert
│   └── tablefilter/ # Table filtering for each category
├── LICENSE
├── make-scripts/
│   └── static-json-api.js # Build the static JSON API
├── node_modules/ # Installed dependencies
├── package.json
├── package-lock.json
├── pug/ # Contains the root pages
│   ├── content/ Template for each category of tools or resources
│   ├── layout/
│   │   └── layout.pug # The global layout template
│   ├── mixins/ # Library of methods
│   └── partials/ # Piece of pages
├── README.md
├── sass
│   └── bulma.sass # Where the style is defined
└── temp # Temporary folder for building the static JSON API
```
