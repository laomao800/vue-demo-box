<template>
  <div>
    <p class="message">{{ message }}</p>
    <button v-on:click="reverseMessage">
      reverseMessage
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue.js!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message
        .split('')
        .reverse()
        .join('')
    }
  }
}
</script>

<style>
.message {
  font-size: 14px;
  color: red;
}
</style>