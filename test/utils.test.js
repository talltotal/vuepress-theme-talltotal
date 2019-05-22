const expect = require('expect.js')
const { resolveListAllSidebar } = require('../packages/utils/util')

const configList = {
  'list all': {},
  'ignore': {
    ignore: ['/b/'],
  },
  'group': {
    group: {
      'a&b': ['/a', '/b/'],
    },
  },
  'ignore&group': {
    ignore: ['/b/'],
    group: {
      'a&b': ['/a', '/b/'],
    },
  },
  'modules': {
    modules: ['/b/'],
  },
  'modules&group': {
    modules: ['/b/'],
    group: {
      'a&b': ['/a', '/b/'],
    },
  },
  'modules&group&ignore': {
    ignore: ['/c/'],
    modules: ['/b/'],
    group: {
      'a&b': ['/a', '/b/'],
    },
  },
  'groupByDir': {
    groupByDir: true,
  },
  'groupByDir&module': {
    modules: ['/b/'],
    groupByDir: true,
  },
  'groupByDir&module1': {
    modules: ['/c/'],
    groupByDir: true,
  },
  'groupByDir&module&ignore': {
    ignore: ['/a'],
    modules: ['/b/'],
    groupByDir: true,
  },
  'showIndex': {
    showIndex: 'Home',
  },
  'showIndex&modules': {
    showIndex: 'Home',
    modules: ['/b/'],
  },
}

const pages = [
  {
    path: '/',
    title: 'Home',
  },
  {
    path: '/a.html',
    title: 'a',
  },
  {
    path: '/b/',
    title: 'b',
  },
  {
    path: '/b/bb.html',
    title: 'bb',
  },
  {
    path: '/c/',
    title: 'c',
  },
  {
    path: '/c/cc.html',
    title: 'cc',
  },
  {
    path: '/c/cc/ccc.html',
    title: 'ccc',
  },
]

const routeList = [
  { path: '/' },
  { path: '/b/' },
  { path: '/c/' },
]

