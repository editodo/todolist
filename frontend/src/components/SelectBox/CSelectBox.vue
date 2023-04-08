<template>


  <v-select
  :value="value"      
  :items="sourceList"   
  :prepend-icon="prependIcon"
  :label="label"
  :item-text="itemText"      
  :item-value="itemValue"
  :dense="dense"      
  @change="myvalue => {updateDate(myvalue)}"
>
</v-select>


     <!-- <v-select
      :value="value"      
      :items="sourceList"      
      :class="$attrs.class"      
      :attrs="$attrs"
      :prepend-icon="prependIcon"
      :label="label"
      :item-text="itemText"      
      :item-value="itemValue"            
      @change="myvalue => {updateDate(myvalue)}"
    >
    </v-select>
     -->

</template>

<script>
import CONST from '@/const'
import axios from 'axios'
export default {

    props: {
      sourceUrl: {type:String, default:''},             //URL로 리스트업할때 사용
      searchItem : {type:Object, default: ()=> { return {}}},
      //url: {type:String, default:''},                           
      flagName: {type:String, default:''},              //시스템 플레그에서 리스트 업할때 사용
      value: {type:String, default:''},            
      label: {type:String, default:''},            
      itemText:{type:String, default:'text'},
      itemValue:{type:String, default:'value'},
      prependIcon:{type:String, default:''},    
      dense:{type:Boolean, default:false},
      activeAllItem:{type:Boolean, default:false},   //전체 항목 표시 여부
      activeAllItemText:{type:String, default:'전체'},   //전체 항목 표시 텍스트
      activeAllItemDown:{type:Boolean, default:false},   //전체 항목 제일 아래로 옵션


    },
     data: () => ({
      sourceList : [],    //소스 리스트   
      CurrentVal:'',     
     }),
     watch : {         
      searchItem: function () {
        this.selectList(); //소스데이터를 가져온다.          
      }

     }, 
    created : async function(){
      await this.selectList(); //소스데이터를 가져온다.      
    },
     methods:{
        updateDate(selVal) {    
            this.CurrentVal = selVal;
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
                if(this.activeAllItem == true)
                {
                  //전체가 필요하다면
                  var newItem = {};
                  newItem[this.itemText] = this.activeAllItemText;
                  newItem[this.itemValue] = '';
                  if(this.activeAllItemDown == true)
                  {
                    this.sourceList.push(newItem);
                  }
                  else
                  {
                    //제일위에 넣기
                    this.sourceList.splice(0, 0, newItem);                                    
                  }
                  
                }
              }                       
            );
          }
          else if(this.flagName != '')
          {
            var searchCond = {'FLAG_NAME':this.flagName};
            this.itemText = 'FLAG_DATA';
            this.itemValue = 'FLAG_CODE';
            return axios.post(`${CONST.HOST_ADDR}/SystemFlag/GetSystemFlag`, searchCond).then(
              (ret)=>{                                     
                this.sourceList = ret.data;            
                if(this.activeAllItem == true)
                {
                  //전체가 필요하다면
                  var newItem = {};
                  newItem[this.itemText] = this.activeAllItemText;
                  newItem[this.itemValue] = '';
                  if(this.activeAllItemDown == true)
                  {
                    this.sourceList.push(newItem);
                  }
                  else
                  {
                    //제일위에 넣기
                    this.sourceList.splice(0, 0, newItem);                                    
                  }                  
                }
              }                       
            );
          }


      }, 
         
     }

}
</script>

<style>

</style>