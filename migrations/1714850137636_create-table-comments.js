/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    id_thread: {
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
  pgm.addConstraint('comments', 'fk_comment.id_thread_threads.id', 'FOREIGN KEY(id_thread) REFERENCES threads(id) ON DELETE CASCADE')
  pgm.addConstraint('comments', 'fk_comment.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropTable('comments')
}
