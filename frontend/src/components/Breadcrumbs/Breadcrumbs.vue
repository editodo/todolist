<template>
  <div>
    <v-breadcrumbs
      class="pa-1 pt-2"
      :items="BREADCRUMBS"
      divider=">"
    />    
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    name : 'MyBreadCrumbs',    
    computed : {
        ...mapGetters(['BREADCRUMBS']),        //메뉴정보를 Vuex에서 가져온다.                    
    },
    created:function(){
        
    },
    methods:{
        GetBreadItem : function ()
        {            
           
            return [];
        }

    },   
    
}
</script>

<style>

</style>