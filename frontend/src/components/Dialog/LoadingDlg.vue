<template>
  <div class="text-center">
    <v-dialog
      v-model="isShowDlg"      
      persistent
      :overlay-opacity="0"
      width="300"
    >    
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
        <br>
          잠시만 기다려 주세요..
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>    
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  data: () => ({
    
  }),
  computed : {
     ...mapGetters(['GET_SHOW_LOADING_CNT']),
    isShowDlg : function (){
            
        if(this.GET_SHOW_LOADING_CNT <= 0) return false;
        
        return true;

    },
  
  },
  methods: {
    
  }
}
</script>