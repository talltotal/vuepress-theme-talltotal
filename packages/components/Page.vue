<template>
  <div class="page">
    <slot name="top" />
    <!-- 内容区域 -->
    <component :is="$page.frontmatter.pageLayout" v-if="$page.frontmatter.pageLayout" />
    <Content v-else :custom="false" />
    <div v-if="!!editLink || !!lastUpdated" class="page-edit">
      <div v-if="!!editLink" class="edit-link">
        <a :href="editLink" target="_blank" rel="noopener noreferrer">{{ editLinkText }}</a>
        <OutboundLink />
      </div>
      <div v-if="!!lastUpdated" class="last-updated">
        <span class="prefix">{{ lastUpdatedText }}: </span>
        <span class="time">{{ lastUpdated }}</span>
      </div>
    </div>
    <div v-if="prev || next" class="page-nav">
      <p class="inner">
        <span v-if="prev" class="prev">
          ← <router-link v-if="prev" class="prev" :to="prev.path">
            {{ prev.title || prev.path }}
          </router-link>
        </span>
        <span v-if="next" class="next">
          <router-link v-if="next" :to="next.path">
            {{ next.title || next.path }}
          </router-link> →
        </span>
      </p>
    </div>
    <slot name="bottom" />
  </div>
</template>

<script>
import { resolvePage, normalize, outboundRE, endingSlashRE } from '../utils/util'

export default {
  props: ['sidebarItems'],
  computed: {
    lastUpdated () {
      if (this.$page.lastUpdated) {
        return new Date(this.$page.lastUpdated).toLocaleString(this.$lang)
      }
    },
    lastUpdatedText () {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated
      }
      if (typeof this.$site.themeConfig.lastUpdated === 'string') {
        return this.$site.themeConfig.lastUpdated
      }
      return 'Last Updated'
    },
    prev () {
      const prev = this.$page.frontmatter.prev
      if (prev === false) {
        return null
      } else if (prev) {
        return resolvePage(this.$site.pages, prev, this.$route.path)
      } else {
        return resolvePrev(this.$page, this.sidebarItems)
      }
    },
    next () {
      const next = this.$page.frontmatter.next
      if (next === false) {
        return null
      } else if (next) {
        return resolvePage(this.$site.pages, next, this.$route.path)
      } else {
        return resolveNext(this.$page, this.sidebarItems)
      }
    },
    editLink () {
      if (this.$page.frontmatter.editLink === false) {
        return
      }
      const {
        repo,
        editLinks,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo,
      } = this.$site.themeConfig

      let path = normalize(this.$page.path)
      if (endingSlashRE.test(path)) {
        path += 'README.md'
      } else {
        path += '.md'
      }
      if (docsRepo && editLinks) {
        return this.createEditLink(repo, docsRepo, docsDir, docsBranch, path)
      }
    },
    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText ||
        this.$site.themeConfig.editLinkText ||
        'Edit this page'
      )
    },
  },
  methods: {
    createEditLink (repo, docsRepo, docsDir, docsBranch, path) {
      const bitbucket = /bitbucket.org/
      if (bitbucket.test(repo)) {
        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : repo
        return (
          base.replace(endingSlashRE, '') +
           `/${docsBranch}` +
           (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '') +
           path +
           `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
        )
      }

      const base = outboundRE.test(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`

      return (
        base.replace(endingSlashRE, '') +
        `/edit/${docsBranch}` +
        (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '') +
        path
      )
    },
  },
}

function resolvePrev (page, items) {
  return find(page, items, -1)
}

function resolveNext (page, items) {
  return find(page, items, 1)
}

function find (page, items, offset) {
  const res = []
  items.forEach(item => {
    if (item.type === 'group') {
      res.push(...item.children || [])
    } else {
      res.push(item)
    }
  })
  for (let i = 0; i < res.length; i++) {
    const cur = res[i]
    if (cur.type === 'page' && cur.path === page.path) {
      return res[i + offset]
    }
  }
}
</script>

<style lang="stylus">
@import '~../styles/config.styl'
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem

.page-edit
  @extend $wrapper
  padding-top 1rem
  padding-bottom 1rem
  overflow auto
  .edit-link
    display inline-block
    a
      color lighten($textColor, 25%)
      margin-right 0.25rem
  .last-updated
    float right
    font-size 0.9em
    .prefix
      font-weight 500
      color lighten($textColor, 25%)
    .time
      font-weight 400
      color #aaa

.page-nav
  @extend $wrapper
  padding-top 1rem
  padding-bottom 0
  .inner
    min-height 2rem
    margin-top 0
    border-top 1px solid $borderColor
    padding-top 1rem
    overflow auto // clear float
  .next
    float right

@media (max-width: $MQMobile)
  .page-edit
    .edit-link
      margin-bottom .5rem
    .last-updated
      font-size .8em
      float none
      text-align left

@media screen and (prefers-color-scheme: dark)
  body:not(.theme-light)
    .page-edit
      .edit-link
        a
          color darken($textColorDark, 35%)
      .last-updated
        .prefix
          color darken($textColorDark, 35%)
        .time
          color darken($textColorDark, 15%)
    .page-nav
      .inner
        border-top-color $borderColorDark
@media screen
  body.theme-dark
    .page-edit
      .edit-link
        a
          color darken($textColorDark, 35%)
      .last-updated
        .prefix
          color darken($textColorDark, 35%)
        .time
          color darken($textColorDark, 15%)
    .page-nav
      .inner
        border-top-color $borderColorDark
@media not screen
  .page-nav
    display none
</style>
