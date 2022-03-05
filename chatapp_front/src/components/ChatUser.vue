<template>
    <div class="user-container">
      <li class="current-users">{{username}}</li>
    </div>
</template>

<script>
export default {
    name: "ChatUser",

    props: {
        
        username: String,
    }
}

</script>


<style lang="scss">
@import "@/assets/sass/message.scss";
</style>
