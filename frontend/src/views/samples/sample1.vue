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
          <v-icon>device_hub</v-icon> 제목
        </v-toolbar-title>
        <v-spacer />            
        <!--필요시 여기에 버튼을 넣는다. -->
      </v-toolbar>
      <v-card-text>
        여기에 내용을 넣는다.
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
    components: {
      
    },
    data: () => ({
        defaultData:'',              
    }),
    computed:{

    },
    created : function(){        
      //초기화는 여기서..
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