<template>
  <div>            
    <v-snackbar
      v-model="isShow"          
      top
      :color="curColor"
      :timeout="-1"
    >
      <!-- <div v-if="isShow">
        {{ GET_ErrorMsgs[0].ErrorMsg }}
      </div>       -->
      <div v-if="isShow">
        {{ GET_ErrorMsgs[0].ErrorMsg }}
      </div>
      <template v-slot:action="{ attrs }">
      
        <v-btn                    
          text
          v-bind="attrs"
          @click="ClearThisError"
        >
          Close
        </v-btn>
      
      </template>
    </v-snackbar>    
  </div>
</template>

<script>
import {mapGetters, mapMutations } from 'vuex';

export default {
    data : ()=>(
        {
            
        }    
    ),
    computed : {      
      ...mapGetters(['GET_ErrorMsgs']),
      isShow : function (){
          return (this.GET_ErrorMsgs.length != 0)
      },
      curColor : function(){
          if(this.isShow) return this.GET_ErrorMsgs[0].color
          return '';
      }
  },
    methods : {
        ...mapMutations(['SHIFT_ErrorMsgs']),                
        ClearThisError(){ //Vuex의 에러메시지를 하나 삭제한다.
          console.log('ClearThisError');
            this.SHIFT_ErrorMsgs();
        }        
    },
    
  }
</script>

<style>

</style>