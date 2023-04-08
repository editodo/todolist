<style>

</style>
<template>
  <div>       
    <v-list dense>  
      <v-subheader>
        Menu
      </v-subheader>         
      <sidemenuitem :menuitem="MenuList" />                    
    </v-list>
  </div>
</template>

<script>
//import axios from 'axios';
//import CONST from '@/const';
import sidemenuitem from '@/components/SideMenu/SideMenuItem.vue'
import {mapGetters,mapActions} from 'vuex';

//import router from '@/router';

export default {

  components: {
    sidemenuitem    //사이드 메뉴 아이템
  },
  data : () =>(
    {        
    }
  ),      
  computed : {
      //Vuex로부터 메뉴정보를 가져온다.
      ...mapGetters({
        MenuList : 'MENULIST',        
      }),
      currentUrl : function(){  //현재의 경로를 반환한다.                            
        return this.$route.fullPath;
      }
  },
  created: function(){
    this.GET_MENULIST_PROC();   //메뉴리스트를 가져온다.
  },  
  methods : {        
    ...mapActions(['GET_MENULIST_PROC']),   
  },
  
}

</script>
