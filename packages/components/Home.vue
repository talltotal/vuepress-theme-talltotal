<template>
  <div>
    <div
      class="home-header"
      :style="(data.logoImg ? `background-image:url(${data.logoImg})` : '') + (data.logoColor ? `;background-color: ${data.logoColor}` : '')"
    >
      <div class="hero">
        <img v-if="data.logo" :src="$withBase(data.logo)" alt="hero">
        <div>
          <!-- <h1>{{ data.heroText || $title || 'Hello' }}</h1> -->
          <p
            class="description"
            v-html="data.tagline || $description || 'Welcome to your VuePress site'"
          />
          <p v-html="data.subline" />
          <p v-if="data.actionText && data.actionLink" class="action">
            <NavLink class="action-button" :item="actionLink" />
          </p>
        </div>
      </div>
    </div>
    <div class="home">
      <Content custom />
      <div v-if="data.footer" class="footer">
        {{ data.footer }}
      </div>
    </div>
  </div>
</template>

<script>
import NavLink from './NavLink.vue'

export default {
  components: { NavLink },
  computed: {
    data () {
      return this.$page.frontmatter
    },
    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText,
      }
    },
  },
}
</script>

<style lang="stylus">
@import '~../styles/config.styl'
.home-header
  padding $navbarHeight 2rem 0
  .hero
    display flex
    max-width 960px
    align-items center
    margin 0 auto
    img
      max-height 100px
      display block
      margin 5rem
      // border-radius 4px
    h1
      color darken($textColor, 30%)
    h1, .description, .action
      margin 1.8rem auto
    .description
      max-width 35rem
      font-size 1.6rem
      line-height 1.3
    .action-button
      display inline-block
      font-size 1rem
      color #fff
      background-color $accentColor
      padding 0.3rem 1.3rem
      border-radius 4px
      transition background-color .1s ease
      box-sizing border-box
      border-bottom 1px solid darken($accentColor, 10%)
      &:hover
        background-color darken($accentColor, 10%)

.home
  padding $navbarHeight 2rem 0
  max-width 960px
  margin 0px auto
  .footer
    padding 2.5rem
    border-top 1px solid $borderColor
    text-align center
    color lighten($textColor, 50%)
    font-size 14px

@media (prefers-color-scheme: dark)
  body:not(.theme-light)
    .home
      .footer
        border-top-color $borderColorDark
        color darken($textColorDark, 50%)
body.theme-dark
  .home
    .footer
      border-top-color $borderColorDark
      color darken($textColorDark, 50%)

@media (max-width: $MQMobile)
  .home
    .features
      flex-direction column
    .feature
      max-width 100%
      padding 0 2.5rem
    .projects
      flex-direction column
    .project
      width 100%
      max-width 100%
      margin-bottom 20px

@media (max-width: $MQMobileNarrow)
  .home
    padding-left 1.5rem
    padding-right 1.5rem
    .hero
      img
        max-height 210px
        margin 2rem auto 1.2rem
      h1
        font-size 2rem
      h1, .description, .action
        margin 1.2rem auto
      .description
        font-size 1.2rem
      .action-button
        font-size 1rem
        padding 0.6rem 1.2rem
    .feature
      h2
        font-size 1.25rem
</style>
