<template>
  <div class="sidebar-group" :class="{ first, collapsable }">
    <p class="sidebar-heading" :class="{ open }" @click="$emit('toggle')">
      <span>{{ item.title }}</span>
      <span v-if="collapsable"
            class="arrow"
            :class="open ? 'down' : 'up'"
      />
    </p>
    <DropdownTransition>
      <ul v-if="open || !collapsable" ref="items" class="sidebar-group-items">
        <li v-for="(child, i) in item.children" :key="i">
          <SidebarLink :item="child" />
        </li>
      </ul>
    </DropdownTransition>
  </div>
</template>

<script>
import SidebarLink from './SidebarLink.vue'
import DropdownTransition from './DropdownTransition.vue'

export default {
  name: 'SidebarGroup',
  components: { SidebarLink, DropdownTransition },
  props: ['item', 'first', 'open', 'collapsable'],
}
</script>

<style lang="stylus">
.sidebar-group
  &:not(.first)
    margin-top 1em
  .sidebar-group
    padding-left 0.5em
  &:not(.collapsable)
    .sidebar-heading
      cursor auto
      color inherit

.sidebar-heading
  position relative
  // color #999
  transition color .15s ease
  cursor pointer
  // font-size 1.1em
  font-weight bold
  // text-transform uppercase
  padding 0 1.5rem
  margin-top 0
  margin-bottom 0.5rem
  &.open, &:hover
    color inherit
  .arrow
    position absolute
    top 0.7em
    right 1em
  &:.open .arrow
    top -0.18em

.sidebar-group-items
  transition height .1s ease-out
  overflow hidden
  background #f6f7f7

@media screen and (prefers-color-scheme: dark)
  body:not(.theme-light)
    .sidebar-group-items
      background darken(#282829, 10%)
@media screen
  body.theme-dark
    .sidebar-group-items
      background darken(#282829, 10%)
</style>
