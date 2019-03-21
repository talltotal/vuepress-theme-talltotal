export const hashRE = /#.*$/
export const extRE = /\.(md|html)$/
export const endingSlashRE = /\/$/
export const outboundRE = /^(https?:|mailto:|tel:)/

export function normalize (path) {
  return decodeURI(path)
    .replace(hashRE, '')
    .replace(extRE, '')
}

export function getHash (path) {
  const match = path.match(hashRE)
  if (match) {
    return match[0]
  }
}

export function isExternal (path) {
  return outboundRE.test(path)
}

export function isMailto (path) {
  return /^mailto:/.test(path)
}

export function isTel (path) {
  return /^tel:/.test(path)
}

export function ensureExt (path) {
  if (isExternal(path)) {
    return path
  }
  const hashMatch = path.match(hashRE)
  const hash = hashMatch ? hashMatch[0] : ''
  const normalized = normalize(path)

  if (endingSlashRE.test(normalized)) {
    return path
  }
  return normalized + '.html' + hash
}

export function isActive (route, path) {
  const routeHash = route.hash
  const linkHash = getHash(path)
  if (linkHash && routeHash !== linkHash) {
    return false
  }
  const routePath = normalize(route.path)
  const pagePath = normalize(path)
  return routePath === pagePath
}

export function resolvePage (pages, rawPath, base) {
  if (base) {
    rawPath = resolvePath(rawPath, base)
  }
  const path = normalize(rawPath)
  for (let i = 0; i < pages.length; i++) {
    if (normalize(pages[i].path) === path) {
      return Object.assign({}, pages[i], {
        type: 'page',
        path: ensureExt(rawPath)
      })
    }
  }
  console.error(`[vuepress] No matching page found for sidebar item "${rawPath}"`)
  return {}
}

function resolvePath (relative, base, append) {
  const firstChar = relative.charAt(0)
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '..') {
      stack.pop()
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

export function resolveSidebarItems (page, route, site, localePath) {
  const { pages, themeConfig } = site

  const localeConfig = localePath && themeConfig.locales
    ? themeConfig.locales[localePath] || themeConfig
    : themeConfig

  const pageSidebarConfig = page.frontmatter.sidebar || localeConfig.sidebar || themeConfig.sidebar
  const listAllSidebar = localeConfig.listAllSidebar || themeConfig.listAllSidebar
  if (pageSidebarConfig === 'auto') {
    if (listAllSidebar) {
      return resolveListAllSidebar(listAllSidebar, pages)
    } else {
      return resolveHeaders(page)
    }
  }

  const sidebarConfig = localeConfig.sidebar || themeConfig.sidebar
  if (!sidebarConfig) {
    return []
  } else {
    const { base, config } = resolveMatchingConfig(route, sidebarConfig)
    return config
      ? config.map(item => resolveItem(item, pages, base))
      : []
  }
}

function isPathInList (path, list) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (path.indexOf(item) === 0) {
      return true
    }
  }
  return false
}

function checkParentGroup (target, src, path, pageItem) {
  for (let key in src) {
    const matchList = src[key]
    const parent = target[key] || (target[key] = { 
      type: 'group',
      collapsable: true,
      title: key,
      children: [],
    })
    if (isPathInList(path, matchList)) {
      parent.children.push(pageItem)
      return true
    }
  }
  return false
}

function resolveListAllSidebar (listAllSidebar, pages) {
  if (!listAllSidebar) {
    return []
  } else {
    const { ignore = [], group = {} } = listAllSidebar
    const parentGroup = {}
    const baseGroup = []
    const first = []

    for (let i = 0; i < pages.length; i++) {
      const { path } = pages[i]
      const isIgnore = isPathInList(path, ignore)

      if (!isIgnore) {
        const pageItem = resolvePage(pages, path, '/')
        if (path === '/') {
          first.push(pageItem)
        } else {
          if (!checkParentGroup(parentGroup, group, path, pageItem)) {
            baseGroup.push(pageItem)
          }
        }
      }
    }

    return [
      ...first,
      ...Object.values(parentGroup),
      ...baseGroup,
    ]
  }
}

function resolveHeaders (page) {
  const headers = groupHeaders(page.headers || [])
  return [{
    type: 'group',
    collapsable: false,
    title: page.title,
    children: headers.map(h => ({
      type: 'auto',
      title: h.title,
      basePath: page.path,
      path: page.path + '#' + h.slug,
      children: h.children || []
    }))
  }]
}

export function groupHeaders (headers) {
  // group h3s under h2
  headers = headers.map(h => Object.assign({}, h))
  let lastH2
  headers.forEach(h => {
    if (h.level === 2) {
      lastH2 = h
    } else if (lastH2) {
      (lastH2.children || (lastH2.children = [])).push(h)
    }
  })
  return headers.filter(h => h.level === 2)
}

export function resolveNavLinkItem (linkItem) {
  return Object.assign(linkItem, {
    type: linkItem.items && linkItem.items.length ? 'links' : 'link'
  })
}

export function resolveMatchingConfig (route, config) {
  if (Array.isArray(config)) {
    return {
      base: '/',
      config: config
    }
  }
  for (const base in config) {
    if (ensureEndingSlash(route.path).indexOf(base) === 0) {
      return {
        base,
        config: config[base]
      }
    }
  }
  return {}
}

function ensureEndingSlash (path) {
  return /(\.html|\/)$/.test(path)
    ? path
    : path + '/'
}

function resolveItem (item, pages, base, isNested) {
  if (typeof item === 'string') {
    return resolvePage(pages, item, base)
  } else if (Array.isArray(item)) {
    return Object.assign(resolvePage(pages, item[0], base), {
      title: item[1]
    })
  } else {
    if (isNested) {
      console.error(
        '[vuepress] Nested sidebar groups are not supported. ' +
        'Consider using navbar + categories instead.'
      )
    }
    const children = item.children || []
    return {
      type: 'group',
      title: item.title,
      children: children.map(child => resolveItem(child, pages, base, true)),
      collapsable: item.collapsable !== false
    }
  }
}
