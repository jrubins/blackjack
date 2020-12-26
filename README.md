# Blackjack

This repository houses the code for the blackjack game at https://jonblackjack.netlify.app.

## Table of Contents

- [Running the project](#running-the-project)
- [Testing](#testing)
- [Code Formatting](#code-formatting)
- [Compilation](#compilation)

## Running the project

To run the project, we'll need to install a couple of dependencies.

### Installing dependencies

This project depends on Node.js and Yarn, so we'll need to get those set up.

**Installing NVM**

To manage Node.js, we'll want to use [NVM](https://github.com/creationix/nvm). NVM is a Node.js version manager and allows you to easily install, switch between and uninstall different Node versions. To install NVM, run:

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
```

This script will clone the NVM repository to `~/.nvm` and add the following to your profile (`~/.bashrc` or `~/.bash_profile`):

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

To verify that nvm has been installed, run:

```
$ command -v nvm
```

which should output `nvm`.

If you run the command `nvm` you should see help output. If you don't see anything, open a new terminal or run the following command:

```
$ source ~/.bash_profile
```

**Installing Node.js**

After NVM has been installed, we'll want to install Node.js. Run the following:

```
$ nvm install v14.15.1
```

After running the above command, you should be able to verify that Node.js and NPM were successfully installed:

```
$ node -v
v14.15.1
$ npm -v
6.14.8
```

**Installing Yarn**

[Yarn](https://yarnpkg.com/) is an alternative to NPM. This project takes advantage of Yarn's PnP and Zero Installs feature.

**We don't recommend installing Yarn via Homebrew as it will also install Node.js if you don't yet have it and you may run into conflicts with what we install via NVM.**

Install Yarn using the following command:

```
$ npm -g install yarn@1.22.10      // <= The version should match the version of yarn in the package.json file.
```

To verify the Yarn installation worked as expected, run the following commands:

```
$ which yarn
/Users/{yourUser}/.nvm/versions/node/v14.15.1/bin/yarn
$ yarn -v
1.22.10
```

### Start the Project

After you've installed the dependencies, you can start running the project. We use `webpack-dev-server` to start a development server. Once you've run the project, you can connect to the development server at [http://localhost:9005](http://localhost:9005).

To **run** the project, run the following command:

```
$ yarn start
```

## Testing

This project uses Jest and React Testing Library for its tests. To get that started, open a new terminal window/tab and run the following command:

```
$ yarn test:watch
```

## Compilation

This project uses [TypeScript](https://www.typescriptlang.org/docs/home.html) to compile its code.

To check for compilation errors from the command line, run:

```
$ yarn compile
```

## Code Formatting

This project uses [Prettier](https://prettier.io/) (an opinionated code formatter) for automatic code formatting and [ESLint](https://eslint.org/) for lint checking. The formatting and linting happen as a Git precommit hook for any files that you currently have staged for commit. Prettier will modify your code files and re-add them to the Git commit. ESLint will likewise try to fix any issues it can and adds those changes as well.
