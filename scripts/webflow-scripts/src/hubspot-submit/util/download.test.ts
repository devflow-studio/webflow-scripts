import { downloadFile } from './download'

describe('Download Util', () => {
  describe('func downloadFile', () => {
    it('creates an anchor element and triggers a file download', () => {
      const appendChildSpy = jest.spyOn(document.body, 'appendChild')
      const removeChildSpy = jest.spyOn(document.body, 'removeChild')

      const originalCreateElement = document.createElement

      const mockAnchorClick = jest.fn()
      const createElementSpy = jest
        .spyOn(document, 'createElement')
        .mockImplementation(tagName => {
          if (tagName === 'a') {
            const anchor = originalCreateElement.call(document, 'a')
            anchor.click = mockAnchorClick
            return anchor
          }
          return originalCreateElement.call(document, tagName)
        })

      const url = 'https://example.com/file.pdf'
      const fileName = 'file.pdf'

      downloadFile(url, fileName)

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(appendChildSpy).toHaveBeenCalled()
      expect(mockAnchorClick).toHaveBeenCalled()

      const anchor = appendChildSpy.mock.calls[0]![0] as HTMLAnchorElement
      expect(anchor.href).toBe(url)
      expect(anchor.download).toBe(fileName)
      expect(anchor.target).toBe('_blank')

      expect(removeChildSpy).toHaveBeenCalledWith(anchor)

      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
      createElementSpy.mockRestore()
    })
  })
})
