<template>
  <div class="editor-container">
    <mavon-editor
      class="movon-editor-custom"
      v-model="content"
      language="en"
      defaultOpen="editor"
      :toolbars="{
        save:false,
        trash:false,
        help: false,
        subscript: false,
        alignleft: false,
        superscript:false,
        preview: true,
        subfield: true,
        navigation: true,
        htmlcode: true,
        fullscreen: true,
        autofocus: true
      }"/>
  </div>
</template>

<script>
  import 'mavon-editor/dist/css/index.css'
  import '../assets/style/markdownEditor.css'
  export default {
    data: () => ({
      content: ''
    }),
    methods: {
      getContent: function () {
        return this.content
      },
      setContent: function (value) {
        this.content = value
      }
    }
  }
</script>
