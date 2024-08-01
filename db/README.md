# Local Database

The `ProgrammerType` application is hosted on GitHub Pages, providing a zero-cost solution. Due to this architecture,
most of our application is hardcoded, which presents a challenge; We lack a database for test examples.

While there are various solutions to this issue, many come with costs or restrictions (such as the GitHub API). Our
workaround is to host the database within the GitHub repository itself. Although this approach doesn’t scale well, it
suits our needs given the limited scope and number of tests for this web application.

As a result of this design decsion, this folder (`./db`) is used as a pseudo-backend for application tests. Test suites
and API's for accessing that data is held here.
