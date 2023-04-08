<template>
<div>

    <v-select
    :value="selectedItems"      
    :items="sourceList"   
    :prepend-icon="prependIcon"
    :label="label"
    :item-text="itemText"      
    :item-value="itemValue"
    :dense="dense"      
    multiple
    @change="myvalue => {updateDate(myvalue)}"
>

    <template v-slot:selection="{ item, index }">
      <v-chip v-if="index === 0">
        <span>{{ item[itemText] }}</span>
      </v-chip>
      <span
        v-if="index === 1"
        class="grey--text text-caption"
      >
        (+{{ selectedItems.length - 1 }} others)
      </span>
    </template>


      <template v-slot:prepend-item>
        <v-list-item
          ripple
          @mousedown.prevent
          @click="toggle"
        >
          <v-list-item-action>
            <v-icon :color="selectedItems.length > 0 ? 'indigo darken-4' : ''">
              {{ icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ activeAllItemText }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>


      <template v-slot:append-item>
        <v-divider class="mb-2"></v-divider>
        <v-list-item disabled>
          <v-list-item-avatar color="grey lighten-3">
            <v-icon>
              mdi-food-apple
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content v-if="AllItem">
            <v-list-item-title>
              Holy smokes, someone call the fruit police!
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-content v-else-if="SomeItem">
            <v-list-item-title>
              Fruit Count
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ selectedItems.length }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-content v-else>
            <v-list-item-title>
              How could you not like fruit?
            </v-list-item-title>
            <v-list-item-subtitle>
              Go ahead, make a selection above!
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

      </template>


  </v-select>


</div>
  
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
export default {

    props: {
      sourceUrl: {type:String, default:''},      
      searchItem : {type:Object, default: ()=> { return {}}},
      value: {type:Array, default: ()=> { return []}},            
      label: {type:String, default:''},            
      itemText:{type:String, default:'text'},
      itemValue:{type:String, default:'value'},
      prependIcon:{type:String, default:''},    
      dense:{type:Boolean, default:false},
      activeAllItem:{type:Boolean, default:false},   //전체 항목 표시 여부
      activeAllItemText:{type:String, default:'전체선택'},   //전체 항목 표시 텍스트

    },
     data: () => ({
      sourceList : [],    //소스 리스트   
      CurrentVal:'',   
      selectedItems: [],  
     }),
     computed: {
        AllItem () {
          return this.selectedItems.length === this.sourceList.length;
        },
        SomeItem(){
            return this.selectedItems.length > 0 && !this.sourceList
        },
        icon () {
          if (this.AllItem) return 'mdi-close-box'
          if (this.SomeItem) return 'mdi-minus-box'
          return 'mdi-checkbox-blank-outline'
        },



    },
     watch : {         

     }, 
    created : async function(){
      await this.selectList(); //소스데이터를 가져온다.      
    },
     methods:{
       toggle () {
          this.$nextTick(() => {

            if (this.AllItem) {
              this.selectedItems = [];
              this.$emit('input', this.selectedItems);
            } else {
              let newItemList = [];              
              for(let i =0;i < this.sourceList.length;i++)
              {
                newItemList.push(this.sourceList[i][this.itemValue]);                
              }
              this.selectedItems = newItemList;

              this.$emit('input', this.selectedItems);

            }
            
          })
        } ,
        updateDate(selVal) {    
            this.selectedItems = selVal;
            this.$emit('input', selVal);
        },
        selectList(){   //전체 게시물 리스트를 가져온다.        
          if(this.sourceUrl != '')
          {
            //var myitemText = this.itemText;
            //var myitemValue = this.itemValue;

            return axios.post(`${CONST.HOST_ADDR}${this.sourceUrl}`, this.searchItem).then(
              (ret)=>{                                     
                this.sourceList = ret.data;            
                
                
                
                // if(this.activeAllItem == true)
                // {
                //   //전체가 필요하다면
                //   var newItem = {};
                //   newItem[this.itemText] = this.activeAllItemText;
                //   newItem[this.itemValue] = '';
                //   if(this.activeAllItemDown == true)
                //   {
                //     this.sourceList.push(newItem);
                //   }
                //   else
                //   {
                //     //제일위에 넣기
                //     this.sourceList.splice(0, 0, newItem);                                    
                //   }
                // }


              }                       
            );
          }
      }, 
         
     }

}
</script>

<style>

</style>