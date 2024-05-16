/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    id_comment: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    date: {
      type: 'TEXT',
      notNull: true
    }
  })
  pgm.addConstraint('comment_likes', 'fk_comment_likes.id_comment_comments.id', 'FOREIGN KEY(id_comment) REFERENCES comments(id) ON DELETE CASCADE')
  pgm.addConstraint('comment_likes', 'fk_comment_likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropTable('comment_likes')
}
