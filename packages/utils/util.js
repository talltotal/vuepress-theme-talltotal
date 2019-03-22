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
      return resolveListAllSidebar(listAllSidebar, pages, route)
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
    if (isPathMatch(path, item)) {
      return true
    }
  }
  return false
}

function isPathMatch (path, match) {
  return path.indexOf(match) === 0
}

function groupPath (target, baseGroup, src, path, pageItem) {
  for (let key in src) {
    const matchList = src[key]
    if (isPathInList(path, matchList)) {
      const parent = target[key] || (target[key] = { 
        type: 'group',
        collapsable: true,
        title: key,
        children: [],
      })

      return parent.children.push(pageItem)
    }
  }
  baseGroup.push(pageItem)
}

function groupPathByDir (target, baseGroup, path, pageItem) {
  const dirMatch = path.match(/([^/]+\/)/)
  if (dirMatch) {
    const dir = dirMatch[1]
    const parent = target[dir] || (target[dir] = {
      // _group: {},
      type: 'group',
      collapsable: true,
      title: dir.slice(0, -1),
      children: [],
    })

    parent.children.push(pageItem)
    // groupPathByDir(parent._group, parent.children, path.slice(dir.length), pageItem)
  } else {
    baseGroup.push(pageItem)
  }
}

function valuesOfGroup (obj) {
  const result = []
  for (let key in obj) {
    const item = obj[key]
    result.push({
      type: 'group',
      collapsable: true,
      title: item.title,
      children: [
        ...valuesOfGroup(item._group),
        ...item.children,
      ],
    })
  }
  return result
}

export function resolveListAllSidebar (listAllSidebar, pages, route) {
  if (!listAllSidebar) {
    return []
  } else {
    const { ignore = [], group = {}, modules = [], groupByDir, showIndex, orders } = listAllSidebar
    /**
     * 搜索项按模块划分，模块下按组划分
     * 1. 根据route匹配“当前模块”，均不匹配的归入普通模块
     * 2. 遍历所有页面，找到在“当前模块”的“同模块页面”
     * 3. 将“同模块页面”归组
     */ 
    const currentPath = route.path
    const parentGroup = {}
    const baseGroup = []
    const first = []
    let currentModule = '/'

    if (isPathInList(currentPath, ignore)) return []

    for (let i = 0; i < modules.length; i++) {
      const moduleItem = modules[i]
      if (isPathMatch(currentPath, moduleItem)) {
        currentModule = moduleItem
        break
      }
    }

    for (let i = 0; i < pages.length; i++) {
      const { path } = pages[i]

      if ((
          (currentModule === '/' && !isPathInList(path, modules))
          || (currentModule !== '/' && isPathMatch(path, currentModule))
        )
        && !isPathInList(path, ignore)) {
        const pageItem = resolvePage(pages, path, currentModule)
        const localePath = path.slice(currentModule.length)

        if (!localePath) {
          if (showIndex) {
            first.push({
              ...pageItem,
              title: showIndex,
            })
          }
        } else if (groupByDir) {
          groupPathByDir(parentGroup, baseGroup, localePath, pageItem)
        } else {
          groupPath(parentGroup, baseGroup, group, path, pageItem)
        }
      }
    }

    return [
      ...first,
      // ...valuesOfGroup(parentGroup),
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
