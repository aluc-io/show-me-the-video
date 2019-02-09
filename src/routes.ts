
import routes from 'next-routes'

const { Link, Router } = new routes()
  .add({ name: 'doc', page: 'doc', pattern: '/doc/:repoIdx/:docId' })

export { Link, Router }
