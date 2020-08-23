---
id: api
title: Application Programming Interface
---
The website is serving a static API, this means that the API is compiled when during website building and then only a static directory structure of JSON files is served.

## Location

Once you have [built](install.md) the website using `gulp`, you'll find the api inside `build/api`.

Then the API is server under `https://inventory.raw.pm/api/api.json`.

**Note**: as the API is static, you need to call the full path including the filename and extension, ex: `/api/api.json` not only `/api/`. The filename is always the same as the parent folder.

## Examples of commands

Get all the data:

```plaintext
https://inventory.raw.pm/api/api.json
```

Get all CTF platforms:

```plaintext
https://inventory.raw.pm/api/ctf_platforms/ctf_platforms.json
```

Get all jeopardy CTF platforms:

```plaintext
https://inventory.raw.pm/api/ctf_platforms/jeopardy/jeopardy.json
```

Then `jeopardy` is a leaf category so there is a key called `items` giving the number of elements.
Here it is displaying `41`, so we know we can call the API to get jeopardy CTF platforms from `0` to `40`.

After the leaf category, here `jeopardy`, you need to call the type of item listed, here `ctf_platforms`, this is the same name as the root category.

Get a tool or ressource individually:

```plaintext
https://inventory.raw.pm/api/ctf_platforms/jeopardy/ctf_platforms/28/28.json
```

Note that some category of resources can have an undetermined number of links. You can still find the resource with `https://inventory.raw.pm/api/resources/trainings_and_courses/resources/0/0.json`, but ypu will also be able to enumerate all the links like this `https://inventory.raw.pm/api/resources/trainings_and_courses/resources/0/links/links.json` or just obtain one line this `https://inventory.raw.pm/api/resources/trainings_and_courses/resources/0/links/0/0.json`.

If you have a doubt on how to call the API, take a look at the directory structure below.

## Directory structure

Example:

```plaintext
build/api
├── api.json
├── ctf_platforms
│   ├── attack_defense
│   │   ├── attack_defense.json
│   │   └── ctf_platforms
│   │       ├── 0
│   │       │   └── 0.json
│   │       ├── 1
│   │       │   └── 1.json
│   │       ├── 2
│   │       │   └── 2.json
│   │       └── ctf_platforms.json
│   ├── ctf_platforms.json
│   ├── hybrid
│   │   ├── ...
│   └── jeopardy
│       ├── ...
├── operating_systems
│   ├── maintained
│   │   ├── ...
│   ├── no_more_maintained
│   │   ├── ...
│   ├── operating_systems.json
│   └── project_transferred
│       ├── ...
├── resources
│   ├── ...
│   ├── challenges_platforms
│   │   ├── ...
│   ├── cve
│   │   ├── ...
│   ├── events
│   │   ├── ...
│   ├── knowledge_and_tools
│   │   ├── ...
│   ├── national_security_agencies_and_services
│   │   ├── ...
│   ├── non_english
│   │   ├── ...
│   ├── resources.json
│   ├── trainings_and_courses
│   │   ├── resources
│   │   │   ├── 0
│   │   │   │   ├── 0.json
│   │   │   │   └── links
│   │   │   │       ├── 0
│   │   │   │       │   └── 0.json
│   │   │   │       └── links.json
│   │   │   ├── 1
│   │   │   │   ├── 1.json
│   │   │   │   └── links
│   │   │   │       ├── 0
│   │   │   │       │   └── 0.json
│   │   │   │       └── links.json
│   │   │   └── resources.json
│   │   └── trainings_and_courses.json
│   ├── tutorials
│   │   ├── ...
│   └── writeups_collections_and_challenges_source
│       ├── ...
└── tools
    ├── binary_exploitation
    │   └── ...
    ├── bug_bounty
    │   └── ...
    ├── code_analysis
    │   └── ...
    ├── collaboration_report
    │   └── ...
    ├── configuration_audit
    │   └── ...
    ├── cracking
    │   └── ...
    ├── cryptography
    │   ├── cryptography.json
    │   └── tools
    │       ├── 0
    │       │   └── 0.json
    │       ├── 1
    │       │   └── 1.json
    │       ├── 2
    │       │   └── 2.json
    │       ├── 3
    │       │   └── 3.json
    │       ├── 4
    │       │   └── 4.json
    │       ├── 5
    │       │   └── 5.json
    │       └── tools.json
    ├── digital_forensics
    │   └── ...
    ├── intentionally_vulnerable_applications
    │   └── ....
    ├── networking
    │   └── ...
    ├── osint
    │   └── ...
    ├── other
    │   └── ...
    ├── reverse_engineering
    │   └── ...
    ├── steganography
    │   └── ...
    ├── system_exploitation
    │   └── ...
    ├── tools.json
    ├── vulnerability_assessment
    │   ├── ...
    ├── web_application_exploitation
    │   ├── ...
    └── wireless
        ├── ...

```

## Showcase

Rawsec's CyberSecurity Inventory has a nice [Twitter bot](https://inventory.raw.pm/features.html#twitter-bot) that posts a tool or resource per day.

This bot was built in Ruby using the static API.

You can find the bot's script [here](https://gitlab.com/rawsec/rawsec-inventory-twitter-bot/blob/master/twitterBot.rb) as an example of use.
The script is only 84 lines long (including comments), showing how easy it is to build a complete app using the API.
