<template>
  <div id="app">
    <DemoBox title="Demo Box" code-height="10">
      <p>Demo description text.</p>
      <template slot="demo">
        demo
      </template>
      <template slot="code">
        code
      </template>
    </DemoBox>
    <DemoBox title="Demo Box" horizon code-height="100">
      <p>Demo description text.</p>
      <template slot="demo">
        demo
      </template>
      <template slot="code">
        <div style="height:300px;">code</div>
      </template>
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
