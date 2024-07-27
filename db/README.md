# Local Database

The “programmer-type” application is hosted on GitHub Pages, providing a zero-cost solution. Due to this architecture,
most of our application is hardcoded, which presents a challenge: we lack a database for test examples.

While there are various solutions to this issue, many come with costs or restrictions (such as the GitHub API). Our
workaround is to host the database within the GitHub repository itself. Although this approach doesn’t scale well, it
suits our needs given the limited scope and number of tests for this web application.

As a result, we store assets in the `./assets` folder, and within the `./db` folder, we have JavaScript APIs to access
these assets.
