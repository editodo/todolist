<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      top
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
      <v-btn
        dark
        text
        v-bind="attrs"
        @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
    data () {
      return {
        snackbar: false,
        message:'',
        color:'#2196F3',

      }
    },
    methods: {
        CommonDTOMsg(DtoItem)      //CommonDTO메시지 처리
        {                  
          this.message = DtoItem.msg;                        
          this.color ="#FF5252" //error
          if(DtoItem.ret) this.color ="#2196F3";                      //info
          this.snackbar = true;            
        },
        ShowInfo(Message)           //info 메시지를 표시한다.
        {
          this.color ="#2196F3";  //Info
          this.message = Message;
          this.snackbar = true;
        },
        ShowError(Message)
        {
          this.color =="#FF5252"  //Error
          this.message = Message;
          this.snackbar = true;
        }
    }
}
</script>

<style>

</style>