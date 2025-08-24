build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom']
      }
    }
  }
}