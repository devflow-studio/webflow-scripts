describe('Hello World', () => {
    // listen to console.log - output should be 'Hello World'
    it('should log "Hello World"', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation();
        await import('./index.ts');
        expect(logSpy).toHaveBeenCalledWith('Hello, world!');
        logSpy.mockRestore();
    })
});