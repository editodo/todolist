<template>
  <div>
    <v-data-table 
      :headers="headers"
      :items="items"
      class="std_datatable cursor_p"
      dense      
      hide-default-footer
      :items-per-page="itemPerPage" 
      :page.sync="page"       
      @page-count="pageCount = $event"
      @click:row="(item)=>{$emit('click:row',item)}"
    >    
      <template
        v-for="(_, slot) of $scopedSlots"
        v-slot:[slot]="scope"
      >
        <slot
          :name="slot"
          v-bind="scope"
        />      
      </template>      
    </v-data-table>
    <div class="d-flex justify-space-between pt-2 mt-2">                              
      <span style="width:100px">
        <v-select   
          v-model="itemPerPage"             
          dense
          
          class="pa-0"                
          label="Page Rows"  
          prepend-icon="dvr"          
          :items="[{text:'10',value:10},{text:'15',value:15},{text:'20',value:20},{text:'25',value:25},{text:'30',value:30},{text:'All',value:-1} ]"
        />              
      </span>
      <span>
        <v-pagination
          v-model="page"
          :length="pageCount"
          total-visible="10"
        />            

      </span>      
      <span>
        <slot name="pageappend" />
      </span>
    </div>    
  </div>
</template>

<script>
export default {
    props: {
      headers:{type: Array, default:()=>{return []}},
      items:{type: Array, default:()=>{return []}},      
      ppage:{type: Number, default:1},
      height:{type:[Number,String], default:undefined},      
      value: {type:String, default:''},      
      options: {type:Object, default:()=>{return {};}}

    },
     data: () => ({
         page:1,
         pageCount:0,
         itemPerPage:15,

     }),
     watch : {
         ppage(val){             
             this.page = val;
         }


     }, 
    created : function(){
        //Number(this.$route.params.page);
      this.page = 1
    },
     methods:{
         
     }

}
</script>

<style>

</style>