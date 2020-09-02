<template>
  <transition-group
    class="vue-tinder"
    tag="div"
    :css="false"
    @beforeEnter="beforeEnter"
    @leave="leave"
    @touchstart.native="start"
    @touchmove.native="move"
    @touchend.native="end"
    @touchcancel.native="end"
    @mousedown.native="start"
    @mousemove.native="move"
    @mouseup.native="end"
  >
    <template v-for="(item, index) in list">
      <TinderCard
        v-if="index < max + 1"
        :ready="index === max"
        :key="item.$vtKey || item[keyName]"
        :data-id="item.$vtKey || item[keyName]"
        :index="index"
        :state="state"
        :ratio="ratio"
        :rewind="
          rewindKeys.indexOf(item.$vtKey || item[keyName]) > -1 ? index : false
        "
        :tinder-mounted="tinderMounted"
        :scale-step="scaleStep"
        :offset-y="offsetY"
        :offset-unit="offsetUnit"
        @reverted="resetStatus"
      >
        <slot :data="item" :index="index" :status="status"></slot>
        <template v-if="index === 0 && status !== 2">
          <span
            slot="male"
            class="pointer-wrap male-pointer-wrap"
            :style="{ opacity: maleOpacity }"
          >
            <slot name="male" :opacity="maleOpacity" />
          </span>
          <span
            slot="female"
            class="pointer-wrap female-pointer-wrap"
            :style="{ opacity: femaleOpacity }"
          >
            <slot name="female" :opacity="femaleOpacity" />
          </span>
          <span
            v-if="allowSuper"
            slot="super"
            class="pointer-wrap super-pointer-wrap"
            :style="{ opacity: superOpacity }"
          >
            <slot name="super" :opacity="superOpacity" />
          </span>
        </template>
        <span v-if="state.status === 4" slot="rewind" class="pointer-wrap rewind-pointer-wrap">
          <slot name="rewind" />
        </span>
      </TinderCard>
    </template>
  </transition-group>
</template>

<script>
import TinderCard from './TinderCard.vue'
import queueHandle from './queue-handle'
import touchEvent from './touch-event'
import transitionEvent from './transition-event'
import openMethods from './open-methods'
import { initStatus } from './status'

let resizeTimer

export default {
  name: 'Tinder',
  mixins: [queueHandle, touchEvent, transitionEvent, openMethods],
  components: {
    TinderCard,
  },
  props: {
    allowSuper: {
      type: Boolean,
      default: false,
    },
    queue: {
      type: Array,
      default: () => [],
    },
    wordQueue: {
      type: Array,
      default: () => [],
    },
    keyName: {
      type: String,
      default: 'key',
    },
    pointerThreshold: {
      type: Number,
      default: 0.5,
    },
    superThreshold: {
      type: Number,
      default: 0.5,
    },
    sync: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 3,
    },
    scaleStep: {
      type: Number,
      // default: 30
      default: 0.05,
    },
    offsetY: {
      type: Number,
      default: 0,
    },
    offsetUnit: {
      type: String,
      default: 'px',
    },
  },
  data: () => ({
    size: {
      top: 0,
      width: 0,
      height: 0,
    },
    state: initStatus(),
    list: [],
    wordList: [],
    tinderMounted: false,
  }),
  computed: {
    status() {
      return this.state.status
    },
    ratio() {
      if (this.size.width) {
        const { start, move } = this.state
        const x = move.x - start.x || 0
        const ratio = x / (this.size.width * 0.5)
        return ratio
      }
      return 0
    },
    pointerOpacity() {
      return this.ratio / this.pointerThreshold
    },
    superOpacity() {
      if (!this.allowSuper) {
        return 0
      }
      const disY = this.state.move.y - this.state.start.y
      const ratio = disY / (-this.superThreshold * this.size.height)
      const pointerOpacity = Math.abs(this.pointerOpacity)
      return ratio > pointerOpacity ? ratio : 0
    },
    femaleOpacity() {
      if (this.superOpacity) {
        return 0
      }
      return this.pointerOpacity
    },
    maleOpacity() {
      return -this.femaleOpacity
    },
  },
  watch: {
    queue(val) {
      const keyName = this.keyName
      const newKeys = val.map((item) => item[keyName])
      const oldKeys = this.list.map((item) => item[keyName])
      this.diff(newKeys, oldKeys)
    },
  },
  mounted() {
    if (!this.$el.offsetWidth || !this.$el.offsetHeight) {
      /* eslint-disable-next-line */
      console.error('vue-tinder - 10001')
      return
    }
    this.size = {
      top: this.$el.offsetTop,
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight,
    }
    window.onresize = this.getSize
    this.tinderMounted = true
  },
  created() {
    this.list = this.queue.slice(0)
    this.wordList = this.wordQueue.slice(0)
  },
  destroyed() {
    window.removeEventListener('onresize', this.getSize)
  },
  methods: {
    getSize() {
      clearInterval(resizeTimer)
      resizeTimer = setTimeout(() => {
        this.size = {
          top: this.$el.offsetTop,
          width: this.$el.offsetWidth,
          height: this.$el.offsetHeight,
        }
      }, 300)
    },
    resetStatus() {
      this.state = initStatus()
    },
  },
}
</script>

<style scoped>
.vue-tinder {
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

.v-move {
  transition: none !important;
}

.pointer-wrap {
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.tinder-card.male .male-pointer-wrap,
.tinder-card.female .female-pointer-wrap,
.tinder-card.super .super-pointer-wrap {
  opacity: 1 !important;
}

.tinder-card.male .rewind-pointer-wrap,
.tinder-card.female .rewind-pointer-wrap,
.tinder-card.super .rewind-pointer-wrap {
  display: none;
}
</style>
