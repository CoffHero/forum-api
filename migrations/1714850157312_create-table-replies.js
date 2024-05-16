/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    id_comment: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    content: {
      type: 'TEXT',
      notNull: false
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    date: {
      type: 'TEXT',
      notNull: true
    },
    del: {
      type: 'BOOLEAN',
      notNull: true,
      default: false
    }
  })
  pgm.addConstraint('replies', 'fk_replies.id_comment_comments.id', 'FOREIGN KEY(id_comment) REFERENCES comments(id) ON DELETE CASCADE')
  pgm.addConstraint('replies', 'fk_replies.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropTable('replies')
}
