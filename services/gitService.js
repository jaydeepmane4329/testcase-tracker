import simpleGit from "simple-git";

const git = simpleGit();

export const initializeGitRepo = async (repoPath) => {
  try {
    await git.cwd(repoPath);
    await git.init();
    console.log(`Initialized Git repository at ${repoPath}`);
  } catch (err) {
    console.error('Failed to initialize Git repository:', err);
  }
};

export const gitPull = async () => {
  try {
    await git.pull();
    console.log('Pulled latest changes');
  } catch (err) {
    console.error('Failed to pull changes:', err);
  }
};

export const gitPush = async () => {
  try {
    await git.push();
    console.log('Pushed changes to remote');
  } catch (err) {
    console.error('Failed to push changes:', err);
  }
};

export const gitFetch = async () => {
  try {
    await git.fetch();
    console.log('Fetched latest changes');
  } catch (err) {
    console.error('Failed to fetch changes:', err);
  }
};

export const gitRemove = async (filePath) => {
  try {
    await git.rm(filePath);
    console.log(`Removed ${filePath}`);
  } catch (err) {
    console.error('Failed to remove file:', err);
  }
};