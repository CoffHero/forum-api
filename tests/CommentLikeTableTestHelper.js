/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentLikeTableTestHelper = {
  async addCommentLike ({
    id = 'commentLike-123', commentId = 'comment-123', owner = 'user-123', time = new Date()
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4)',
      values: [id, commentId, owner, time]
    }

    await pool.query(query)
  },

  async getCommentLikeById (commentLikeId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [commentLikeId]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM comment_likes WHERE 1=1')
  }
}

module.exports = CommentLikeTableTestHelper
