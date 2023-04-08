<style>

</style>

<template>
  <div>
    <div
      v-for="item in menuitem"
      :key="item.id"
    >
      <v-list-item
        v-if="isLeaf(item)"
        link
        :to="item.url"
        color="white"         
        @click="MenuClick"
      >
        <v-list-item-icon>
          <v-icon color="grey">
            {{ item.icon }}
          </v-icon>
        </v-list-item-icon>            
        <v-list-item-title color="grey">
          {{ item.name }}
        </v-list-item-title>
      </v-list-item>

      <div v-if="issubgroup">        
        <v-list-group
          v-if="!isLeaf(item)"
          no-action
          sub-group
          color="white"         
        >          
          <template v-slot:activator>
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
          </template>
          <sidemenuitem
            :menuitem="item.children"
            :issubgroup="true"            
          />                    
        </v-list-group>
      </div>
      <div v-else>
        <v-list-group
          v-if="!isLeaf(item)"
          color="white"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </template>
          <sidemenuitem
            :menuitem="item.children"
            :issubgroup="true"
          />                    
        </v-list-group>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    name : 'Sidemenuitem',    
    //props: ['menuitem'],    
    props: {
      menuitem:{type: Array, default:null},
      issubgroup: {type:Boolean, default:false}
    
    },

    data : () =>({

    }),
    created:function(){
                
    },
    methods:{
      ...mapActions(['TOKEN_UPDATE']),
      MenuClick : function()
      {        
        //this.TOKEN_UPDATE();    //토큰 만료정보를 업데이트 한다.
      },
      isLeaf(item){        
        if(item.children == undefined) return true;
        return (item.children.length == 0);
      }
    }
        
}
</script>

<style scoped>
/* .v-list-item__title {
  font-weight: 400 !important;
} */
</style>