describe('resolveListAllSidebar', () => {
  it('list all for "/"', () => {
    const result = resolveListAllSidebar(configList['list all'], pages, routeList[0])
    expect(result).to.eql([
      { path: '/a.html', title: 'a', type: 'page' },
      { path: '/b/', title: 'b', type: 'page' },
      { path: '/b/bb.html', title: 'bb', type: 'page' },
      { path: '/c/', title: 'c', type: 'page' },
      { path: '/c/cc.html', title: 'cc', type: 'page' },
      { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
    ])
  })
  it('ignore for "/"', () => {
    const result = resolveListAllSidebar(configList['ignore'], pages, routeList[0])
    expect(result).to.eql([
      { path: '/a.html', title: 'a', type: 'page' },
      { path: '/c/', title: 'c', type: 'page' },
      { path: '/c/cc.html', title: 'cc', type: 'page' },
      { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
    ])
  })
  it('group for "/"', () => {
    const result = resolveListAllSidebar(configList['group'], pages, routeList[0])
    expect(result).to.eql([
      { title: 'a&b',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/a.html', title: 'a', type: 'page' },
          { path: '/b/', title: 'b', type: 'page' },
          { path: '/b/bb.html', title: 'bb', type: 'page' },
        ] },
      { path: '/c/', title: 'c', type: 'page' },
      { path: '/c/cc.html', title: 'cc', type: 'page' },
      { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
    ])
  })
  it('ignore&group for "/"', () => {
    const result = resolveListAllSidebar(configList['ignore&group'], pages, routeList[0])
    expect(result).to.eql([
      { title: 'a&b',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/a.html', title: 'a', type: 'page' },
        ] },
      { path: '/c/', title: 'c', type: 'page' },
      { path: '/c/cc.html', title: 'cc', type: 'page' },
      { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
    ])
  })
  it('ignore for "/b/"', () => {
    const result = resolveListAllSidebar(configList['ignore'], pages, routeList[1])
    expect(result).to.eql([])
  })
  it('modules for "/b/"', () => {
    const result = resolveListAllSidebar(configList['modules'], pages, routeList[1])
    expect(result).to.eql([
      { path: '/b/bb.html', title: 'bb', type: 'page' },
    ])
  })
  it('modules for "/c/"', () => {
    const result = resolveListAllSidebar(configList['modules'], pages, routeList[2])
    expect(result).to.eql([
      { path: '/a.html', title: 'a', type: 'page' },
      { path: '/c/', title: 'c', type: 'page' },
      { path: '/c/cc.html', title: 'cc', type: 'page' },
      { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
    ])
  })
  it('modules&group for "/b/"', () => {
    const result = resolveListAllSidebar(configList['modules&group'], pages, routeList[1])
    expect(result).to.eql([
      { title: 'a&b',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/b/bb.html', title: 'bb', type: 'page' },
        ] },
    ])
  })
  it('modules&group for "/c/"', () => {
    const result = resolveListAllSidebar(configList['modules&group'], pages, routeList[2])
    expect(result).to.eql([
      { title: 'a&b',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/a.html', title: 'a', type: 'page' },
        ] },
      { path: '/c/', title: 'c', type: 'page' },
      { path: '/c/cc.html', title: 'cc', type: 'page' },
      { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
    ])
  })
  it('modules&group&ignore for "/"', () => {
    const result = resolveListAllSidebar(configList['modules&group&ignore'], pages, routeList[0])
    expect(result).to.eql([
      { title: 'a&b',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/a.html', title: 'a', type: 'page' },
        ] },
    ])
  })
  it('modules&group&ignore for "/b/"', () => {
    const result = resolveListAllSidebar(configList['modules&group&ignore'], pages, routeList[1])
    expect(result).to.eql([
      { title: 'a&b',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/b/bb.html', title: 'bb', type: 'page' },
        ] },
    ])
  })
  it('modules&group&ignore for "/c/"', () => {
    const result = resolveListAllSidebar(configList['modules&group&ignore'], pages, routeList[2])
    expect(result).to.eql([])
  })
  it('groupByDir for "/c/"', () => {
    const result = resolveListAllSidebar(configList['groupByDir'], pages, routeList[2])
    expect(result).to.eql([
      { title: 'b',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/b/', title: 'b', type: 'page' },
          { path: '/b/bb.html', title: 'bb', type: 'page' },
        ] },
      { title: 'c',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/c/', title: 'c', type: 'page' },
          { path: '/c/cc.html', title: 'cc', type: 'page' },
          { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
        ] },
      { path: '/a.html', title: 'a', type: 'page' },
    ])
  })
  it('groupByDir&module for "/b/"', () => {
    const result = resolveListAllSidebar(configList['groupByDir&module'], pages, routeList[1])
    expect(result).to.eql([
      { path: '/b/bb.html', title: 'bb', type: 'page' },
    ])
  })
  it('groupByDir&module for "/c/"', () => {
    const result = resolveListAllSidebar(configList['groupByDir&module'], pages, routeList[2])
    expect(result).to.eql([
      { title: 'c',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/c/', title: 'c', type: 'page' },
          { path: '/c/cc.html', title: 'cc', type: 'page' },
          { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
        ] },
      { path: '/a.html', title: 'a', type: 'page' },
    ])
  })
  it('groupByDir&module1 for "/b/"', () => {
    const result = resolveListAllSidebar(configList['groupByDir&module1'], pages, routeList[1])
    expect(result).to.eql([
      { title: 'b',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/b/', title: 'b', type: 'page' },
          { path: '/b/bb.html', title: 'bb', type: 'page' },
        ] },
      { path: '/a.html', title: 'a', type: 'page' },
    ])
  })
  it('groupByDir&module1 for "/c/"', () => {
    const result = resolveListAllSidebar(configList['groupByDir&module1'], pages, routeList[2])
    expect(result).to.eql([
      { title: 'cc',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
        ] },
      { path: '/c/cc.html', title: 'cc', type: 'page' },
    ])
  })
  it('groupByDir&module&ignore for "/c/"', () => {
    const result = resolveListAllSidebar(configList['groupByDir&module&ignore'], pages, routeList[2])
    expect(result).to.eql([
      { title: 'c',
        type: 'group',
        collapsable: true,
        children: [
          { path: '/c/', title: 'c', type: 'page' },
          { path: '/c/cc.html', title: 'cc', type: 'page' },
          { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
        ] },
    ])
  })
  it('showIndex for "/c/"', () => {
    const result = resolveListAllSidebar(configList['showIndex'], pages, routeList[2])
    expect(result).to.eql([
      { path: '/', title: 'Home', type: 'page' },
      { path: '/a.html', title: 'a', type: 'page' },
      { path: '/b/', title: 'b', type: 'page' },
      { path: '/b/bb.html', title: 'bb', type: 'page' },
      { path: '/c/', title: 'c', type: 'page' },
      { path: '/c/cc.html', title: 'cc', type: 'page' },
      { path: '/c/cc/ccc.html', title: 'ccc', type: 'page' },
    ])
  })
  it('showIndex&modules for "/b/"', () => {
    const result = resolveListAllSidebar(configList['showIndex&modules'], pages, routeList[1])
    expect(result).to.eql([
      { path: '/b/', title: 'Home', type: 'page' },
      { path: '/b/bb.html', title: 'bb', type: 'page' },
    ])
  })
})
