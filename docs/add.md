---
id: add
title: Adding a tool/resource
---
## Adding/changing content

- To add a tool/resource or modify/update some content: Submit a merge request (MR)
- Description should be clear, concise, and non-promotional
- Respect the [format conventions](format.md)
- Write in English only
- Fill the maximum you know about an item but prefer to let a field blank if you don't know
  + Example: if you don't know the language of a tool, just dont put it
- Don't submit deprecated or abandoned tools
- Website and source must be the official ones, don't put one of those if is non-existent
- Make you Merge Request into the `dev` branch not into master
- Find the right JSON file in the `data/` folder and add your tool or resource, it's easy
  + Example 1: `data/tools/osint.json` for an OSINT tool
  + Example 2: `data/ctf_platforms/jeopardy.json` for a jeopardy CTF platform

Example of JSON data for a tool:

```json
    {
      "name": "ROPgadget",
      "website": "http://shell-storm.org/project/ROPgadget/",
      "source": "https://github.com/JonathanSalwan/ROPgadget",
      "description": "Framework for ROP exploitation",
      "language": "Python",
      "price": "Free",
      "online": "False"
    }
```

## A Step by Step Guide to Making Your First GitLab Contribution

Contribute to your first open source project in just 10 minutes.

If it is the first time you make a contribution to an open-source project you are maybe not comfortable with using `git` command line, repository forking, merge/pull request, git branches, etc.

There is a great tutorial for GitHub named [A Step by Step Guide to Making Your First GitHub Contribution](https://codeburst.io/a-step-by-step-guide-to-making-your-first-github-contribution-5302260a2940) that I used to create this tutorial.

### Create a GitLab account

Go to the [register page](https://gitlab.com/users/sign_in#register-pane).

You can create a dedicated GitLab account (recommended) or sign in with an external account: Google, Twitter, GitHub, Bitbucket.

### Fork the repository

Fork the repository by clicking on the fork button on the top of the page. This will create a copy of this repository in your account.

![](https://i.imgur.com/CyP9V2e.png)

### Clone the repository

Now clone your forked repository to your machine. Go to the clone area and then click the copy to clipboard icon.

![](https://i.imgur.com/eiBfjz9.png)

Open a terminal and run the following git command:

```plaintext
git clone 'url of the forked repository'
```

where 'url of the forked repository' (without the quote marks) is the url to the repository.

For example:

```plaintext
git clone git@gitlab.com:your_pseudo/rawsec-cybersecurity-list.git
```

where `your_pseudo` is your GitLab username. Here you're copying the contents of the forked repository in GitLab to your computer.

### Create a branch

Change to the repository directory on your computer (if you are not already there):

```plaintext
cd rawsec-cybersecurity-list
```

Now create a branch using the git checkout command:

```plaintext
git checkout -b <add-your-name>
```

For example:

```plaintext
git checkout -b add-my-tool
```

### Make necessary changes and commit those changes

Now open `CONTRIBUTORS.txt` file in a text editor, add your name to it, and then save the file. If you go to the project directory and execute the command `git status`, you'll see there are changes. Add those changes to the branch you just created using the `git add` command:

```plaintext
git add CONTRIBUTORS.txt
```

Now commit those changes using the `git commit` command:

```plaintext
git commit -m "Add <your-name> to Contributors list"
```

replacing `<your-name>` with your name.

You can add a tool or resource on `data/` and do the same process again.

### Push changes to GitLab

Push your changes using the command `git push`:

```plaintext
git push origin <branch-name>
```

replacing <branch-name> with the name of the branch you created earlier.

### Submit your changes for review

If you go to your repository on GitLab, you can go to `Merge Requests` on the left sidebar and then click `New merge request`.

![](https://i.imgur.com/xOLlQb3.png)

Then you will be able to select the source project (your forked project) and branch (the one you created), and the target project (the original repository) and branch (here the `dev` branch).

Click `Compare branches and continue`.

![](https://i.imgur.com/i4oV5iG.png)

Write a good title and description.

![](https://i.imgur.com/7t0oVws.png)

Now submit the merge request.

Soon someone will be merging all your changes into the dev and the master branch of this project. You will get a notification email once the changes have been merged.

The master branch of your fork won't have the changes. In order to keep your fork synchronized with the original repository, follow the steps below.

### Keeping your fork synced with this repository

First, switch to the master branch.

```plaintext
git checkout master
```

Then add the original repo's url as `upstream remote url`:

```plaintext
git remote add upstream https://gitlab.com/rawsec/rawsec-cybersecurity-list.git
```

This is a way of telling git that another version of this project exists in the specified url and we're calling it `upstream`. Once the changes are merged, fetch the new version of the original repository:

```plaintext
git fetch upstream
```

Here we're fetching all the changes in the original fork (upstream remote). Now, you need to merge the new revision of the original repository into your master branch.

```plaintext
git rebase upstream/master
```

Here you're applying all the changes you fetched to master branch. If you push the master branch now, your fork will also have the changes:

```plaintext
git push origin master
```

Notice here you're pushing to the remote named origin.

At this point I have merged your branch `<branch-name>` into the original master branch, and you have merged the original master branch into your own master branch. Your branch is now no longer needed, so you may delete it:

```plaintext
git branch -d <branch-name>
```

and you can delete the version of it in the remote repository (your forked one), too:

```plaintext
git push origin --delete <branch-name>
```

This isn't necessary, but the name of this branch shows its rather special purpose. Its life can be made correspondingly short.

### You did it!

You now have the skills to contribute to open source projects across the web. Go forth and build!
