<template>
  <main>
   
      <section id="chat">
        <!-- left hand side -> users go here -->
        <section id="chat-users-ui">
          <h2 class="online-users">Current Users:</h2>
          
          <ul id="current-users">
            <ChatUser
            v-for="user in users"
            :key="user.user"
            :username="user"
            />
          </ul>
        </section>
        
      

        <!-- right hand side -> cha UI -->
        <section id="chat-messages-ui">

          <div class="welcome-message">
          <img src="@/assets/images/logo_v.png" alt="Safe Chat logo" class="logo_v">
          <h1 class="welcome-text">Welcome, {{ ChatUserName }}</h1>
          </div>

          <!-- render a component for every message -->    
          <div class="chat-messages"  ref="scroll">
            <ChatMessage
            v-for="msg in messages"
            :key="msg.id"
            :message="msg.message"
            :user="msg.user"
            :sender="ChatUserName === msg.user ? 'sender' : 'receiver'"
            />
          </div>
         
          <section id="text-wrapper">
            <textarea @keyup.enter="sendOnEnter" id="message" v-model="message" placeholder="What's on your mind?"></textarea>

            <button id="sendMessage" 
            @click="sendMessage" 
            :disabled="messageContent"
            :class="{'disabled': messageContent}">
            <i class="fa-solid fa-plane-departure"></i>
            </button>
            <div class="status"> 
              <p class="disconnected">{{ userThatDisconnected}}</p> 
              <p class="disconnected">{{ userThatConnected }}</p>   
            </div>
          </section>
        </section>
      </section>
    
  </main>
</template>

<script>
import io from "socket.io-client";
import vars from "@/env.js";
import ChatMessage from "@/components/ChatMessage.vue";
import ChatUser from "@/components/ChatUser.vue";


export default {
  name: "TheChatComponent",

  props: {
    ChatUserName: String, 
  },

  mounted() {
    let vm = this;

    this.socket.on("CONNECTED", (id) => {
      vm.socketID = id;

      this.socket.emit('user-joined', { user: this.ChatUserName || "Anonymous"});
    })

    this.socket.on("joined", (data) => {
      vm.users = data.user;
      console.log(vm.users);
    })

    this.socket.on('user-has-joined', (data) => {
      vm.userThatConnected = data.message;
      setTimeout(function() { vm.userThatConnected = ''; }, 3000);
    })


    this.socket.on('user-disconnected', (data) => {
      vm.userThatDisconnected = data.messageDisconnect;
      setTimeout(function() { vm.userThatDisconnected = ''; }, 3000);
    })


    this.socket.on('MESSAGE', (message) => {
      message.id = this.getNewId();
      
      vm.messages = [ ...vm.messages, message];
      console.log(message);

       this.$nextTick(() => this.scrollToEnd());

    })
  },

  computed: {
    messageContent: function() {
      return this.message.trim() === '';
    },

    senderReceiver: function(socketID) {
      return socketID === this.socketID
    }
  },


  data() {
    return {
      // store the connection ID so we can use it later
      socketID: '',
      message: '',
      messages: [],
      users: [],
      currentID: [],
      userThatDisconnected: '',
      userThatConnected: '',
     


      socket: io(vars.basePath, {
        withCredentials: false,
        extraHeaders: {
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  },

  methods : {
    sendMessage() {
    this.socket.emit('SEND_MESSAGE', {user: this.ChatUserName || "Anonymous", message: this.message});
    
    this.message = '';
    },

    getNewId() {
      this.currentID++;
      return this.currentID;
    },

    sendOnEnter() {
      if (this.messageContent == false && event.keyCode == 13) {
        this.sendMessage();
      }else {
        this.socket.emit("TYPING", { user: this.username || "Ananymous"});
      }
    },

    scrollToEnd: function () {
            var content = this.$refs.scroll;
            content.scrollTop = content.scrollHeight
        },

  },

  components: {
    ChatMessage, ChatUser,
  }
}




</script>

<style lang="scss">
@import "@/assets/sass/chat.scss";
</style>
