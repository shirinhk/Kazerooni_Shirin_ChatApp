<template>
    <div 
    class="message-panel"
    :class="sender">
        <div class="message-wrapper">
            <p class="says">{{user}} says:</p>
            <h4 class="message-text">{{ message }}</h4> 
        </div>
    </div>
</template>


<script>

export default {
    name: "TheChatMessage",

    props: {
        user: String,
        message: String,
        sender: String
        
        
    }
}
</script>


<style lang="scss">
@import "@/assets/sass/message.scss";
</style>
