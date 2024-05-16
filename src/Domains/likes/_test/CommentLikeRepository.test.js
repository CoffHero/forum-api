const CommentRepository = require('../CommentLikeRepository')

describe('CommentLikesRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const commentRepository = new CommentRepository()

    await expect(commentRepository.checkingCommentLike('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.addCommentLike('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.getCommentIdFromCommentLike('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentRepository.deleteCommentLike('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
