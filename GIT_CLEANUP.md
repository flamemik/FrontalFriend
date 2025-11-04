Removal and history-purge instructions for accidental 'nul' file

This repository accidentally contains a file named `nul` (a Windows reserved
device name output). Remove it from the working tree and index on your local
machine with:

```bash
# remove from working tree and index, commit the deletion
git rm --cached "nul" || git rm "nul"
git commit -m "chore: remove accidental 'nul' device output file"

# push the deletion
git push origin HEAD
```

If the file was already pushed and you must purge it from the repository
history (destructive operation):

Preferred (requires git-filter-repo):

```bash
pip install git-filter-repo
# remove the file from all commits on current branch
git filter-repo --invert-paths --paths "nul"
# force push the cleaned branch
git push --force-with-lease origin HEAD
```

Legacy (git-filter-branch):

```bash
git filter-branch --index-filter "git rm --cached --ignore-unmatch nul" -- --all
# force push
git push --force --all
```

Notes:
- Rewriting history requires coordination with collaborators.
- We added common Windows device names to `.gitignore` to reduce accidental re-adds.
