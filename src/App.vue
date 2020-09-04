<template>
  <div id="app">
    <div>
      <transition :name="answer" mode="out-in">
        <div class="score" :key="tries">
          <transition name="right" mode="out-in">
            <span class="score-component" :key="score">{{score}}</span>
          </transition>
          <transition name="wrong" mode="out-in">
            <span class="score-component" :key="tries-score">/{{tries}}</span>
          </transition>
        </div>
      </transition>
      <Tinder
        ref="tinder"
        key-name="id"
        :queue.sync="queue"
        :max="3"
        :offset-y="10"
        @submit="onSubmit"
      >
        <template slot-scope="scope">
          <span class="word-bg" :style="{
            'background': scope.data.word.color}">
            <span class="word">{{scope.data.word.noun}}</span>
          </span>
        </template>
        <img class="female-pointer" slot="female" src="~img/female3.png" />
        <img class="male-pointer" slot="male" src="~img/male3.png" />
        <img class="rewind-pointer" slot="rewind" src="~img/rewind-txt.png" />
      </Tinder>
      <div class="btns">
        <img src="~img/rewind.png" @click="decide('rewind')" />
        <img src="~img/male2.png" @click="decide('m')" />
        <img src="~img/linkedinLogo.png" @click="decide('super')" />
        <img src="~img/female2.png" @click="decide('f')" />
        <img src="~img/githubLogo.png" @click="decide('help')" />
      </div>
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
    showScore: false,
    answer: '',
  }),
  created() {
    this.mock()
  },
  computed: {
    currentWord() {
      return this.queue[0].word
    },
    pickedColor() {
      return this.randomColor()
    },
  },
  methods: {
    randomWord() {
      const arraySize = this.mots.length
      const randomIndex = Math.floor(Math.random() * arraySize)
      return {
        noun: this.mots[randomIndex].nom,
        gender: this.mots[randomIndex].genre,
        color: this.randomColor(),
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
        this.answer = 'right-answer'
        this.score++
      } else {
        this.answer = 'wrong-answer'
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
        window.open('https://github.com/meyerka', '_blank')
      } else if (choice === 'super') {
        window.open(
          'https://www.linkedin.com/in/karl-erik-meyer-72b79887/',
          '_blank'
        )
      } else {
        this.$refs.tinder.decide(choice)
        this.showScore = false
        this.showScore = true
      }
    },
    randomColor() {
      const palette = [
        '#ACECD5',
        '#FFF9AA',
        '#FFD5B8',
        '#FFB9B3',
        '#799FCB',
        '#95B4CC',
        '#EEF1E6',
        '#FEC9C9',
        '#F9665E',
        '#8F8CBC',
        '#F69EAF',
        '#EBD78B',
        '#EDE6CA',
        '#A3D292',
        '#7EBE91',
      ]
      const randomIndex = Math.floor(Math.random() * palette.length)
      return palette[randomIndex]
    },
  },
}
</script>

<style>
html,
body {
  height: 100%;
  font-family: 'Courier New', Courier, monospace;
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

.general-bg {
  background: green;
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
  z-index: 2000;
  position: relative;
  text-align: right;
}

.score-component {
  border-bottom: 5px solid aquamarine;
}

.word-bg {
  color: rgba(0, 0, 0, 1);
  text-transform: uppercase;
  font-size: 60px;
  width: 20%;
  text-align: center;
  vertical-align: middle;
  display: table-cell;
  margin-top: 400px;
  padding: 400px 0 400px 0;
}

.word {
  background-color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.right-enter-active,
.right-leave-active {
  transition: opacity 0.5s;
}
.right-enter,
.right-leave-to {
  opacity: 0;
}

.wrong-enter-active,
.wrong-leave-active {
  transition: opacity 0.5s;
}
.wrong-enter,
.wrong-leave-to {
  opacity: 0;
  color: red;
}

.right-answer-enter-active,
.right-answer-leave-active {
  transition: opacity 1s;
}
.right-answer-enter,
.right-answer-leave-to {
  opacity: 0;
  background: rgb(47, 87, 47);
}

.wrong-answer-enter-active,
.wrong-answer-leave-active {
  transition: opacity 1s;
}
.wrong-answer-enter,
.wrong-answer-leave-to {
  opacity: 0;
  background: rgb(221, 119, 119);
}
</style>
