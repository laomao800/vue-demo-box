<template>
  <div id="app">
    <DemoBox title="Demo Box">
      <p>Demo description text.</p>
      <div slot="demo">demo</div>
      <div slot="code">code</div>
    </DemoBox>
  </div>
</template>

<script>
import DemoBox from '../src'

export default {
  name: 'App',

  components: {
    DemoBox
  }
}
</script>
