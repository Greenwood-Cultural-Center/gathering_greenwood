<script setup>
  import { ref } from 'vue';
  import { HtmlDialog } from 'vue-html-dialog';
  import 'vue-html-dialog/vue-html-dialog.css';

  defineExpose({
    openDialog: () => dialogRef.value?.openDialog(),
    closeDialog: () => dialogRef.value?.closeDialog(),
    swapVideoSource: () => swapVideoSource()
  })

  const dialogRef = ref(HtmlDialog);

  const props = defineProps({
    url: {
      type: String,
      required: true,
      validator: val => val && typeof val === 'string' && val.length > 0
    },
    autoplay: {
      type: Boolean,
      default: false
    }
  });

  function swapVideoSource(){
    const video = document.querySelector("video.video");
    const sources = video.getElementsByTagName("source");
    var oldsrc = sources[0].src;
    var oldtype = sources[0].type;
    sources[0].src = sources[1].src;
    sources[0].type = sources[1].type;
    sources[1].src = oldsrc;
    sources[1].type = oldtype;
    video.load();
  }

  function stopVideo(){
    const video = document.querySelector("video.video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  function onClose() {
    stopVideo();
  }

  function onOpen() {
    const video = document.querySelector("video.video");
    if (props.autoplay && video) {
      video.play();
    }
  }

</script>

<template>
  <HtmlDialog ref="dialogRef" class="video-dialog" @open="onOpen" @close="onClose">
    <video nonce="ajJERjdDc1g5MlFadlZfdGdFIWI4dVchQ3o4Q3ZRYlQ=" class="video" controls style="width: 98%; height: 98%;">
      <source nonce="ajJERjdDc1g5MlFadlZfdGdFIWI4dVchQ3o4Q3ZRYlQ=" :src="props.url" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </HtmlDialog>
</template>

<style>
  .video-dialog .dialog{
    width: 73vw;
    height: 74vh;
    padding: 0.2rem 0rem 0rem 0rem;
    transform: translateY(-6%);
  }

  .video-dialog .close-button {
    font-size: 3.5rem;
    z-index: 1001;
    height: 5rem;
    width: 5rem;
    padding-block: 0;
    padding-inline: 0;
    top: -9px;
    right: 0px;
  }

  @media screen and (max-width: 1600px) {
    .video-dialog .dialog {
      transform: translateY(-12%);
    }

    .video-dialog .close-button {
      top: -0.625rem;
      right: -9px;
    }
  }
</style>