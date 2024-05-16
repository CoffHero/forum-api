/* istanbul ignore file */
const ServerTestHelper = {
  async generateAccessToken (server) {
    const userPayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia'
    }
    const responseAddUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload
    })
    const { id: owner } = (JSON.parse(responseAddUser.payload)).data.addedUser

    const authPayload = {
      username: userPayload.username,
      password: userPayload.password
    }

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: authPayload
    })
    const { accessToken } = (JSON.parse(responseAuth.payload)).data

    return { accessToken, owner }
  }
}

module.exports = ServerTestHelper
