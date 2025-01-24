describe('Hello World', () => {
  // listen to console.log - output should be 'Hello World'
  it('should log "Hello, world!"', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation()
    await import('./index')
    expect(logSpy).toHaveBeenCalledWith('Hello, world!')
    logSpy.mockRestore()
  })
})
