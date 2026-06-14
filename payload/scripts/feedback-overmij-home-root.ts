/**
 * Make the "Home" menu item on the over-mij page point to the site root ("/")
 * instead of to voor-particulieren. Uses the absolute-path-anchor convention
 * supported by TheHeader.vue: a menuItem whose `anchor` is an absolute path
 * links straight to that route. The `page` relationship stays as a populated
 * placeholder (required field); the link target comes from the anchor.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const OVER_MIJ = 54

async function run() {
  const payload = await getPayload({ config })
  const page = await payload.findByID({ collection: 'pages', id: OVER_MIJ, depth: 0 })
  const menuItems = [...((page.menuItems ?? []) as Array<Record<string, unknown>>)]

  const home = menuItems.find((m) => m.label === 'Home')
  if (!home) {
    console.log('No "Home" menu item found on over-mij — nothing to do.')
    return
  }
  if (home.anchor === '/') {
    console.log('over-mij "Home" already points to "/" — skipping.')
    return
  }
  home.anchor = '/'

  await payload.update({
    collection: 'pages',
    id: OVER_MIJ,
    data: { menuItems } as never,
    context: { skipDeploy: true },
  })
  console.log('over-mij "Home" menu item now links to the site root ("/").')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
