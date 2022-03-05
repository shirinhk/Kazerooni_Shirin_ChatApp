<template>
  <section id="welcome-wrapper">
     <section class="logo_sec">
      <img src="@/assets/images/logo_s.png" alt="Safe Chat logo" class="logo">
      <h5>This Is Where You Can Embrace Your Opportunities</h5> 
    </section>

    <section class="home_input">
      <h1 class="hidden">Sign In</h1>
      <h3>Welcome To Safe Chat Application</h3>

      <input type="text" name="username" v-model="username" placeholder="Type Your Name">

      <div class="controls">
        <button
        :class="{ 'disabled' : canJoin }"
        :disabled = 'canJoin'
        @click="goToChat"
        >Join Chat!</button>

        <button @click="goToChat">Join Anonymously</button>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  name:"TheLoginPage",

  data() {
    return {
      loggedIn: false,
      username:''
    }
  },

  computed: {
    canJoin: function() {
      //check the value of the input - if it's blank, can not join chat
      return (this.username.trim() === "")
    }
  },

  methods: {
    goToChat() {
      this.$router.push({ name: "Chat",params: {ChatUserName: this.username || "anonymous"}});
    }
  }
}
</script>


<style lang="scss">
@import "@/assets/sass/home.scss";
</style>


