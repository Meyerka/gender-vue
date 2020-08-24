import { STATUS } from './status'

export default {
  data: () => ({
    rewindKeys: []
  }),
  methods: {

    decide(type) {
      if (this.state.touchId || this.status !== STATUS.NORMAL) {
        return
      }
      this.state.start = { x: 0, y: 0 }
      this.state.move = {
        x: type === 'super' ? 0 : type === 'like' ? 1 : -1,
        y: type === 'super' ? -1 : 0
      }
      this.state.startPoint = 1
      this.shiftCard(type)
    },

    rewind(list) {
      const keyName = this.keyName
      for (const item of list) {
        this.rewindKeys.push(item[keyName] + '')
      }
      this.queue.unshift(...list)
    },

    shiftCard(type) {
      this.state.status = STATUS.LEAVING
      this.state.result = type
      const item = this.queue.shift()
      this.$emit('update:queue', this.queue)
      this.submitDecide(type, item)
    },

    submitDecide(type, item) {
      this.$emit('submit', { type, key: item[this.keyName], item })
    }
  }
}
