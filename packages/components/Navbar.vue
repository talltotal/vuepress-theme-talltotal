<template>
  <header class="navbar">
    <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')" />
    <router-link :to="$localePath" class="home-link">
      <img v-if="$site.themeConfig.logo"
           class="logo"
           :src="$withBase($site.themeConfig.logo)"
      >
      <span v-if="$siteTitle"
            class="site-name"
            :class="{ 'can-hide': $site.themeConfig.logo }"
      >
        {{ $siteTitle }}
      </span>
    </router-link>
    <div class="links">
      <AlgoliaSearchBox v-if="isAlgoliaSearch" :options="algolia" />
      <SearchBox v-else-if="$site.themeConfig.search !== false" />
      <NavLinks class="can-hide" />
    </div>
  </header>
</template>

<script>
import SidebarButton from './SidebarButton.vue'
import AlgoliaSearchBox from './AlgoliaSearchBox'
import SearchBox from './SearchBox.vue'
import NavLinks from './NavLinks.vue'

export default {
  components: { SidebarButton, NavLinks, SearchBox, AlgoliaSearchBox },
  computed: {
    algolia () {
      return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
    },
    isAlgoliaSearch () {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName
    },
  },
}
</script>

<style lang="stylus">
@import '~../styles/config.styl'

.navbar
  padding 0.7rem 1.5rem
  line-height $navbarHeight - 1.4rem
  position relative
  a, span, img
    display inline-block
  .logo
    height $navbarHeight - 1.4rem
    min-width $navbarHeight - 1.4rem
    margin-right 0.8rem
    vertical-align top
  .site-name
    font-size 1.3rem
    font-weight 600
    color $textColor
    position relative
  .links
    font-size 0.9rem
    position absolute
    right 1.5rem
    top 0.7rem
  .site-name,
  .nav-links
    opacity 0.8

@media (max-width: $MQMobile)
  .navbar
    padding-left 4rem
    .can-hide
      display none

@media (prefers-color-scheme: dark)
  body:not(.theme-light)
    .navbar
      .site-name
        color $textColorDark
body.theme-dark
  .navbar
    .site-name
      color $textColorDark
</style>
