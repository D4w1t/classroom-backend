import('./dist/index.js')
  .then(() => {
    // dist/index.js started the server
  })
  .catch((err) => {
    console.error('Failed to start app from dist/index.js:', err);
    process.exit(1);
  });
