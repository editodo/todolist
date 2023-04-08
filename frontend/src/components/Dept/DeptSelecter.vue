<template>
  <v-menu
    v-model="fromMenu"                    
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="seldate"
        :label="label"
        prepend-icon="event"
        readonly
        class="pt-0 pb-0"                        
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="seldate"
      class="pt-0 pb-0"
      locale="kr"
      @input="fromMenu = false"
      @change="updateDate()"
    />
  </v-menu>
</template>

<script>
export default {   
    
     props: {
      label:{type: String, default:'달력'},      
      value: {type:String, default:''},
      today:{type:Boolean, default: false}
      //options: {type:Object, default:()=>(return {};)}

    },    
    data: () => ({
      seldate : '', //선택된 날짜
      fromMenu:false,   
      options: {
        
      }
    }),
    watch:{
        value(val){
            this.seldate = val;
        }
    },
    created : function(){               
        if(this.today)
         {             
             this.seldate = this.$moment(new Date).format("YYYY-MM-DD");
             this.$emit('input', this.seldate);
         }
         else
         {
              this.seldate = this.value;
         }              
    },    
    methods:{
        updateDate() {            
            this.$emit('input', this.seldate);
        }
    }

}
</script>

<style>

</style>