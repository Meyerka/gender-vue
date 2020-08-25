<template>
  <div id="app">
    <div class="score">{{score}}/{{tries}}</div>
    <Tinder
      ref="tinder"
      key-name="id"
      :queue.sync="queue"
      :max="3"
      :offset-y="10"
      @submit="onSubmit"
    >
      <template slot-scope="scope">
        <div
          class="pic"
          :style="{
            'background-image': `url(https://cn.bing.com//th?id=OHR.${scope.data.id}_UHD.jpg&pid=hp&w=720&h=1280&rs=1&c=4&r=0)`
          }"
        >{{scope.data.word.noun}}</div>
      </template>
      <img class="female-pointer" slot="female" src="~img/female.png" />
      <img class="male-pointer" slot="male" src="~img/male.png" />
      <img class="super-pointer" slot="super" src="~img/super-txt.png" />
      <img class="rewind-pointer" slot="rewind" src="~img/rewind-txt.png" />
    </Tinder>
    <div class="btns">
      <img src="~img/rewind.png" @click="decide('rewind')" />
      <img src="~img/male.png" @click="decide('m')" />
      <img src="~img/super-like.png" @click="decide('super')" />
      <img src="~img/female.png" @click="decide('f')" />
      <img src="~img/help.png" @click="decide('help')" />
    </div>
  </div>
</template>

<script>
import Tinder from '@/components/vue-tinder/Tinder.vue'
import source from '@/data/bing'
import mots from '@/data/noms'

export default {
  name: 'App',
  components: { Tinder },
  data: () => ({
    queue: [],
    offset: 0,
    history: [],
    mots,
    score: 0,
    tries: 0,
  }),
  created() {
    this.mock()
  },
  computed: {
    currentWord() {
      return this.queue[0].word
    },
  },
  methods: {
    randomWord() {
      const arraySize = this.mots.length
      const randomIndex = Math.floor(Math.random() * arraySize)
      return {
        noun: this.mots[randomIndex].nom,
        gender: this.mots[randomIndex].genre,
      }
    },

    mock(count = 5, append = true) {
      const list = []
      for (let i = 0; i < count; i++) {
        list.push({
          id: source[this.offset],
          word: this.randomWord(),
        })
        this.offset++
      }
      if (append) {
        this.queue = this.queue.concat(list)
      } else {
        this.queue.unshift(...list)
      }
    },
    onSubmit({ type, item }) {
      this.tries++
      if (type == item.word.gender) {
        this.score++
      }
      if (this.queue.length < 3) {
        this.mock()
      }
      this.history.push(item)
    },
    decide(choice) {
      if (choice === 'rewind') {
        if (this.history.length) {
          this.$refs.tinder.rewind(this.history.splice(-1))
        }
      } else if (choice === 'help') {
        //
      } else {
        this.$refs.tinder.decide(choice)
      }
    },
  },
}
</script>

<style>
html,
body {
  height: 100%;
}

body {
  margin: 0;
  background-color: #20262e;
  overflow: hidden;
}

#app .vue-tinder {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 23px;
  margin: auto;
  width: calc(100% - 20px);
  height: calc(100% - 23px - 65px - 47px - 16px);
  min-width: 300px;
  max-width: 355px;
}

.male-pointer,
.female-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  width: 64px;
  height: 64px;
}

.male-pointer {
  right: 10px;
}

.female-pointer {
  left: 10px;
}

.super-pointer {
  position: absolute;
  z-index: 1;
  bottom: 80px;
  left: 0;
  right: 0;
  margin: auto;
  width: 112px;
  height: 78px;
}

.rewind-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  right: 10px;
  width: 112px;
  height: 78px;
}

.pic {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  font-size: 60px;
  text-align: center;
  color: aliceblue;
  margin: 0 auto;
}

.btns {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  margin: auto;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;
  max-width: 355px;
}

.btns img {
  margin-right: 12px;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.btns img:nth-child(2n + 1) {
  width: 53px;
}

.btns img:nth-child(2n) {
  width: 65px;
}

.btns img:nth-last-child(1) {
  margin-right: 0;
}

.score {
  font-size: 80px;
  color: aquamarine;
}

/* .vue-tinder.right-end,
.vue-tinder.left-end {
  transform: translateZ(20px);
}
.vue-tinder.right-end .tinder-card:nth-child(1) {
  animation: rightEnd 0.2s ease-in-out;
}
.vue-tinder.left-end .tinder-card:nth-child(1) {
  animation: leftEnd 0.2s ease-in-out;
}
@keyframes leftEnd {
  50% {
    transform: rotateY(8deg);
  }
}
@keyframes rightEnd {
  50% {
    transform: rotateY(-8deg);
  }
} */
</style>
