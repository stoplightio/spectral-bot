# spectral-bot

Spectral-bot is a GitHub based pull request bot that lints your OpenAPI Specification (2 or 3) documents or any JSON object. It uses the [Probot](https://github.com/probot/probot) framework and uses [Spectral](https://github.com/stoplightio/spectral) for linting. 

## Getting Started (Running on Glitch, adapted from Probot docs) 

To get your own Glitch-hosted Probot up-and-running, follow these steps. If you need more detail, the [Probot Docs](https://probot.github.io/docs/development/#configuring-a-github-app) are a great place to go to learn more.

1. [Configure a new app on GitHub](https://github.com/settings/apps/new) with the files from this project.
    - Hit the "Show" button on the top left of this page to find the URL. It will look something like `https://random-word.glitch.me/probot`, except the domain will be specific to your app.
    - For the Webhook URL, use this URL (again, updating the domain to match yours): `https://random-word.glitch.me/`. Notice that we left off the `/probot`.
    - For the Webhook Secret, just use "development".
    until Step 4.
    - Save your changes.
    - On the **Permissions & webhooks** tab, add *read and write permissions* for **Pull requests**, *read permissions* for **Repository contents**, and *read permissions* for **Repository metadata**.
    - On the **Permissions & webhooks** tab, subscribe to **Pull request** events.
    - Save your changes.
    - On the configuration page that comes up after saving, download your private key. It will be saved into a file named `my-app-name.2018-06-20.private-key.pem`, with your app name, and today's date.

2. Click the **Install** tab, and install your app into one of your repositories.

3. Click the **New File** button (at left) and type `.data/private-key.pem`. Then click **Add File**. Open a terminal, and from your download folder run `cat my-app-name.2018-06-20.private-key.pem | pbcopy` (except using your app's name and today's date). In the new file in Glitch, paste the contents of the clipboard.

4. Edit the `.env` file (at left) with your app credentials. 
    - `APP_ID` can be found in the About section of your Github app.
    - `WEBHOOK_SECRET` is the value you generated in Step 2.
    - `PRIVATE_KEY_PATH=` should be set to `.data/private-key.pem`. 
    - `NODE_ENV=` should be set to `production`. 

5. Wait for app to load. A green `Live` label should show up next to the **Show** button when it's finished loading.

6. Add a `.github/config.yml` file to the master branch of repository you installed the bot in with the name of the specification that you want watched. (Note: Right now, speccy-bot only supports one specification per repo.) 

```
targetFiles:
  - spec.yml
```  

7. You can now test it out the app in a repository it is installed in. 