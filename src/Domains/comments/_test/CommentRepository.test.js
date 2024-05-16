const CommentRepository = require('../CommentRepository')

describe('CommentRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const commentRepository = new CommentRepository()

    await expect(commentRepository.checkingCommentById('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.verifyCommentByOwner('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.addComment('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.getCommentsByThreadId('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.deleteComment('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
