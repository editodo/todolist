<template>
  <div class="pt-1">
    <v-card
      color="grey lighten-5 "
      class="baseheight"
    >
      <v-toolbar
        color="primary"
        dark
        flat
        dense
        height="40px"
      >
        <v-toolbar-title dense>
          <v-icon>device_hub</v-icon> 과제제안서
        </v-toolbar-title>
        <v-spacer />            
        <!--필요시 여기에 버튼을 넣는다. -->
      </v-toolbar>
      <v-card-text>
        여기에 내용을 넣는다.
        <div id="editor_area2" />
        11
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */


export default {
    components: {
      
    },
    data: () => ({
        defaultData:'',   
        editor : null,          
    }),
    computed:{

    },
    mounted() {
        // eslint-disable-next-line no-undef
        DEXT5.config.EditorHolder = "editor_area2";
        // eslint-disable-next-line no-undef
        this.editor = new Dext5editor("editor2");
    },
    activated:function(){
         
         
    },
  
    created : function(){        
      //초기화는 여기서..
        console.log('created 1');
    },

    methods : {
        //여기에 함수들
        test(){
            
        }

    }

}
</script>

<style>

</style>