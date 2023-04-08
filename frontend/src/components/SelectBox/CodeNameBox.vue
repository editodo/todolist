<template>
    <span> {{ GetCodeName }} </span>
</template>
<script>
import CONST from '@/const'
import axios from 'axios'
import {mapGetters, mapMutations} from 'vuex';

export default {

    props: {
      sourceUrl: {type:String, default:''},      
      searchItem : {type:Object, default: ()=> { return {}}},
      value: {type:String, default:''},            
      itemText:{type:String, default:'text'},
      itemValue:{type:String, default:'value'},
      activeCache:{type:Boolean, default:false}   //캐쉬를 활성화 한다.
    },
     data: () => ({
      sourceList : [],    //소스 리스트   
      CurrentVal:'',     
     }),     
    computed: {
      ...mapGetters({        
        GET_CHCHE_LIST : 'GET_CHCHE_LIST'    //캐쉬 정보를 Vuex에서 가져온다.        
      }),
      GetCodeName: function () {
        if(this.sourceList.length == 0) return '';

        for(let i = 0; i <  this.sourceList.length ;i++)
        {
          var item = this.sourceList[i];
          if(item[this.itemValue] == this.value)
          {
              return item[this.itemText]; //찾았다 꾀꼬리~
          }
        }

        return '';  //못찾겠다 꾀꼬리~
        
      }
    },
    created : async function(){

      if(this.activeCache == true)
      {
        //캐쉬에 등록된 데이터가 있는지 확인               
        if(this.GET_CHCHE_LIST[this.sourceUrl] == undefined)
        {
            //미등록됨
            console.log('캐쉬없음');
            await this.selectList(); //소스데이터를 가져온다.      
        }
        else
        {
          console.log('캐쉬확인');
          this.sourceList = this.GET_CHCHE_LIST[this.sourceUrl];
        }
      }
      else
      {
          await this.selectList(); //소스데이터를 가져온다.      
      }
    },
     methods:{    
        ...mapMutations(['SET_CHCHE_LIST']),      
        selectList(){   //전체 게시물 리스트를 가져온다.        
          if(this.sourceUrl != '')
          {
            //var myitemText = this.itemText;
            //var myitemValue = this.itemValue;

            return axios.post(`${CONST.HOST_ADDR}${this.sourceUrl}`, this.searchItem).then(
              (ret)=>{                                                     
                this.sourceList = ret.data;   

                if(this.activeCache == true)
                {
                  console.log('캐쉬 등록');
                  //캐쉬에 등록한다.
                  this.SET_CHCHE_LIST(
                    {'url':this.sourceUrl,
                    'list':ret.data});
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