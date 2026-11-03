# Put your own copy online

**Online** means other people can open your project with a link. The [original demo](https://annamariadirella-coder.github.io/fare-signal/) is already online. These steps are for your own copy.

Share only this made-up example. Keep any private train watcher, tickets, keys and message history private.

## Make a home on GitHub

GitHub stores project folders. It calls each one a **repository**, or **repo**.

1. Create a new empty repo in your account. You can call it `fare-signal`. Choose **Public** only if you want everyone to see its files. Do not add another README or license during creation.
2. Download this project's ZIP and unzip it. Look through the files before sharing. Do not add real keys, tickets or private messages.
3. Open a terminal in the folder with `package.json`. Run these commands one at a time:

```sh
npm test
npm run check
npm run build
```

4. Use GitHub's on-screen instructions to save the folder with Git and send it to the new repo. Git calls these steps **commit** and **push**. Use `main` as the branch name. A branch is one line of saved changes.
5. Add a short description. You can copy the one in [Show a friend](PRESENTING.md).

Git ignores `dist/`, extra packages and local environment files. Share the source files, guides and screenshots. Start a fresh Git history; do not copy the history of a private project.

## Turn it into a website

**GitHub Pages** is GitHub's website hosting tool. The included recipe, called a **workflow**, runs only when you ask it to. It does not watch real train prices.

1. Open your repo's **Settings → Pages**.
2. Choose **GitHub Actions** as the source.
3. Open **Actions → Deploy demo to GitHub Pages → Run workflow**. Choose `main` and start it.
4. Wait for the green success result. Open the website link GitHub gives you.
5. Try a check, then check again. You should see two pretend messages, then no new ones. Also try it on a phone or narrow screen.
6. Put that working link in your repo's **About → Website** box and at the top of your README.

Your account and repo settings may affect whether Pages is available. The workflow asks for permission to publish the website.

## Use another website host

Run `npm run build`. Give your chosen static website host the contents of `dist/`. A static host serves files; this demo needs no secret keys or special server program.

## Before sharing the link

Check the pictures and guide links. Keep the notices saying the data is pretend. Say a test passed only after it has passed. The automatic file check catches only some secret patterns; look through the files yourself too.
