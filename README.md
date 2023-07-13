# AESR Config Hub

For detailed information, please refer to our dedicated site at [https://aesr.dev/](https://aesr.dev/).

## Getting Started

### Duplicate the Repository

Due to the customizable nature of configurations for each organization, it's essential to duplicate this repository into your own GitHub account, keeping it private to safeguard your configurations. Follow the instructions on [duplicating a repository](https://docs.github.com/repositories/creating-and-managing-repositories/duplicating-a-repository) to create your private copy.

1. Create https://github.com/YOUR_ORG/aesr-config-hub.git as private repository.
2. Open terminal.
3. `git clone --bare https://github.com/tilfinltd/aesr-config-hub.git`
4. `cd aesr-config-hub.git`
5. `git push --mirror https://github.com/YOUR_ORG/aesr-config-hub.git`
6. `cd ..`
7. `rm -rf aesr-config-hub.git`

### Initial Setup

1. Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
2. Inside the repository, run `npm install` to install all necessary dependencies across the workspace.
