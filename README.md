# University of Wisconsin - Grand Parents University Programming Interface
## Setting up the website locally
1. Clone the repo, and install packages using `cd my-blockly-app && npm install`. This will be refactored later. 
2. Run the website using: `npm start`.

## Deploying to gh-pages
1. Enter the project folder: `cd my-blockly-app` and run `npm run build`
2. Once it finishes creating a `build` directory, add it to a commit: `git add build -f && git commit -m "Updating gh-pages"`
3. Go to the root of the project repo `cd ..` and run `npm run push:gh` to push the commit to the gh-pages branch of the project.

meeting summary: https://docs.google.com/document/d/1yiP5RGhGlt1jDpcLmFWMmmB_ZOaYFGEPU6BrZYBU84w/edit